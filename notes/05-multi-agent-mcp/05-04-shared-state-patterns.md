---
id: shared-state-patterns
title: "Shared State"
domain: multi-agent-mcp
ring: 5
cluster: "Teams"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["langgraph-state", "handoffs-routing", "parallel-agents", "scratchpads-working-memory", "nlp-transformer-lineage"]
tags: [multi-agent-mcp]
---

## ELI5
Handoffs (Ch 3) pass context *point to point* — A hands to B. But some coordination needs a *shared surface* — a whiteboard the whole team reads and writes, a common memory. The node summary names the three architectures: **scratchpads, blackboards, message passing.** Get this wrong and you recreate the oldest disease in concurrent programming — shared mutable state and its race conditions — inside your agent team. Get it right and you have coordination that scales.

## The Real Explanation
**The three patterns, on a spectrum from isolated to shared.**
1. **Private scratchpads + explicit handoffs** (the isolated end — Vol 04 Ch 13 + Ch 3): each agent has its own working memory; coordination happens *only* through deliberate handoffs. Maximum isolation (no interference, clean testing, the Ch 1 isolation virtue), maximum control — but all shared knowledge must be explicitly passed, which is verbose and can drop context. Default for most systems, precisely because explicit is debuggable.
2. **Blackboard** (the shared end): a common data structure all agents read and write — the "whiteboard in the war room." Agents post findings; others build on them; the emergent collaboration can be powerful (a researcher posts a fact, an analyst sees it and computes, a writer sees both and drafts — no explicit handoff needed). *The classic AI architecture* (blackboard systems predate LLMs by decades — Vol 01 Ch 13's lineage lesson: old ideas resurface). But it reintroduces every hazard of shared mutable state: two agents writing the same slot (Vol 04 Ch 5's reducer question, now at team scale — who wins? the reducer decides), stale reads, and the debugging nightmare of "which agent wrote this and when?" Use it when genuine emergent collaboration is the goal and you'll invest in the coordination discipline it demands.
3. **Message passing** (the middle — structured communication, no shared mutable surface): agents send *messages* to each other or to topics/queues; each agent owns its own state and reacts to messages (the actor model — another pre-LLM idea, Erlang/Akka lineage). No shared-state races (each agent's state is private; only messages cross boundaries), naturally distributed and scalable, but eventual-consistency headaches and no single place to see "the whole truth." The architecture large-scale agent systems trend toward precisely because it avoids shared-mutable-state races by construction.

**The invariant that governs all three — this is the chapter's spine.** It's the same lesson as Vol 04 Ch 10's subgraph boundaries and every good software architecture since Vol 01 Ch 16: **the more state agents share mutably, the more coordination discipline you must pay.** Isolation is cheap to reason about and expensive to coordinate; sharing is cheap to coordinate and expensive to reason about. There is no free lunch; there is only choosing *where* you pay. LangGraph's design nudges you toward the safe end — explicit typed state with declared reducers (Vol 04 Ch 5) is essentially "message passing with a schema": state changes are explicit node returns, reducers make concurrent writes deterministic, and there's no spooky action. You've been using the disciplined pattern all along; this chapter names the alternatives and why LangGraph chose as it did.

**Concurrency hazards, named (because parallel agents in Ch 5 will hit these).** *Race conditions* — two agents write the same state key concurrently; without a reducer, last-write-wins silently corrupts (Vol 04 Ch 5's reducer is the fix — declare how concurrent writes merge). *Stale reads* — an agent reads state, another updates it, the first acts on outdated info. *Deadlock-flavored waits* — agent A waits for B's output while B waits for A's (Ch 3's routing loop, in state form). The mitigations are the classics adapted: prefer immutable/append-only state (append reducers never conflict — why message history uses one), make concurrent-write semantics explicit (reducers), and minimize genuinely shared mutable slots (share the minimum — the least-sharing principle, sibling to least-autonomy and least-architecture).

## Why It Matters
Where this appears in real systems and jobs: scratchpads, blackboards, message passing.

## Hands-On
Paper + a small demonstration: (1) Map the three patterns onto systems you know — your LangGraph supervisor (which is it? — message-passing-with-schema, mostly), your agent-lab, a blackboard example you design. For each, one sentence on where it pays the coordination-vs-reasoning tax. (2) The race-condition demo (~20 lines): build a trivial two-node LangGraph where both nodes write the *same* state key, once *without* a reducer (watch last-write-wins clobber) and once *with* an append reducer (watch both survive) — witness Vol 04 Ch 5's abstraction earning its existence. (3) Design decision: for a team where a researcher, analyst, and writer must build on each other's outputs, choose blackboard vs message-passing vs handoffs, and defend it against the coordination-vs-reasoning tax. The tax map + the race demo + the defended design = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Place the three patterns on the isolated↔shared spectrum with each one's core trade.
2. Why is a blackboard powerful *and* dangerous? Name the pre-LLM lineage and the specific hazards.
3. State the governing invariant about shared state and coordination discipline.
4. Why is LangGraph's typed-state-with-reducers "message passing with a schema," and what race does the reducer prevent?
5. Name three concurrency hazards and their classic mitigations — and the least-sharing principle.


---

## Wikilinks
[[langgraph-state]]
[[handoffs-routing]]
[[parallel-agents]]
[[scratchpads-working-memory]]
[[nlp-transformer-lineage]]

## Status log
- Started: 2026-07-21
- Finished: null
