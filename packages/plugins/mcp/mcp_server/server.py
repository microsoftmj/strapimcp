import os
import uvicorn
import asyncio
import requests
from typing import Dict, List, Any, Optional, Union
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
    content: List[Union[TextContent, ImageContent, EmbeddedResource]] = []

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
        ),
        Tool(
            name="content.findOne",
            description="Retrieve a specific content entry",
            parameters=[
                ToolParameter(
                    name="contentType",
                    type="string",
                    description="The content type to query",
                    required=True
                ),
                ToolParameter(
                    name="id",
                    type="string",
                    description="The ID of the entry to retrieve",
                    required=True
                )
            ]
        ),
        Tool(
            name="content.create",
            description="Create a new content entry",
            parameters=[
                ToolParameter(
                    name="contentType",
                    type="string",
                    description="The content type to create",
                    required=True
                ),
                ToolParameter(
                    name="data",
                    type="object",
                    description="The data for the new entry",
                    required=True
                )
            ]
        ),
        Tool(
            name="content.update",
            description="Update an existing content entry",
            parameters=[
                ToolParameter(
                    name="contentType",
                    type="string",
                    description="The content type to update",
                    required=True
                ),
                ToolParameter(
                    name="id",
                    type="string",
                    description="The ID of the entry to update",
                    required=True
                ),
                ToolParameter(
                    name="data",
                    type="object",
                    description="The updated data",
                    required=True
                )
            ]
        ),
        Tool(
            name="content.delete",
            description="Delete a content entry",
            parameters=[
                ToolParameter(
                    name="contentType",
                    type="string",
                    description="The content type to delete from",
                    required=True
                ),
                ToolParameter(
                    name="id",
                    type="string",
                    description="The ID of the entry to delete",
                    required=True
                )
            ]
        ),
        Tool(
            name="schema.getContentTypes",
            description="Retrieve content type definitions",
            parameters=[]
        )
    ]
    return {"tools": tools}

@app.post("/tools/call")
async def call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Call a tool with the given arguments"""
    
    # Content type listing
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
    
    # Content querying
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
    
    # Get single content entry
    elif name == "content.findOne":
        content_type = arguments.get("contentType")
        entry_id = arguments.get("id")
        
        if not content_type or not entry_id:
            raise HTTPException(status_code=400, detail="contentType and id are required")
        
        try:
            response = requests.get(f"{STRAPI_URL}/api/{content_type}/{entry_id}")
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=f"Failed to fetch {content_type}/{entry_id}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Create content entry
    elif name == "content.create":
        content_type = arguments.get("contentType")
        data = arguments.get("data")
        
        if not content_type or not data:
            raise HTTPException(status_code=400, detail="contentType and data are required")
        
        try:
            response = requests.post(
                f"{STRAPI_URL}/api/{content_type}",
                json={"data": data}
            )
            if response.status_code in (200, 201):
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=f"Failed to create {content_type}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Update content entry
    elif name == "content.update":
        content_type = arguments.get("contentType")
        entry_id = arguments.get("id")
        data = arguments.get("data")
        
        if not content_type or not entry_id or not data:
            raise HTTPException(status_code=400, detail="contentType, id, and data are required")
        
        try:
            response = requests.put(
                f"{STRAPI_URL}/api/{content_type}/{entry_id}",
                json={"data": data}
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=f"Failed to update {content_type}/{entry_id}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Delete content entry
    elif name == "content.delete":
        content_type = arguments.get("contentType")
        entry_id = arguments.get("id")
        
        if not content_type or not entry_id:
            raise HTTPException(status_code=400, detail="contentType and id are required")
        
        try:
            response = requests.delete(f"{STRAPI_URL}/api/{content_type}/{entry_id}")
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=f"Failed to delete {content_type}/{entry_id}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Get content type schema
    elif name == "schema.getContentTypes":
        try:
            response = requests.get(f"{STRAPI_URL}/api/content-type-builder/content-types")
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch content types schema")
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
