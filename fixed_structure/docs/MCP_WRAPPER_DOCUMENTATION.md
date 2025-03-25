# Strapi MCP Wrapper Service Documentation

## Architecture Overview

The Strapi MCP Wrapper Service is designed as a plugin for Strapi that enables external service access via the Model Context Protocol (MCP). The architecture consists of the following components:

1. **Strapi Plugin Integration**
   - Implemented as a standard Strapi plugin
   - Hooks into Strapi's lifecycle methods (register, bootstrap, destroy)
   - Configurable through environment variables and command-line flags

2. **MCP Server Component**
   - FastAPI/Uvicorn server implementing the Model Context Protocol
   - Runs in background mode to allow concurrent operation with Strapi
   - Exposes standardized endpoints for tool discovery and invocation

3. **Content Access Layer**
   - Bridges between MCP tools and Strapi's content API
   - Translates MCP tool calls to Strapi API operations
   - Handles authentication and permission checks

4. **Configuration System**
   - Environment variables for port and host settings
   - Command-line flags for enabling/disabling the server
   - Configurable logging and error handling

## Key Integration Points

### Strapi Bootstrap Process

The MCP server is integrated into Strapi's bootstrap process through the plugin system:

1. **Plugin Registration**
   - Plugin is registered in Strapi's plugin registry
   - Configuration is loaded from environment variables and defaults

2. **Bootstrap Phase**
   - MCP server is initialized during Strapi's bootstrap phase
   - Server is started in background mode using child_process
   - Python dependencies are checked before starting the server

3. **Shutdown Handling**
   - Server is gracefully shut down during Strapi's destroy phase
   - Resources are properly cleaned up to prevent memory leaks

### Code Integration

The key files and their roles in the integration:

- `strapi-server.js`: Main plugin entry point with lifecycle methods
- `mcp_server/`: Python package implementing the MCP server
  - `__init__.py`: Package initialization
  - `__main__.py`: Entry point for running the server
  - `server.py`: FastAPI implementation of MCP endpoints

## MCP Features and Endpoints

The MCP wrapper implements the following endpoints according to the Model Context Protocol specification:

### Tool Discovery

- **GET /tools/list**
  - Returns a list of available tools and their parameters
  - Used by AI assistants to discover capabilities

### Tool Invocation

- **POST /tools/call**
  - Invokes a tool with the provided arguments
  - Returns the result of the tool execution

### Resource Discovery

- **GET /resources/list**
  - Returns a list of available resources
  - Used by AI assistants to discover content

### Health Check

- **GET /health**
  - Returns the health status of the MCP server
  - Checks connectivity to Strapi

## Implemented MCP Tools

The following tools are implemented in the MCP wrapper:

### Content Management Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `content.list` | List available content types | None |
| `content.find` | Query content entries with filters | `contentType` (required), `filters` (optional) |
| `content.findOne` | Retrieve a specific content entry | `contentType` (required), `id` (required) |
| `content.create` | Create new content entries | `contentType` (required), `data` (required) |
| `content.update` | Update existing content entries | `contentType` (required), `id` (required), `data` (required) |
| `content.delete` | Delete content entries | `contentType` (required), `id` (required) |

### Schema Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `schema.getContentTypes` | Retrieve content type definitions | None |

## Expected Interaction Patterns

The MCP wrapper enables the following interaction patterns between external services and Strapi:

### AI Assistant Integration

1. **Discovery Phase**
   - AI assistant queries the MCP server for available tools
   - Assistant learns about content types and operations

2. **Content Operations**
   - Assistant can create, read, update, and delete content
   - Operations are performed through standardized MCP tools

3. **Schema Understanding**
   - Assistant can retrieve schema information to understand content structure
   - This enables proper formatting of content creation/update requests

### Authentication Flow

1. **External Service → MCP Server**
   - External services authenticate with the MCP server
   - Authentication headers are passed with each request

2. **MCP Server → Strapi**
   - MCP server uses Strapi's authentication system
   - Permission checks enforce appropriate access controls

## Configuration Options

The MCP wrapper can be configured through the following options:

### Environment Variables

- `MCP_PORT`: Port for the MCP server (default: 8080)
- `MCP_ENABLED`: Enable/disable the MCP server (default: true)
- `STRAPI_HOST`: Host for the Strapi server (default: 127.0.0.1)
- `STRAPI_PORT`: Port for the Strapi server (default: 1337)

### Command-Line Flags

- `--no-mcp`: Disable the MCP server

## Installation and Usage

### Installation

1. Install the plugin:

```bash
cd your-strapi-project
npm install @strapi/plugin-mcp
```

2. Install Python dependencies:

```bash
pip install fastapi uvicorn pydantic requests
```

3. Restart Strapi

### Usage

The MCP server will start automatically when Strapi boots. You can access the MCP endpoints at:

```
http://localhost:8080/
```

To disable the MCP server, start Strapi with the `--no-mcp` flag:

```bash
npm run develop -- --no-mcp
```

## Development and Testing

### Running Tests

To run the integration tests:

```bash
cd plugins/mcp
node integration_test.js
```

### Example Client

An example client implementation is provided in `examples/mcp_client_example.py`. This demonstrates how external services can interact with Strapi via MCP.

## Security Considerations

When deploying the MCP wrapper in production:

1. **Use HTTPS**: Always use HTTPS for production deployments
2. **Restrict Access**: Limit API access to trusted services
3. **Validate Input**: Implement input validation on both client and server
4. **Monitor Usage**: Track API usage for unusual patterns
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Troubleshooting

### Common Issues

- **MCP server fails to start**: Check Python dependencies
- **Connection refused errors**: Verify Strapi is running and accessible
- **Authentication failures**: Check API tokens and permissions

### Logs

The MCP server logs to Strapi's logging system. Check the logs for error messages and debugging information.
