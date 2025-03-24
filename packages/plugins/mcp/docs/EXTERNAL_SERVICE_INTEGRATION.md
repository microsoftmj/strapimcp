# External Service Integration with Strapi MCP

This document outlines the expected interaction patterns between external services and Strapi through the Model Context Protocol (MCP) wrapper.

## Overview

The Strapi MCP plugin enables external services, particularly AI assistants and other automated tools, to interact with Strapi content and functionality through a standardized protocol. This integration follows the Model Context Protocol specification, allowing for secure, structured communication between services.

## Authentication Flow

1. **External Service → MCP Server**:
   - External services authenticate with the MCP server using API keys or tokens
   - Authentication headers are passed with each request
   - MCP server validates credentials before processing requests

2. **MCP Server → Strapi**:
   - MCP server uses Strapi's authentication system to access resources
   - Admin API tokens or user JWT tokens can be configured for access
   - Permission checks enforce appropriate access controls

## Content Operations

### Content Discovery

External services can discover available content types and their structure:

```python
# Example: List content types
response = requests.get("http://your-strapi-host:8080/tools/call?name=content.list")
content_types = response.json()
```

### Content Retrieval

External services can query and retrieve content with filters:

```python
# Example: Find content with filters
arguments = {
    "contentType": "article",
    "filters": {
        "published": true
    }
}
response = requests.post(
    "http://your-strapi-host:8080/tools/call?name=content.find",
    json=arguments
)
articles = response.json()
```

### Content Creation and Modification

External services can create, update, and delete content:

```python
# Example: Create content
arguments = {
    "contentType": "article",
    "data": {
        "title": "New Article",
        "content": "Article content...",
        "published": true
    }
}
response = requests.post(
    "http://your-strapi-host:8080/tools/call?name=content.create",
    json=arguments
)
new_article = response.json()
```

## Schema Introspection

External services can retrieve schema information to understand content structure:

```python
# Example: Get content type schema
response = requests.post(
    "http://your-strapi-host:8080/tools/call?name=schema.getContentTypes"
)
schema = response.json()
```

## Error Handling

The MCP server provides standardized error responses:

- **400 Bad Request**: Invalid parameters or request format
- **401 Unauthorized**: Authentication failure
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

Example error response:

```json
{
  "detail": "Failed to fetch content types: Permission denied"
}
```

## Integration with AI Assistants

AI assistants that support the Model Context Protocol can use the Strapi MCP server to:

1. **Discover Capabilities**: Query available tools and their parameters
2. **Access Content**: Retrieve, create, and modify content based on user requests
3. **Understand Structure**: Use schema information to format content correctly

Example integration flow:

1. AI assistant receives a user request to "create a new blog post"
2. Assistant queries MCP server for available tools
3. Assistant calls the `content.create` tool with appropriate parameters
4. MCP server creates the content in Strapi
5. Assistant receives confirmation and can provide feedback to the user

## Security Considerations

When integrating external services with Strapi via MCP:

1. **Use HTTPS**: Always use HTTPS for production deployments
2. **Restrict Access**: Limit API access to trusted services
3. **Validate Input**: Implement input validation on both client and server
4. **Monitor Usage**: Track API usage for unusual patterns
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Example Client Implementation

See the [MCP Client Example](../examples/mcp_client_example.py) for a complete implementation of an external service client that interacts with Strapi via MCP.
