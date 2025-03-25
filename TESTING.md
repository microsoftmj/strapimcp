# Testing the Strapi MCP Plugin

This guide provides step-by-step instructions for testing the Strapi MCP Plugin with a fresh Strapi installation.

## Prerequisites

- Node.js version >=18.0.0 <=22.x.x (required for Strapi)
- Python 3.8+ (required for the MCP server)
- npm or yarn package manager

## Step 1: Set Up Node.js Environment

Strapi has strict Node.js version requirements. If you're using nvm, you can set up the correct Node.js version with:

```bash
# Check current Node.js version
node -v

# If needed, install and use a compatible version
nvm install 18
nvm use 18

# Verify the version
node -v
```

## Step 2: Create a New Strapi Project

Create a fresh Strapi project:

```bash
# Create a new Strapi project
npx create-strapi-app@latest my-strapi-project

# Navigate to your project
cd my-strapi-project
```

## Step 3: Install the MCP Plugin

Install the MCP plugin directly into your Strapi project's plugins directory:

```bash
# Create the plugins directory
mkdir -p plugins

# Clone the MCP plugin repository
git clone https://github.com/microsoftmj/strapimcp.git plugins/mcp
```

## Step 4: Configure the Environment

Copy the example environment configuration to your project root:

```bash
# Copy the environment configuration
cp plugins/mcp/.env.example .env
```

This file contains the following configuration:

```
# MCP Server Configuration
MCP_PORT=8080
MCP_ENABLED=true

# Strapi Configuration
STRAPI_HOST=127.0.0.1
STRAPI_PORT=1337
```

You can adjust these values as needed for your environment.

## Step 5: Install Python Dependencies

Install the required Python packages:

```bash
# Install Python dependencies
pip install fastapi uvicorn pydantic requests
```

## Step 6: Start Strapi with the MCP Plugin

Start your Strapi application:

```bash
# Start Strapi in development mode
npm run develop
```

The MCP server should start automatically when Strapi boots. You should see output in the console indicating that the MCP server has started.

## Step 7: Verify the Installation

To verify that the MCP server is running, you can access the health endpoint:

```bash
curl http://localhost:8080/health
```

You should receive a response indicating that the server is healthy.

## Step 8: Configure Claude Desktop (Optional)

If you want to test the integration with Claude Desktop, follow the instructions in the [Claude Desktop Integration Guide](./CLAUDE_DESKTOP_INTEGRATION.md).

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

   Solution: Change the MCP server port by setting the `MCP_PORT` environment variable in your `.env` file:
   ```
   MCP_PORT=8081
   ```

4. **MCP Server Not Starting**

   If the MCP server doesn't start automatically with Strapi, check:
   - The plugin is correctly installed in the `plugins/mcp` directory
   - The `MCP_ENABLED` environment variable is set to `true`
   - There are no errors in the Strapi logs

   You can also try starting the MCP server manually:
   ```bash
   cd plugins/mcp
   python -m mcp_server.server
   ```
