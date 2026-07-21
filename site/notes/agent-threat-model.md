## ELI5
Before you build a single defense, you map the battlefield — because defending randomly is how you armor the wrong wall while the door stands open. The node summary: **everything that can go wrong with an agent, mapped.** A threat model is the security engineer's foundational artifact: a systematic inventory of *who* might attack, *what* they want, *where* they can get in, and *what* they can do once inside. This chapter builds that map for AI agents specifically — and everything in the rest of the ring is a defense against something on this map.

## The Real Explanation
**Why agents are a uniquely large attack surface.** A traditional program does exactly what its code says; an agent does what a *probabilistic model* decides, based on *natural-language instructions* it reads from *many sources* (Vol 02 Ch 2's role hierarchy is learned, not enforced — Vol 02 Ch 12). That means the attack surface includes not just the code but *every piece of text the model reads* — user messages, retrieved documents, tool results, web pages, MCP server descriptions (Vol 05 Ch 13), memories (Vol 06). And agents have *capabilities* — tools that act on the world (Vol 04 Ch 7) — so a compromised agent doesn't just leak data, it *does things*: sends, deletes, pays, exfiltrates. Model-driven decisions + broad text inputs + real-world capabilities = an attack surface far larger and stranger than traditional software, and one where the classic defenses (input validation, type checking) don't fully apply because the "input" is natural language interpreted by a probabilistic system.

**The threat-model dimensions — the four questions (STRIDE-flavored, agent-adapted).**
- *Who* (threat actors): external attackers (planting payloads in content your agent reads — indirect injection, Ch 3), malicious users (attacking through their own messages — direct injection, Ch 2), compromised dependencies (poisoned packages/models/servers — Ch 5), and — honestly — *your own bugs* (the agent harming through misconfiguration, not malice).
- *What they want* (objectives): data exfiltration (steal private data the agent can access), unauthorized actions (make the agent *do* something — send money, emails, delete), privilege escalation (use the agent's authority for the attacker's ends — the confused deputy, Vol 05 Ch 13), denial/cost (make the agent loop/spam to burn money or availability — Vol 04 Ch 16), and reputation/safety harm (make the agent produce harmful output).
- *Where they get in* (entry points / attack vectors): the user message, retrieved RAG content (Vol 03 — a poisoned document in your index), tool results (a compromised tool returning malicious data), web/fetched content (Vol 04 Ch 14), MCP servers (Vol 05 Ch 13), uploaded files, memories (Vol 06 — a poisoned memory), and multimodal inputs (text-in-images, Vol 02 Ch 13). *Every input channel is an entry point* — this is the map's most important row.
- *What they can do once in* (impact / blast radius): bounded by the agent's *capabilities* (Ch 8's least-privilege — an agent that can't send email can't be made to; capabilities *are* the blast radius) and its *data access* (what it can read is what it can leak). Impact is the intersection of "what the attacker achieved" and "what the agent was allowed to do."

**The synthesis — the threat model as design driver.** A completed threat model isn't a document that sits on a shelf; it *drives the defenses*: each entry point gets an input defense (Ch 6 spotlighting, Ch 11 guardrails); each capability gets access control (Ch 8 least-privilege) and gating (Ch 9); each high-impact action gets idempotency and audit (Ch 10); and the highest-risk *combinations* (Ch 7's lethal trifecta) get architectural elimination. The map tells you *where* to spend defense effort — and the rule is **defend proportional to blast radius**: a read-only research agent needs less armor than one with your email and bank access, and the threat model makes that calibration explicit rather than guessed.

## Why It Matters
Where this appears in real systems and jobs: everything that can go wrong with an agent, mapped.

## Hands-On
Build the threat model for *your own* systems (M-node, real artifact): (1) Take your most capable agent (the research agent with memory, or the node-proposer) and map all four dimensions: enumerate every *entry point* (every channel text reaches the model — be exhaustive; the ones you forget are the ones that get you), every *capability* (every tool, tagged read/write/dangerous — Vol 04 Ch 3), the *data* it can access, and thus its *blast radius*. (2) For each entry point, name the worst realistic attack (a poisoned web page → confused deputy? a malicious memory → persistent compromise?). (3) Rank by risk (likelihood × impact) — this ranking is your defense-priority list for the whole ring. The four-dimension map + the per-entry-point attack + the risk ranking = the note; every subsequent chapter defends something on this map.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is an agent's attack surface uniquely large — the three factors that make it so?
2. Recite the four threat-model dimensions (who/what/where/impact) with an example of each.
3. Why is "every input channel is an entry point" the map's most important row?
4. How is blast radius the intersection of capabilities and data access?
5. How does a threat model *drive* defenses, and what does "defend proportional to blast radius" mean?


---

## Wikilinks
[[injection-first-look]]
[[mcp-security]]
[[agent-failure-modes]]
[[lethal-trifecta]]
[[least-privilege-tools]]

## Status log
- Started: 2026-07-21
- Finished: null