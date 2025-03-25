# Comprehensive Installation Guide for Strapi MCP Plugin

This guide provides detailed instructions for installing and configuring the Strapi MCP Plugin, which enables external service access to Strapi via the Model Context Protocol (MCP).

## Prerequisites

- Node.js version >=18.0.0 <=22.x.x (required for Strapi)
- Python 3.8+ (required for the MCP server)
- A Strapi project (v4.x or later)

## Step 1: Set Up Node.js Environment

Strapi has strict Node.js version requirements. If you're using nvm, you can set up the correct Node.js version with:

```bash
# Install Node.js 18 (or another compatible version)
nvm install 18

# Use Node.js 18
nvm use 18

# Verify the version
node -v
```

## Step 2: Create or Use an Existing Strapi Project

If you don't have a Strapi project yet, create one:

```bash
# Create a new Strapi project
npx create-strapi-app@latest my-strapi-project

# Navigate to your project
cd my-strapi-project
```

If you already have a Strapi project, navigate to it:

```bash
cd path/to/your-strapi-project
```

## Step 3: Install the MCP Plugin

### Option 1: Install from GitHub

1. Create the plugins directory structure:

```bash
mkdir -p plugins
```

2. Clone the MCP plugin repository:

```bash
git clone https://github.com/microsoftmj/strapimcp.git plugins/mcp
```

3. Install Python dependencies:

```bash
pip install fastapi uvicorn pydantic requests
```

### Option 2: Install as npm package (Coming Soon)

Once published to npm, you'll be able to install with:

```bash
npm install @strapi/plugin-mcp
```

## Step 4: Configure the Plugin

The plugin can be configured through environment variables:

- `MCP_PORT`: Port for the MCP server (default: 8080)
- `MCP_ENABLED`: Enable/disable the MCP server (default: true)

You can set these variables in your `.env` file:

```
MCP_PORT=8080
MCP_ENABLED=true
```

## Step 5: Start Strapi with the MCP Plugin

Start your Strapi application:

```bash
npm run develop
```

The MCP server should start automatically when Strapi boots. You should see output in the console indicating that the MCP server has started.

If you want to disable the MCP server, you can start Strapi with the `--no-mcp` flag:

```bash
npm run develop -- --no-mcp
```

## Step 6: Verify the Installation

To verify that the MCP server is running, you can access the health endpoint:

```bash
curl http://localhost:8080/health
```

You should receive a response indicating that the server is healthy.

## Step 7: Manually Start the MCP Server (If Needed)

If the MCP server doesn't start automatically with Strapi, you can start it manually:

```bash
# Navigate to the plugin directory
cd plugins/mcp

# Start the MCP server
python -m mcp_server.server
```

## Troubleshooting

### Common Issues

1. **Node.js Version Mismatch**

   Error:
   ```
   Error: You are running Node.js X.X.X
   Strapi requires Node.js >=18.0.0 <=22.x.x
   ```

   Solution: Switch to a compatible Node.js version using nvm:
   ```bash
   nvm install 18
   nvm use 18
   ```

2. **Python Dependencies Missing**

   Error:
   ```
   ModuleNotFoundError: No module named 'fastapi'
   ```

   Solution: Install the required Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic requests
   ```

3. **Port Already in Use**

   Error:
   ```
   Error: Address already in use
   ```

   Solution: Change the MCP server port by setting the `MCP_PORT` environment variable:
   ```
   MCP_PORT=8081
   ```

4. **MCP Server Not Starting**

   If the MCP server doesn't start automatically with Strapi, check:
   - The plugin is correctly installed in the `plugins/mcp` directory
   - The `MCP_ENABLED` environment variable is set to `true`
   - There are no errors in the Strapi logs

   You can also try starting the MCP server manually as described in Step 7.

## Next Steps

After installing the MCP plugin, you can:

1. [Configure Claude Desktop to use the MCP server](./integrations/CLAUDE_DESKTOP_INTEGRATION.md)
2. [Learn about external service integration](./EXTERNAL_SERVICE_INTEGRATION.md)
3. [Explore the MCP wrapper documentation](./MCP_WRAPPER_DOCUMENTATION.md)
