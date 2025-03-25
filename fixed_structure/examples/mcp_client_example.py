#!/usr/bin/env python3
"""
Example client for the Strapi MCP server
This demonstrates how external services can interact with Strapi via MCP
"""
import json
import requests
import sys
from typing import Dict, List, Any, Optional

class StrapiMCPClient:
    """Client for interacting with Strapi via MCP"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        """Initialize the client with the MCP server URL"""
        self.base_url = base_url
        self.tools = self._fetch_tools()
    
    def _fetch_tools(self) -> Dict[str, Any]:
        """Fetch available tools from the MCP server"""
        response = requests.get(f"{self.base_url}/tools/list")
        if response.status_code != 200:
            raise Exception(f"Failed to fetch tools: {response.status_code}")
        return response.json()
    
    def list_tools(self) -> List[Dict[str, Any]]:
        """List available tools"""
        return self.tools.get("tools", [])
    
    def call_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Call a tool with the given arguments"""
        response = requests.post(
            f"{self.base_url}/tools/call",
            params={"name": name},
            json=arguments
        )
        if response.status_code != 200:
            raise Exception(f"Failed to call tool {name}: {response.status_code}")
        return response.json()
    
    def list_content_types(self) -> Dict[str, Any]:
        """List available content types"""
        return self.call_tool("content.list", {})
    
    def find_content(self, content_type: str, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Find content entries with filters"""
        arguments = {"contentType": content_type}
        if filters:
            arguments["filters"] = filters
        return self.call_tool("content.find", arguments)
    
    def get_content(self, content_type: str, entry_id: str) -> Dict[str, Any]:
        """Get a specific content entry"""
        arguments = {"contentType": content_type, "id": entry_id}
        return self.call_tool("content.findOne", arguments)
    
    def create_content(self, content_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new content entry"""
        arguments = {"contentType": content_type, "data": data}
        return self.call_tool("content.create", arguments)
    
    def update_content(self, content_type: str, entry_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing content entry"""
        arguments = {"contentType": content_type, "id": entry_id, "data": data}
        return self.call_tool("content.update", arguments)
    
    def delete_content(self, content_type: str, entry_id: str) -> Dict[str, Any]:
        """Delete a content entry"""
        arguments = {"contentType": content_type, "id": entry_id}
        return self.call_tool("content.delete", arguments)
    
    def get_content_types_schema(self) -> Dict[str, Any]:
        """Get content type definitions"""
        return self.call_tool("schema.getContentTypes", {})


def main():
    """Example usage of the Strapi MCP client"""
    # Create client
    client = StrapiMCPClient()
    
    # List available tools
    print("Available tools:")
    tools = client.list_tools()
    for tool in tools:
        print(f"- {tool['name']}: {tool['description']}")
    
    # Example: List content types
    try:
        print("\nListing content types...")
        content_types = client.list_content_types()
        print(json.dumps(content_types, indent=2))
    except Exception as e:
        print(f"Error listing content types: {e}")
    
    # Example: Create a blog post
    try:
        print("\nCreating a blog post...")
        post_data = {
            "title": "Example Post via MCP",
            "content": "This post was created via the Model Context Protocol.",
            "published": True
        }
        result = client.create_content("api::blog.blog", post_data)
        print(json.dumps(result, indent=2))
        
        # Get the created post ID
        post_id = result.get("data", {}).get("id")
        if post_id:
            # Example: Update the blog post
            print(f"\nUpdating blog post {post_id}...")
            update_data = {
                "title": "Updated Post via MCP",
                "content": "This post was updated via the Model Context Protocol."
            }
            result = client.update_content("api::blog.blog", post_id, update_data)
            print(json.dumps(result, indent=2))
            
            # Example: Delete the blog post
            print(f"\nDeleting blog post {post_id}...")
            result = client.delete_content("api::blog.blog", post_id)
            print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error in blog post operations: {e}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
