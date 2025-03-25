# Strapi MCP Plugin

This plugin enables external service access to Strapi via the Model Context Protocol (MCP).

## Overview

The Model Context Protocol (MCP) is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. This plugin implements an MCP server that wraps Strapi's API, allowing AI assistants and other external services to interact with Strapi content and functionality.

## Features

- **MCP Server**: Implements a FastAPI/Uvicorn server that follows the Model Context Protocol specification
- **Content Management Tools**: Access, create, update, and delete Strapi content through MCP tools
- **Schema Introspection**: Retrieve content type definitions and field information
- **Automatic Startup**: Server initializes during Strapi's bootstrap process
- **Configuration Options**: Control server behavior through environment variables and command-line flags

## Installation

For detailed installation instructions, see the [Comprehensive Installation Guide](./docs/INSTALLATION_GUIDE.md).

### Quick Start

1. Clone this repository into your Strapi project's plugins directory:

```bash
cd your-strapi-project
mkdir -p plugins
git clone https://github.com/microsoftmj/strapimcp.git plugins/mcp
```

2. Install Python dependencies:

```bash
pip install fastapi uvicorn pydantic requests
```

3. Restart Strapi

### Option 2: Install as npm package (Coming Soon)

Once published to npm, you'll be able to install with:

```bash
cd your-strapi-project
npm install @strapi/plugin-mcp
```

## Configuration

The plugin can be configured through environment variables:

- `MCP_PORT`: Port for the MCP server (default: 8080)
- `MCP_ENABLED`: Enable/disable the MCP server (default: true)

You can also disable the MCP server by starting Strapi with the `--no-mcp` flag:

```bash
npm run develop -- --no-mcp
```

## Available MCP Tools

The plugin exposes the following MCP tools:

### Content Management

- `content.list`: List available content types
- `content.find`: Query content entries with filters
- `content.findOne`: Retrieve a specific content entry
- `content.create`: Create new content entries
- `content.update`: Update existing content entries
- `content.delete`: Delete content entries

### Schema Information

- `schema.getContentTypes`: Retrieve content type definitions

## Usage with AI Assistants

AI assistants that support the Model Context Protocol can connect to your Strapi instance through this plugin. The assistant will be able to:

1. Discover available tools through the `/tools/list` endpoint
2. Call tools to interact with your Strapi content
3. Receive structured responses that follow the MCP specification

## Development

To contribute to this plugin:

1. Clone the repository
2. Install dependencies
3. Run the development server

## License

See the [LICENSE](LICENSE) file for details.
