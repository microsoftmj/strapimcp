import sys
import os
from mcp_server.server import main

if __name__ == "__main__":
    port = int(os.environ.get("MCP_PORT", 8080))
    sys.exit(main(port=port))
