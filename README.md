# Strapi MCP Plugin

This repository contains the Model Context Protocol (MCP) plugin for Strapi.

## Installation

1. Create a new Strapi project or use an existing one:
   ```bash
   npx create-strapi-app@latest my-strapi-project
   cd my-strapi-project
   ```

2. Clone this repository into your Strapi project's plugins directory:
   ```bash
   mkdir -p plugins
   git clone https://github.com/microsoftmj/strapimcp.git plugins/mcp
   ```

3. Configure the environment:
   ```bash
   cp plugins/mcp/.env.example .env
   ```

4. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic requests
   ```

5. Start Strapi:
   ```bash
   npm run develop
   ```

The MCP server should start automatically with Strapi.

For detailed instructions, see the [Installation Guide](./INSTALLATION.md) and [Testing Guide](./TESTING.md).

## Claude Desktop Integration

To configure Claude Desktop to use this MCP server, see the [Claude Desktop Integration Guide](./CLAUDE_DESKTOP_INTEGRATION.md).
