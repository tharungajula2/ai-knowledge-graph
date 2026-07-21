## ELI5
You built a server (Ch 9) and a bridge (Ch 10); this chapter builds the third role — the **client** — and closes the loop. The node summary is small and complete: **connect my server to a client and call it.** A client is the connector inside a host (Ch 8) that speaks the protocol to a server. Building one demystifies the last MCP role and — the real payoff — lets your *own agent* become an MCP host, gaining any MCP server's tools.

## The Real Explanation
**What a client does — the lifecycle.** (1) *Launch/connect* — for stdio, spawn the server subprocess and establish the JSON-RPC channel over its stdin/stdout (for HTTP, open the connection); (2) *Initialize* — the MCP handshake: client and server exchange capabilities (protocol version, what the server offers); (3) *Discover* — `list_tools()` (and `list_resources()`, `list_prompts()` — Ch 12), returning the server's advertised capabilities with their schemas — *this is how an agent learns what a server can do at runtime*, dynamically, without hardcoding (the M+N dividend in action: your agent doesn't know the tools at build time, it discovers them at connect time); (4) *Invoke* — `call_tool(name, args)` sends the request, awaits the result; (5) *Close* — clean shutdown, terminate the subprocess.

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def use_server():
    params = StdioServerParameters(command="python", args=["system_utils_server.py"])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()          # DISCOVERY — runtime, dynamic
            result = await session.call_tool("disk_usage", {"path": "/"})
            return result
```

Note it's `async` (Ch 10's whole reason for existing — a client in a sync agent needs the bridge). Note the discovery step: the tools aren't known until `list_tools()` — which is the profound part.

**The agent-as-host payoff — where this connects to everything.** The reason to build a client isn't to call one server manually; it's to make **your agent an MCP host** that can wield *any* MCP server's tools. The pattern: at agent startup, connect clients to configured servers, `list_tools()` from each, and **register the discovered tools into your agent's toolbox** (Vol 04 Ch 3's tool abstraction — MCP tools become just more tools in your dispatch, their JSON schemas becoming your tool definitions). Suddenly your Vol 04 research agent can use the filesystem server, the GitHub server, your Ch 9 utils server, your Ch 16 brain server — *without bespoke integration for any of them*, discovered and registered dynamically. That's the M+N dividend, delivered to your own agent: write the MCP-client-registration layer once, gain every MCP server forever. And it runs through the Ch 10 bridge, because your agent is sync-threaded and the client is async — the three MCP builds (server, bridge, client) compose into exactly your agent-lab's architecture, now fully authored by you.

**The design decisions.** *Connection management* — persistent (keep servers connected across the agent's life — the bridge's persistent session, Ch 10) vs on-demand (connect per task — simpler, slower); persistent is standard for tools an agent uses repeatedly. *Tool namespacing* — two servers might both expose `search`; prefix discovered tools with their server name (`utils.disk_usage`, `brain.query`) to avoid the collision (Vol 04 Ch 3's "never two confusable names," at server scale). *Failure handling* — a server subprocess dies mid-session; the client must detect and reconnect or degrade (Vol 04 Ch 16's guards, at the protocol layer). *Security* — you're launching subprocesses and trusting their tool descriptions; Ch 13's confused-deputy and tool-poisoning attacks live exactly here.

## Why It Matters
Where this appears in real systems and jobs: connect my server to a client and call it.

## Hands-On
Build it (est. half a day, thanks to Chs 9–10): a client that connects to your Ch 9 server, initializes, discovers, and invokes — first standalone (async script), then the real integration: through your Ch 10 bridge, register the discovered MCP tools into your Vol 04 agent's toolbox with server-prefixed names, and run a task where your agent *chooses and calls an MCP tool it discovered at runtime* (ask it something needing `disk_usage`; watch it discover, select, and invoke your server's tool through the full server→bridge→client→agent stack). That end-to-end call — your agent using your server via your bridge and client, all three roles authored by you — is the note's centerpiece; trace it hop by hop. Then connect your client to *someone else's* MCP server (a public filesystem or fetch server) and watch your agent gain a capability you didn't write — the M+N dividend, felt. Tag `mcp-client-v0.1`.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the client lifecycle's five stages.
2. What is discovery, why is it "runtime and dynamic," and why is that the profound part?
3. Explain the agent-as-host payoff — how do discovered tools become agent tools, and what dividend does that deliver?
4. Why must the client be async, and how does it reach a sync agent?
5. Name two client design decisions (namespacing, connection management) and the failure each prevents.


---

## Wikilinks
[[mcp-fundamentals]]
[[build-mcp-server]]
[[build-mcp-bridge]]
[[designing-tools]]
[[mcp-security]]

## Status log
- Started: 2026-07-21
- Finished: null