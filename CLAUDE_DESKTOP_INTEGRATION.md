# Claude Desktop Integration Guide for Strapi MCP

This guide explains how to configure Claude Desktop to use the Strapi MCP server for content management.

## Prerequisites

- Strapi project with MCP plugin installed and running
- Claude Desktop application installed
- Node.js version 18.x or 20.x (required for Strapi)

## Configuration Steps

### 1. Start Strapi with MCP Plugin

First, ensure your Strapi project is running with the MCP plugin:

```bash
# Navigate to your Strapi project
cd my-strapi-project

# Start Strapi in development mode
npm run develop
```

The MCP server will automatically start on port 8080 (default).

### 2. Configure Claude Desktop

Claude Desktop uses a configuration file to connect to MCP servers. Follow these steps to configure it:

1. Locate your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. Edit the configuration file to add the Strapi MCP server:

```json
{
  "mcpServers": {
    "strapi": {
      "url": "http://YOUR_STRAPI_MCP_SERVER_ADDRESS:8080"
    }
  }
}
```

If you already have other MCP servers configured (like the filesystem server), add the Strapi configuration alongside them:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/directory1",
        "/path/to/directory2"
      ]
    },
    "strapi": {
      "url": "http://YOUR_STRAPI_MCP_SERVER_ADDRESS:8080"
    }
  }
}
```

**Important Notes:**
- Use only the `url` field for the Strapi MCP server
- Do not include `command` or `args` fields for the Strapi server
- Make sure to use the correct port if you've configured a custom port

### 3. Restart Claude Desktop

After saving the configuration file, completely restart Claude Desktop to apply the changes.

### 4. Test the Integration

To verify that Claude Desktop is properly connected to your Strapi MCP server:

1. Start a new conversation in Claude Desktop
2. Ask Claude about the available Strapi tools:

```
What tools do you have available from the Strapi MCP server?
```

Claude should respond with a list of available tools, including content management tools like `content.list`, `content.find`, etc.

## Troubleshooting

If Claude Desktop doesn't recognize the Strapi MCP tools:

1. **Check MCP Server Status**
   - Verify that the Strapi MCP server is running
   - Check that you can access the health endpoint at your MCP server address

2. **Verify Configuration**
   - Make sure the configuration file has the correct format
   - Check that the URL is correct and points to your MCP server
   - Ensure you're using only the `url` field for the Strapi server

3. **Restart Services**
   - Restart the Strapi server
   - Restart Claude Desktop

4. **Check Logs**
   - Look for errors in the Strapi logs
   - Check the Claude Desktop logs for connection issues

## Common Issues

### Incorrect Configuration Format

The most common issue is using the wrong configuration format. Make sure you're using:

```json
"strapi": {
  "url": "http://YOUR_STRAPI_MCP_SERVER_ADDRESS:8080"
}
```

And NOT:

```json
"strapi": {
  "command": "npx",
  "args": [
    "strapi",
    "start",
    "--port",
    "8080"
  ],
  "url": "http://127.0.0.1:8080"
}
```

The `command` and `args` fields should only be used for MCP servers that Claude Desktop needs to start itself, not for externally managed servers like the Strapi MCP server.

### Connection Refused

If you see "Connection refused" errors, make sure:
- Strapi is running
- The MCP server is running on the expected port
- There are no firewall rules blocking the connection
