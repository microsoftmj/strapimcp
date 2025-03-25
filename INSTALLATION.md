# Strapi MCP Plugin Installation Guide

This guide provides instructions for installing and configuring the Strapi MCP Plugin, which enables external service access to Strapi via the Model Context Protocol (MCP).

## Prerequisites

- Node.js version >=18.0.0 <=22.x.x (required for Strapi)
- Python 3.8+ (required for the MCP server)
- A Strapi project (v4.x or later)

## Installation Steps

### 1. Set Up Node.js Environment

Strapi has strict Node.js version requirements. If you're using nvm, you can set up the correct Node.js version with:

```bash
# Install Node.js 18 (or another compatible version)
nvm install 18

# Use Node.js 18
nvm use 18

# Verify the version
node -v
```

### 2. Create or Use an Existing Strapi Project

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

### 3. Install the MCP Plugin

Clone the MCP plugin repository directly into your Strapi project's plugins directory:

```bash
# Create the plugins directory if it doesn't exist
mkdir -p plugins

# Clone the plugin repository
git clone https://github.com/microsoftmj/strapimcp.git plugins/mcp
```

### 4. Install Python Dependencies

Install the required Python packages:

```bash
pip install fastapi uvicorn pydantic requests
```

### 5. Configure the Plugin

Create a `.env` file in your Strapi project root (if it doesn't exist already) and add the following configuration:

```
# MCP Server Configuration
MCP_PORT=8080
MCP_ENABLED=true

# Strapi Configuration
STRAPI_HOST=127.0.0.1
STRAPI_PORT=1337
```

You can adjust these values as needed for your environment.

### 6. Start Strapi with the MCP Plugin

Start your Strapi application:

```bash
npm run develop
```

The MCP server should start automatically when Strapi boots. You should see output in the console indicating that the MCP server has started.

## Verifying the Installation

To verify that the MCP server is running, you can access the health endpoint:

```bash
curl http://localhost:8080/health
```

You should receive a response indicating that the server is healthy.

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

## Next Steps

After installing the MCP plugin, you can:

1. Configure Claude Desktop to use the MCP server
2. Explore the available MCP tools and endpoints
3. Integrate with other external services that support MCP
