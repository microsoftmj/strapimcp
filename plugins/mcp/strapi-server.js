'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mcpServerProcess = null;

/**
 * Check if Python and required packages are installed
 * @returns {Promise<boolean>}
 */
const checkPythonDependencies = async () => {
  return new Promise((resolve) => {
    const pip = spawn('pip', ['list']);
    let output = '';

    pip.stdout.on('data', (data) => {
      output += data.toString();
    });

    pip.on('close', (code) => {
      if (code !== 0) {
        strapi.log.warn('Failed to check Python dependencies');
        resolve(false);
        return;
      }

      const hasFastAPI = output.includes('fastapi');
      const hasUvicorn = output.includes('uvicorn');
      const hasPydantic = output.includes('pydantic');
      const hasRequests = output.includes('requests');

      if (!hasFastAPI || !hasUvicorn || !hasPydantic || !hasRequests) {
        strapi.log.warn('Missing Python dependencies for MCP server');
        strapi.log.warn('Please install: pip install fastapi uvicorn pydantic requests');
        resolve(false);
        return;
      }

      resolve(true);
    });
  });
};

/**
 * Start the MCP server
 * @param {object} strapi - Strapi instance
 * @returns {Promise<void>}
 */
const startMCPServer = async (strapi) => {
  // Check if --no-mcp flag is provided
  const noMCP = process.argv.includes('--no-mcp');
  if (noMCP) {
    strapi.log.info('MCP server disabled via --no-mcp flag');
    return;
  }

  // Check Python dependencies
  const hasDependencies = await checkPythonDependencies();
  if (!hasDependencies) {
    strapi.log.warn('MCP server not started due to missing dependencies');
    return;
  }

  // Create MCP server directory if it doesn't exist
  const mcpServerDir = path.join(__dirname, 'mcp_server');
  if (!fs.existsSync(mcpServerDir)) {
    fs.mkdirSync(mcpServerDir, { recursive: true });
  }

  // Create Python MCP server files if they don't exist
  createMCPServerFiles(mcpServerDir);

  // Start MCP server
  const port = process.env.MCP_PORT || 8080;
  mcpServerProcess = spawn('python', ['-m', 'mcp_server'], {
    cwd: __dirname,
    env: {
      ...process.env,
      STRAPI_HOST: process.env.HOST || '127.0.0.1',
      STRAPI_PORT: process.env.PORT || 1337,
      MCP_PORT: port,
    },
  });

  mcpServerProcess.stdout.on('data', (data) => {
    strapi.log.debug(`MCP server: ${data.toString().trim()}`);
  });

  mcpServerProcess.stderr.on('data', (data) => {
    strapi.log.error(`MCP server error: ${data.toString().trim()}`);
  });

  mcpServerProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      strapi.log.error(`MCP server exited with code ${code}`);
    } else {
      strapi.log.info('MCP server stopped');
    }
    mcpServerProcess = null;
  });

  strapi.log.info(`MCP server started on port ${port}`);
};

/**
 * Create MCP server Python files
 * @param {string} mcpServerDir - Directory to create files in
 */
const createMCPServerFiles = (mcpServerDir) => {
  // Create __init__.py
  const initPath = path.join(mcpServerDir, '__init__.py');
  if (!fs.existsSync(initPath)) {
    fs.writeFileSync(initPath, '# MCP Server for Strapi\n');
  }

  // Create __main__.py
  const mainPath = path.join(mcpServerDir, '__main__.py');
  if (!fs.existsSync(mainPath)) {
    fs.writeFileSync(
      mainPath,
      `import sys
import os
from mcp_server.server import main

if __name__ == "__main__":
    port = int(os.environ.get("MCP_PORT", 8080))
    sys.exit(main(port=port))
`
    );
  }

  // Create server.py
  const serverPath = path.join(mcpServerDir, 'server.py');
  if (!fs.existsSync(serverPath)) {
    fs.writeFileSync(
      serverPath,
      `import os
import uvicorn
import asyncio
import requests
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Strapi connection settings
STRAPI_HOST = os.environ.get("STRAPI_HOST", "127.0.0.1")
STRAPI_PORT = int(os.environ.get("STRAPI_PORT", 1337))
STRAPI_URL = f"http://{STRAPI_HOST}:{STRAPI_PORT}"

# Create FastAPI app
app = FastAPI(title="Strapi MCP Server")

# MCP Models
class TextContent(BaseModel):
    type: str = "text"
    text: str

class ImageContent(BaseModel):
    type: str = "image"
    url: str
    alt: Optional[str] = None

class EmbeddedResource(BaseModel):
    type: str = "embedded_resource"
    url: str
    title: Optional[str] = None
    description: Optional[str] = None

class ToolParameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool = False

class Tool(BaseModel):
    name: str
    description: str
    parameters: List[ToolParameter] = []

class Resource(BaseModel):
    name: str
    description: str
    content: List[TextContent | ImageContent | EmbeddedResource] = []

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check if Strapi is accessible
        response = requests.get(f"{STRAPI_URL}/admin/init")
        if response.status_code == 200:
            return {"status": "healthy", "strapi_connected": True}
        else:
            return {"status": "degraded", "strapi_connected": False}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# MCP Protocol endpoints
@app.get("/tools/list")
async def list_tools() -> Dict[str, List[Tool]]:
    """List available tools"""
    tools = [
        Tool(
            name="content.list",
            description="List available content types",
            parameters=[]
        ),
        Tool(
            name="content.find",
            description="Query content entries with filters",
            parameters=[
                ToolParameter(
                    name="contentType",
                    type="string",
                    description="The content type to query",
                    required=True
                ),
                ToolParameter(
                    name="filters",
                    type="object",
                    description="Filters to apply to the query",
                    required=False
                )
            ]
        )
    ]
    return {"tools": tools}

@app.post("/tools/call")
async def call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Call a tool with the given arguments"""
    if name == "content.list":
        try:
            response = requests.get(f"{STRAPI_URL}/api/content-type-builder/content-types")
            if response.status_code == 200:
                content_types = response.json()
                return {"contentTypes": content_types}
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch content types")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    elif name == "content.find":
        content_type = arguments.get("contentType")
        filters = arguments.get("filters", {})
        
        if not content_type:
            raise HTTPException(status_code=400, detail="contentType is required")
        
        try:
            response = requests.get(
                f"{STRAPI_URL}/api/{content_type}",
                params={"filters": filters}
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=f"Failed to fetch {content_type}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    else:
        raise HTTPException(status_code=404, detail=f"Tool '{name}' not found")

@app.get("/resources/list")
async def list_resources() -> Dict[str, List[Resource]]:
    """List available resources"""
    # This is a placeholder - in a real implementation, we would fetch resources from Strapi
    resources = []
    return {"resources": resources}

def main(port: int = 8080):
    """Run the MCP server"""
    uvicorn.run("mcp_server.server:app", host="0.0.0.0", port=port, log_level="info")
    return 0

if __name__ == "__main__":
    main()
`
    );
  }
};

/**
 * Stop the MCP server
 */
const stopMCPServer = () => {
  if (mcpServerProcess) {
    mcpServerProcess.kill();
    mcpServerProcess = null;
  }
};

module.exports = () => ({
  /**
   * Register phase
   */
  register({ strapi }) {
    // Register configuration
    strapi.config.set('plugin.mcp', {
      enabled: true,
      port: process.env.MCP_PORT || 8080,
    });
  },

  /**
   * Bootstrap phase
   */
  async bootstrap({ strapi }) {
    // Start MCP server
    await startMCPServer(strapi);
  },

  /**
   * Destroy phase
   */
  destroy() {
    // Stop MCP server
    stopMCPServer();
  },
});
