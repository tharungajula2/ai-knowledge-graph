---
id: handoffs-routing
title: "Handoffs & Routing"
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
wikilinks: ["orchestrator-worker", "shared-state-patterns", "scratchpads-working-memory", "build-supervisor", "plan-and-execute"]
tags: [multi-agent-mcp]
---

## ELI5
A relay race is won or lost at the baton exchange — perfect runners lose if the handoff fumbles. In multi-agent systems, the baton is *context*, and the node summary is the whole discipline: **tasks moving between agents cleanly.** Most multi-agent failures aren't dumb agents; they're dropped batons — the receiving agent doesn't get what it needs, or gets a firehose it can't parse. This chapter is the craft of the clean exchange.

## The Real Explanation
**Two topologies of movement.** *Hierarchical handoff* (orchestrator ↔ worker, Ch 2): the orchestrator hands a subtask down and gets a result up — a controlled, round-trip loan of work. *Peer handoff* (agent → agent directly, no return): agent A decides agent B should take over and *transfers control* — a one-way pass, like a support tier escalating to a specialist and stepping out. Peer handoffs (popularized by frameworks like OpenAI's Swarm/Agents SDK) make systems flexible and decentralized — and harder to reason about, because control location becomes dynamic (who's driving *now*? the system must track it — Vol 04 Ch 6's thread state earns another job). The choice echoes Ch 2: centralized (hierarchical, accountable) vs distributed (peer, flexible).

**The baton — what must transfer, and the two failure modes.** A handoff must carry: the *task* (what to do), the *relevant context* (what's been established that the receiver needs), and the *success criterion* (how the receiver knows it's done). Get the *relevant* wrong in either direction and you get the twin failures: **context starvation** — the receiver gets the task but not the findings it depends on, so it redoes work or hallucinates the gap (a dropped baton); **context flooding** — the receiver gets the *entire* upstream scratchpad, drowning the actual task in irrelevant history (a baton the size of a log, causing lost-in-the-middle, Vol 04 Ch 13, at the seam between agents). The craft is the Goldilocks middle: **the handoff brief** — a distilled, structured package (the `task_brief` from Vol 04 Ch 11, formalized as a discipline): task + *curated* relevant context + criterion, and nothing else. Distillation at the boundary is Vol 04 Ch 13's scratchpad treatment applied to inter-agent seams — the same skill, new location.

**Routing — deciding where the baton goes.** Three mechanisms, ascending in flexibility and cost: (1) *Rules* — deterministic routing on structured signals (intent classification result, task type): cheap, predictable, debuggable; use it when the routing logic is genuinely knowable (much of it is). (2) *LLM routing* — the model decides the destination (Vol 04 Ch 11's schema-enforced route): flexible, handles ambiguity, costs a call; use it when routing needs judgment. (3) *Learned/embedding routing* — route by similarity to worker-capability descriptions (embed the task, nearest-neighbor against worker profiles — Vol 03's machinery, pointed at routing): scales to many workers without a giant prompt. Most systems use rules where they can and LLM routing where they must — the routing drumbeat from Vol 03 (Chs 9,13,14) and Vol 04 (Ch 11), now explicit doctrine: *route deterministically when the path is knowable, with judgment when it isn't, and never spend a frontier-model call on a decision a rule could make.*

**The failure modes and their guards (the operational half).** *Routing loops* — A hands to B hands back to A hands to B... (peer handoffs make this easy; it's Vol 04 Ch 16's infinite loop at the team level): guard with handoff-count budgets and a "you've already handled this" signal in the baton. *Orphaned tasks* — a handoff to a worker that can't actually do it, and nothing catches the drop: guard with a `none`/fallback destination (Vol 04 Ch 11's first-class `none`, at the routing layer) and handoff acknowledgment. *Context decay across chains* — each handoff distills, and over a long chain the original intent erodes (telephone game): guard by carrying the *original goal* immutably alongside the evolving context (Vol 04 Ch 8's pinned-goal discipline, threaded through every handoff). *Accountability loss* — in peer systems, when the final answer is wrong, *which* agent's handoff caused it? — guard with handoff logging (the audit-trail habit, Vol 04 Ch 15, applied to control transfers; also your trajectory-eval substrate for Domain 07).

## Why It Matters
Where this appears in real systems and jobs: tasks moving between agents cleanly.

## Hands-On
Instrument and stress your Vol 04 system's handoffs: (1) Add handoff logging — every supervisor→specialist dispatch records the baton (task, context size in tokens, criterion). Run three tasks; inspect the batons: are any *starved* (specialist missing needed context) or *flooded* (whole conversation shoved in)? Measure the context size at each handoff — you'll likely find flooding (most naive supervisors flood). (2) Fix one flooded handoff with a distilled brief; measure the token savings and check quality held. (3) Paper drill: design a *peer-handoff* version of a support system (tier-1 → tier-2 → billing), draw the control-flow, and mark every one of the four failure modes' danger points with its guard. Logged batons + the distillation fix + the peer-system danger map = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Hierarchical vs peer handoff: the topology of each, and what peer handoffs make harder.
2. What are the three things a baton must carry, and what are the twin failures of getting "relevant" wrong?
3. Recite the three routing mechanisms and the doctrine for choosing among them.
4. Name the four handoff failure modes and one guard each.
5. Why carry the original goal immutably through a handoff chain — what does the telephone game do without it?


---

## Wikilinks
[[orchestrator-worker]]
[[shared-state-patterns]]
[[scratchpads-working-memory]]
[[build-supervisor]]
[[plan-and-execute]]

## Status log
- Started: 2026-07-21
- Finished: null
