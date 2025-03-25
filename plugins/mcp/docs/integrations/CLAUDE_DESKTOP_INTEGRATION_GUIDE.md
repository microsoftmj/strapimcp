# Claude Desktop Integration Guide for Strapi MCP

This guide explains how to configure Claude Desktop to use the Strapi MCP server for content management.

## Prerequisites

- Strapi project with MCP plugin installed and running
- Claude Desktop application installed
- Node.js version 18.x or 20.x (required for Strapi)

## Step 1: Install and Configure the Strapi MCP Plugin

Before configuring Claude Desktop, make sure you have:

1. Installed the Strapi MCP plugin following the [Installation Guide](../INSTALLATION_GUIDE.md)
2. Started your Strapi project with the MCP plugin enabled
3. Verified that the MCP server is running on port 8080 (or your custom port)

## Step 2: Configure Claude Desktop

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
      "url": "http://127.0.0.1:8080"
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
      "url": "http://127.0.0.1:8080"
    }
  }
}
```

**Important Notes:**
- Use only the `url` field for the Strapi MCP server
- Do not include `command` or `args` fields for the Strapi server
- Make sure to use the correct port if you've configured a custom port

## Step 3: Restart Claude Desktop

After saving the configuration file, completely restart Claude Desktop to apply the changes.

## Step 4: Test the Integration

To verify that Claude Desktop is properly connected to your Strapi MCP server:

1. Start a new conversation in Claude Desktop
2. Ask Claude about the available Strapi tools:

```
What tools do you have available from the Strapi MCP server?
```

Claude should respond with a list of available tools, including content management tools like `content.list`, `content.find`, etc.

## Example Prompts

Once the integration is working, you can use prompts like these to interact with your Strapi content:

- "Show me all available content types in Strapi"
- "Get the latest articles from Strapi"
- "Create a new blog post in Strapi with the title 'MCP Integration'"
- "Update the article with ID 1 to change its title to 'Updated Title'"

## Troubleshooting

If Claude Desktop doesn't recognize the Strapi MCP tools:

1. **Check MCP Server Status**
   - Verify that the Strapi MCP server is running
   - Check that you can access `http://localhost:8080/health` in your browser

2. **Verify Configuration**
   - Make sure the configuration file has the correct format
   - Check that the URL is correct and points to your MCP server
   - Ensure you're using only the `url` field for the Strapi server

3. **Restart Services**
   - Restart the Strapi server
   - Restart the MCP server (manually if needed)
   - Restart Claude Desktop

4. **Check Logs**
   - Look for errors in the Strapi logs
   - Check the Claude Desktop logs for connection issues

## Advanced Configuration

### Custom Port

If you're running the MCP server on a custom port, update the URL accordingly:

```json
{
  "mcpServers": {
    "strapi": {
      "url": "http://127.0.0.1:8081"
    }
  }
}
```

### Authentication (Future Feature)

When authentication is implemented, you'll be able to include authentication details:

```json
{
  "mcpServers": {
    "strapi": {
      "url": "http://127.0.0.1:8080",
      "auth": {
        "type": "bearer",
        "token": "your-api-token"
      }
    }
  }
}
```

## Next Steps

After successfully integrating Claude Desktop with your Strapi MCP server, you can:

1. Create content types in Strapi to store your data
2. Use Claude to query and manipulate that data
3. Build AI-powered workflows that interact with your Strapi content
