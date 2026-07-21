## ELI5
The volume's summit, and one of the most consequential builds in your entire journey: **expose my brain graph as MCP tools — any AI client can query my learning.** The node summary's last clause is the thesis of this whole ring made real — your brain stops being a closed system and becomes *connectable infrastructure*. After this build, Claude Desktop, your agents, any MCP client on Earth can query, search, and reason over your accumulated learning. Your months of study become a queryable capability that any AI can wield. Meta, glorious, and genuinely useful the day you finish it.

## The Real Explanation
**The design decision that shapes everything — the three-primitive architecture (Ch 12, cashing in fully).** Before code, the control-mapping (your Ch 12 table, now the real design doc): *which* brain capabilities are **tools** (model-controlled actions), *which* are **resources** (app-loaded data), *which* are **prompts** (user-invoked interactions)?
- **Tools** (model decides to call): `search_brain(query, domain?)` — semantic+keyword search over your notes (your entire Vol 03 RAG stack, mounted behind MCP — the rings connect at the deepest point: your retrieval engine becomes a protocol-standardized capability); `get_node(node_id)` — fetch a node's full detail; `find_related(node_id)` — traverse wikilinks (your graph's edges, exposed); `what_did_i_learn(topic, since?)` — grounded, node-cited answers (a preview of Domain 06's recall agent).
- **Resources** (app loads as context): each note as `brain://notes/{node_id}`; domain lists as `brain://domains`; the curriculum map itself as a resource. The host can load a specific note into context *without* the model spending a tool call — Ch 12's app-controlled data, exactly right for "give me the attention-transformers note."
- **Prompts** (user invokes): `quiz-me(domain)` — your Feynman-review method packaged as a reusable prompt (Ch 12: shipping your *expertise* over the protocol — any client's user can invoke your learning methodology); `explain-like-feynman(concept)` — your textbook's own template, exposed.

This mapping *is* the architecture, and getting it right (not cramming everything into tools) is what makes the server genuinely good rather than merely functional.

**Built on everything.** Search tools wrap your Vol 03 pipeline (retrieval, hybrid, citations — the brain server *is* your brain-chat's engine, re-exposed over MCP); the server pattern is Ch 9; security is Ch 13 (this server reads your notes — a malicious client shouldn't be able to exfiltrate beyond what you intend to expose, and *write* capabilities, if any, route through the gate — but note the sane default: **the brain server is read-mostly**; node *proposals* stay in your Vol 04 Node-Proposer with its gate, not exposed as a careless MCP write); citations ride through every answer (Vol 03 Ch 10 — a brain server that answers without node-citations is untrustworthy; provenance is non-negotiable even over a protocol).

**The consequential payoff — what this unlocks.** Once your brain is an MCP server: (1) *Claude Desktop (or any MCP client) can query your learning* — you ask Claude a question, and it searches *your notes* for the answer, grounded in what *you* actually understand and wrote — a personal knowledge oracle. (2) *Your own agents gain their author's knowledge as a tool* (Ch 11 — register the brain server into your research agent; now it researches starting from what you've learned). (3) *The Bridge deepens* (Vol 04 Ch 18's M2) — the Node-Proposer can query the brain server to check what exists before proposing, closing a loop. (4) *It's portable infrastructure* — write once, use from every current and future MCP client, forever. This is the "closed system becomes connectable infrastructure" thesis, delivered.

**Verification.** All three primitive types work via your Ch 11 client (tools invoke, resources read, prompts surface); search returns cited results (referential integrity — Vol 03 Ch 10); security (a client can't read beyond exposed scope; no injection via note content — Ch 13; the read-mostly boundary holds); the ecosystem test — connect it to Claude Desktop and query your brain from a real, external AI client. Tests on the tool functions (they're your Vol 03 functions — already tested — plus the MCP wrapping).

## Why It Matters
Where this appears in real systems and jobs: expose my brain graph as MCP tools — any AI client can query my learning.

## Hands-On
Build it (est. 2–3 honest days): the Ch 12 control-mapping design doc → FastMCP server → search/get/related tools wrapping your Vol 03 pipeline → note/domain resources → quiz/explain prompts → security review (read-scope, citation integrity, Ch 13 audit) → verify all three primitives via your Ch 11 client. Then *the* ecosystem ceremony: connect the brain server to Claude Desktop, and ask Claude a question that it answers *by searching your own notes, citing your own nodes*. Screen-capture that — an external AI reasoning over your months of learning, grounded and cited. That capture is the build's trophy and a genuinely striking portfolio/capstone artifact (few people have "my personal knowledge exposed as MCP infrastructure" to show). Tag `brain-mcp-v1.0`. In the note: the control-mapping doc, the ecosystem capture, and one paragraph on what becomes possible now that your brain is connectable.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk the three-primitive control-mapping for the brain server, and why cramming all into tools would be worse.
2. How does your Vol 03 stack appear in this build, and why is that "the rings connecting at the deepest point"?
3. Why is the server read-mostly, and where do node *writes* correctly live instead?
4. Name the four things exposing your brain as MCP unlocks.
5. Why are citations non-negotiable even over a protocol, and which Vol 03 discipline enforces them?


---

## Wikilinks
[[mcp-fundamentals]]
[[build-mcp-server]]
[[mcp-resources-prompts]]
[[build-chat-with-my-brain]]
[[build-node-proposer]]
[[mcp-security]]

## Status log
- Started: 2026-07-21
- Finished: null