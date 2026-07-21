## ELI5
You've *used* MCP servers on faith; today you *build* one. The node summary is the full spec: **build a custom MCP server exposing system utility tools, handling stdio communication, and executing subprocess actions; verify with a command-line client.** After this build, MCP stops being a protocol you consume and becomes one you produce — and the pattern generalizes directly to Ch 16's brain server, the real prize.

## The Real Explanation
**The stack.** The official MCP SDK (`mcp` Python package with FastMCP, the ergonomic server framework — check the current SDK on build day; the concepts are stable even as APIs evolve). A server is astonishingly little code: declare tools, run the server, and the SDK handles the JSON-RPC-over-stdio plumbing (Ch 8's transport) you'd otherwise write by hand — which is the point of a standard.

```python
from mcp.server.fastmcp import FastMCP
import subprocess, shutil

mcp = FastMCP("system-utils")

@mcp.tool()
def disk_usage(path: str = "/") -> str:
    """Report disk usage for a path. Read-only. Returns human-readable df output."""
    result = subprocess.run(["df", "-h", path], capture_output=True, text=True, timeout=5)
    return result.stdout

@mcp.tool()
def find_files(directory: str, pattern: str) -> str:
    """Find files matching a glob pattern under a directory. Read-only.
    directory: absolute path to search. pattern: glob like '*.py'. Returns newline list."""
    # ... validated subprocess call to find, bounded ...

if __name__ == "__main__":
    mcp.run()   # speaks JSON-RPC over stdio; the host spawns this as a subprocess
```

Notice what transfers *verbatim* from Vol 04 Ch 3 (designing tools): the docstring **is** the tool description the model reads to choose the tool — negative space ("Read-only"), parameter descriptions, return-shape all matter exactly as before; MCP didn't change tool-design craft, it standardized tool-*transport*. Your Ch 3 skills are your MCP-server skills.

**The subprocess reality — where system utilities get dangerous, and the security preview.** These tools shell out (`df`, `find`, `ls`, `ping`), which means every lesson from Vol 02 Ch 12 (injection) and Vol 04 Ch 15 (the gate) converges on one rule: **never build a shell command from unsanitized input.** The cardinal sins and their fixes: *shell injection* — `subprocess.run(f"df {path}", shell=True)` with `path="/; rm -rf /"` is catastrophe; the fix is *always* the list form (`["df", "-h", path]`, `shell=False`) so arguments can't break out into commands (argument, not code — the boundary law in its most literal form). *Path traversal* — `path="../../../../etc/shadow"`; validate/confine paths to allowed roots. *Resource exhaustion* — a `find` over `/` hangs forever; every subprocess gets a `timeout`. *Unbounded output* — a tool returning 2GB floods the context (Vol 04 Ch 3's return-shape rule) and the transport; cap output. This build is your first taste of Ch 13's thesis: **an MCP server is an attack surface**, and the server author owns the safety. Tag each tool's safety class (Vol 04 Ch 3) — these are all reads; a `delete_file` tool would be a write demanding the gate, and you'll feel exactly why you wouldn't expose it casually.

**Verification — a command-line client, per the node.** The MCP ecosystem ships an inspector/dev client (the MCP Inspector, or a minimal client script — Ch 11 builds a real one) that connects to your server over stdio, lists its tools (watch your docstrings appear as the protocol's tool descriptions — the wire made visible), and invokes them. Verify: the server starts and advertises its tools; each tool executes and returns correctly; and the security tests — feed `disk_usage` a malicious path and confirm the list-form subprocess treats it as a (nonexistent) path argument, not a command; confirm timeouts fire on a slow call; confirm output caps. Pytest the tool *functions* directly (they're just Python — Vol 01 Ch 21), and integration-test via the client.

## Why It Matters
Where this appears in real systems and jobs: Build a custom Model Context Protocol server exposing system utility tools, handling stdio communication, and executing subprocess actions; verify with a command-line client.

## Hands-On
Build it (est. 1 day): scaffold FastMCP → 4–5 read-only system tools (`disk_usage`, `find_files`, `list_processes`, `ping_host`, `system_info`) each with Ch 3-grade docstrings and list-form subprocess + timeout + output cap → run it → connect the MCP Inspector/dev client → list and invoke every tool → the security suite (injection-as-argument, timeout, output cap) → pytest the functions. Then the ecosystem moment: connect your server to **Claude Desktop** (or any MCP-capable client you have) via its config, and call your tool *from a real AI client* — watch your Python function become a capability an AI reaches for. That moment (your code, any client) is the build's trophy; screenshot it. Tag `mcp-server-v0.1`.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does the SDK handle for you, and what remains your job? Which Vol 04 skill transfers verbatim?
2. Why is the list-form subprocess non-negotiable? Construct the injection it prevents.
3. Name four subprocess hazards and their fixes.
4. How does a client discover a server's tools, and where do your docstrings end up?
5. Why would you *not* casually expose a `delete_file` tool — and what would it require?


---

## Wikilinks
[[designing-tools]]
[[mcp-fundamentals]]
[[mcp-security]]
[[mcp-clients]]
[[build-brain-mcp-server]]

## Status log
- Started: 2026-07-21
- Finished: null