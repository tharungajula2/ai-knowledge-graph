-- Seed new dictionary terms for Phase 8 Lesson 1
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
(
  'Model Context Protocol (MCP)',
  'Architectures',
  'An open standard developed by Anthropic enabling AI assistants to securely connect to external tools, databases, and resources using a unified protocol.',
  'MCP is a JSON-RPC 2.0 based protocol that standardizes the client-server boundary for LLMs. It decouples the capabilities from the models themselves by establishing structured endpoints for listing and calling tools, reading static resources, and retrieving prompt templates.',
  'Think of MCP as USB-C for AI—establishing a single standard port so any model (like a laptop) can connect to any tool (like a monitor, external drive, or camera) without needing custom adapters.',
  '{"mcp-server", "mcp-client", "stdio-transport"}',
  'Phase 8'
),
(
  'MCP Server',
  'Architectures',
  'A standalone application or script that exposes tools, prompts, and resources complying with the Model Context Protocol specifications.',
  'An MCP server is a service running locally (via stdio) or remotely (via SSE/HTTP) that implements the server-side protocol endpoints. It is responsible for executing tools, publishing read-only resources, and supplying prompt templates to the client.',
  'Like a database server that speaks SQL, an MCP server is a tool runner that speaks the MCP protocol.',
  '{"mcp-client", "model-context-protocol"}',
  'Phase 8'
),
(
  'MCP Client',
  'Architectures',
  'An application (such as an IDE, browser, or LangGraph host) that initiates a session with an MCP server to discover and consume tools.',
  'An MCP client is the orchestrator (or host application) that maintains the connection session, translates user requests, forwards tool calls, and handles authorization and security allowlists.',
  'Like a web browser (the client) connecting to a web server to retrieve web pages.',
  '{"mcp-server", "model-context-protocol"}',
  'Phase 8'
),
(
  'Stdio Transport',
  'Architectures',
  'A low-latency local MCP transport where the client spawns the server as a subprocess and exchanges JSON-RPC payloads via standard input/output streams.',
  'In stdio transport, the client acts as the parent process, spawning the server as a child process and piping JSON-RPC messages into the server''s stdin while listening for responses on the server''s stdout.',
  'Like communicating with a colleague in the same room by passing written notes back and forth.',
  '{"streamable-http", "transport-layer"}',
  'Phase 8'
),
(
  'Tool Poisoning',
  'Security',
  'A security vulnerability where untrusted data fetched by a tool contains hidden prompt injections that hijack the LLM''s behavior.',
  'Tool poisoning (or indirect prompt injection) is a class of attack where data retrieved from external tools (e.g. web pages, email summaries, PDFs) contains instructions designed to bypass the system prompt constraints and force the agent to perform unauthorized actions.',
  'Like a trojan horse—retrieving harmless-looking text that secretly contains commands that take over the agent.',
  '{"confused-deputy", "prompt-injection"}',
  'Phase 8'
),
(
  'Confused Deputy',
  'Security',
  'A privilege escalation scenario where an agent with high privileges is tricked by a low-privilege command or untrusted data into abusing its power.',
  'The Confused Deputy problem in agentic security occurs when an agent with access to powerful tools is manipulated by untrusted system inputs to abuse its authorization—for example, executing a delete operation on behalf of an injected web document.',
  'Like a security guard (the deputy) being tricked by a forged note into unlocking the vault for a thief.',
  '{"tool-poisoning", "privilege-escalation"}',
  'Phase 8'
),
(
  'Allowlist',
  'Security',
  'A security mechanism that explicitly specifies approved commands, paths, or tool calls, denying all others by default.',
  'An allowlist is a zero-trust access control mechanism. In MCP architectures, clients enforce allowlists to restrict spawned server paths, network requests, or sensitive tool invocations.',
  'Like a VIP guest list at a private club—if your name is not on the list, you cannot enter, regardless of your credentials.',
  '{"tool-poisoning", "confused-deputy"}',
  'Phase 8'
)
ON CONFLICT (term) DO NOTHING;

-- Seed Phase 8 Lesson 1 Curriculum Module
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(8, 1, 'Model Context Protocol (MCP) & Agentic Security',
 '# Lesson 8.1: Model Context Protocol (MCP) & Agentic Security

The **Model Context Protocol (MCP)**, developed by Anthropic, is an open standard that enables AI models to connect securely and uniformly to external data sources and tools. MCP acts as the **"USB-C for AI tools"**—establishing a single, structured protocol for tool execution, data retrieval, and contextual prompts.

---

## 1. What is MCP?
MCP defines a standard communication protocol between **Clients** (the host application or developer IDE) and **Servers** (standalone services providing tools, resources, and prompts):

### Protocol Concepts
1. **Tools:** Executable functions that the model can request to run (e.g., `telegram_notify(message)`). Tools return dynamic content and can modify state.
2. **Resources:** Read-only data sources exposed by the server (e.g., file contents, database logs, live telemetry).
3. **Prompts:** Pre-defined prompt templates or system instructions that the client can query from the server.
4. **Transports:**
   - **`stdio`:** The client spawns the server as a subprocess and communicates via standard input (`stdin`) and standard output (`stdout`). Perfect for local integrations.
   - **`SSE (Server-Sent Events) / HTTP`:** The server runs as a separate web application. Client sends requests via HTTP POST, and server streams events back.

---

## 2. Agentic Security Concerns

Giving agents the ability to invoke tools and access external networks introduces severe security risks. Three primary vulnerabilities govern MCP security:

### A. Tool Poisoning (Indirect Prompt Injection)
**Tool Poisoning** occurs when an agent retrieves untrusted content from a tool (e.g., fetching a web page or reading an email) that contains malicious instructions hidden inside the data. When the LLM processes this text, it is tricked into executing those instructions.

### B. The Confused Deputy Problem
The **Confused Deputy** problem is a privilege escalation vulnerability where an agent with high privileges is tricked by a less-privileged user or untrusted data into using its authority to perform an unauthorized action.

### C. Tool Descriptions as an Attack Surface
Under the hood, LLMs select tools based on the tool''s **name** and **description**. If an attacker can manipulate or inject into a tool description (or if a third-party MCP server has weak descriptions), the LLM can be misdirected.

---

## 3. Defense Mechanisms: Allowlisting
To secure MCP architectures, hosts must enforce strict **allowlisting**:
- **Command Allowlists:** Only allow the client to spawn approved subprocess commands.
- **Tool Access Allowlist:** Limit which specialists can access which tools.
- **Workspace Restrictions:** Restrict file-reading tools to specific subdirectories to prevent directory traversal attacks.',
 'Integrations')
ON CONFLICT (phase, order_index) DO NOTHING;
