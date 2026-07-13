import os
import sys
from langchain_mcp_adapters.tools import load_mcp_tools

async def get_mcp_tools():
    """
    Spawns the local vizier_utils_server.py MCP server over stdio,
    retrieves its tool list, and converts them to LangChain tools.
    """
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Path to virtual environment python interpreter
    venv_python = os.path.join(backend_dir, ".venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = sys.executable  # Fallback
        
    server_path = os.path.join(backend_dir, "mcp_servers", "vizier_utils_server.py")
    
    connection_config = {
        "transport": "stdio",
        "command": venv_python,
        "args": [server_path]
    }
    
    try:
        print(f"[MCP Client] Initializing stdio connection to {server_path}...")
        tools = await load_mcp_tools(session=None, connection=connection_config)
        print(f"[MCP Client] Successfully loaded {len(tools)} tools: {[t.name for t in tools]}")
        return tools
    except Exception as e:
        print(f"[MCP Client Error] Failed to load MCP tools: {e}")
        return []
