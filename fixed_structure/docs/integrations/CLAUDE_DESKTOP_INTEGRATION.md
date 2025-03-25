# Claude Desktop Integration with Strapi MCP

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

To configure Claude Desktop to use your Strapi MCP server:

1. Open Claude Desktop application
2. Go to Settings > Integrations
3. Select "Add MCP Server"
4. Enter the following details:
   - Name: Strapi Content
   - URL: http://localhost:8080 (or your custom MCP server URL)
   - Authentication: None (or configure as needed)
5. Click "Test Connection" to verify
6. Save the configuration

### 3. Using Strapi Content in Claude

Once configured, you can use Strapi content in your conversations with Claude:

1. Start a new conversation in Claude Desktop
2. Claude will automatically discover available tools from your Strapi MCP server
3. You can ask Claude to:
   - List available content types
   - Retrieve content
   - Create new content
   - Update existing content

Example prompts:

- "Show me all available content types in Strapi"
- "Get the latest articles from Strapi"
- "Create a new blog post in Strapi with the title 'MCP Integration'"

## Troubleshooting

If Claude Desktop cannot connect to your Strapi MCP server:

1. Verify Strapi is running and the MCP server is active
2. Check that the MCP server URL is correct
3. Ensure there are no firewall or network restrictions
4. Check the Strapi logs for any MCP server errors

## Security Considerations

- For production use, configure proper authentication for your MCP server
- Use HTTPS for all connections in production environments
- Limit the content types and operations available through MCP as needed

## Additional Resources

- [Strapi MCP Plugin Documentation](../MCP_WRAPPER_DOCUMENTATION.md)
- [External Service Integration Guide](../EXTERNAL_SERVICE_INTEGRATION.md)
- [Claude Desktop Documentation](https://www.anthropic.com/claude-desktop)
