## ELI5
The node summary sets the task: a **review and architecture map of multi-agent communication and routing protocols** — the whole ring rendered as one navigable picture, from "should this even be a team?" through how teams talk (handoffs, shared state, parallelism, debate) to how everything connects (MCP's three roles, the security surface, the protocol landscape). When you can draw this cold, you own the connective architecture of modern AI systems.

## The Real Explanation
It starts with a *refusal*: the null hypothesis that one good agent usually wins, and the burden of proof on *many* — justified only by distinct specialties, context isolation, or parallelism, and *never* without pricing the coordination tax [1, 7]. When a team is warranted, one shape dominates: the **orchestrator–worker** — a coordinator that decomposes, dispatches, integrates, handles failure, and *owns the goal* [2], thin-orchestrator-fat-workers by default. Teams move work through **handoffs** — a distilled baton carrying task, curated context, and criterion, routed deterministically where the path is knowable and by LLM where it isn't, guarded against starvation, flooding, loops, and telephone-game decay [3]. They share knowledge along a spectrum from private scratchpads through message-passing to blackboards, paying coordination discipline in proportion to shared mutable state [4], and they **parallelize** only what's genuinely independent — fan-out/fan-in over `gather`, reducers merging concurrent writes, latency dropping while cost holds flat [5]. Sometimes they **debate** — reflection socialized, converging on truth *when errors are independent* and manufacturing false confidence *when they're correlated*, always outranked by ground truth and rarely worth its 5–15× bill [6]. And underneath the talking, the connective standard: **MCP**, the USB-C that collapsed M×N tool integration to M+N [8] — host, client, server [8]; a server you built exposing tools over stdio subprocesses [9]; the **async-sync bridge** that once froze your lab, rebuilt as a background event loop you authored [10]; a client that discovers tools at runtime and makes your agent a host of any server's capabilities [11]; the full three-primitive spec — tools for the model, resources for the app, prompts for the user [12]; a new attack surface of poisoned tools and confused deputies, defended by capability-minimalism and the gate [13]; and a contested agent-to-agent frontier read through permanent axes rather than hype [14]. It ships as real teams — a writer-critic whose gain you *measured* [15], your **brain exposed as MCP infrastructure** any AI can query [16], and the honest one-vs-many experiment that turned "use multi-agent" from a stance into a measured, task-dependent decision [17].

## Why It Matters
Where this appears in real systems and jobs: review and architecture map of multi-agent communication and routing protocols.

## Hands-On
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every node present and load-bearing. **(b)** The map — the node's literal demand: a two-region architecture diagram — *Teams* (orchestrator at center; workers around; handoff batons labeled; shared-state pattern marked; parallel fan-out/fan-in; debate panel) and *Protocols* (MCP's host-client-server triangle; your three servers/bridge/client; the three primitives; the security surface as red boundaries; the protocol landscape as the horizon). Draw the routing doctrine as a decision layer over both regions. Photograph into the note. **(c)** The 90-second spoken version — its interview home: *"when would you use multiple agents, and how do they coordinate and connect?"* — the second clause (coordination + MCP) is where your ring makes you rare. Record, critique, re-record.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 90-second version cold — both clauses.
2. Trace one task from "should this be a team?" through orchestration, a handoff, a parallel fan-out, to an MCP tool call — naming every mechanism and its chapter.
3. Place the three shared-state patterns and the debate failure mode on your map from memory.
4. Draw MCP's three roles and three primitives from memory.
5. Draw the full map from memory.


---

## Wikilinks
[[synthesis-multi-agent]]

## Status log
- Started: 2026-07-21
- Finished: null