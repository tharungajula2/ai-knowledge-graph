## ELI5
You built a supervisor in Vol 04 by following a spec; now you learn the *pattern* it instantiates — the single most important, most reused shape in multi-agent systems. The node summary: **the supervisor pattern, formalized.** A general contractor doesn't lay every brick; they read the job, decompose it, dispatch specialists, integrate results, and own the outcome. Orchestrator–worker is that, and once formalized, you'll recognize it under a dozen framework names and know exactly what varies and what's essential.

## The Real Explanation
**The pattern's anatomy — five responsibilities of the orchestrator.** (1) *Decompose* — break the goal into worker-sized subtasks (this is plan-and-execute's planner, Vol 04 Ch 8, wearing a coordination hat — and the same react-vs-plan choice applies: decompose up front, or route reactively one subtask at a time). (2) *Dispatch* — route each subtask to the right worker (Vol 04 Ch 11's schema-enforced routing — the essential mechanism). (3) *Integrate* — combine worker outputs into a coherent whole (the `finalize` node, generalized — and the hard part, because workers return partial, differently-shaped results). (4) *Handle failure* — a worker fails or returns garbage; the orchestrator retries, reroutes, or degrades gracefully (Vol 04 Ch 16's guards, at the team level). (5) *Own the goal* — workers see only their subtask; *only the orchestrator holds the full objective*, which is exactly why goal drift (Vol 04 Ch 8) is a team-level risk the orchestrator must actively manage.

**What varies (the design space) vs what's essential (the invariant).** *Essential*: one coordinator owns decomposition, dispatch, and integration; workers are focused and don't coordinate among themselves (that's a *different* pattern — Ch 3's peer handoffs). *Varies*: whether decomposition is upfront-plan or reactive-route; whether workers are full agents (loops) or single-shot specialists; whether the orchestrator does work itself or *only* coordinates (the "pure router" — often cleaner: the orchestrator's context stays clean of any single worker's mess, the isolation principle from Ch 1); whether workers can spawn sub-workers (hierarchies — orchestrators all the way down, which is just Vol 04 Ch 10's subgraphs nested). The frameworks (LangGraph supervisor, CrewAI's hierarchical process, OpenAI's agents-as-tools) are all this pattern with different knobs — and knowing the invariant means no framework can confuse you.

**The two orchestrator flavors — a distinction worth owning.** *Orchestrator-as-router* (dispatch only; workers do all the work; the orchestrator is a thin, cheap classification layer): scales well, stays debuggable, keeps the coordinator's context minimal. *Orchestrator-as-worker* (coordinates *and* contributes — synthesizes, fills gaps, does the "glue" reasoning workers can't): more capable, but its context accumulates everything and its cost climbs. The mature default: **thin orchestrator, fat workers** — push work down, keep coordination cheap and clean — unless integration genuinely requires the orchestrator to reason over combined results (research synthesis often does; pure routing tasks never do).

**Orchestrator-worker vs the alternatives (placing it on the map).** Vs a *pipeline* (fixed A→B→C, no routing decision — Vol 04 Ch 1's workflow end of the autonomy dial): use a pipeline when the path is known; orchestrator-worker when routing is a genuine decision. Vs *peer agents / handoffs* (Ch 3 — no central coordinator; agents pass control directly): orchestrator-worker centralizes control (easier to reason about, a single point of accountability and failure) where peers distribute it (more flexible, harder to debug). Vs *debate* (Ch 6 — agents as equals arguing): orchestration is hierarchy, debate is democracy. Most production systems are orchestrator-worker because *centralized accountability is an operational virtue* — when something breaks, there's one place that owns the outcome.

## Why It Matters
Where this appears in real systems and jobs: the supervisor pattern, formalized.

## Hands-On
Formalize your own system, then stress it: (1) Draw your Vol 04 supervisor as the five responsibilities — label where each lives in your code, and honestly mark which responsibility is *weakest* in your implementation (integration and failure-handling are the usual culprits — most supervisor tutorials skimp on both). (2) Classify your orchestrator: router or worker flavor? Should it be the other? Write the reasoning. (3) The design-space table: take one new task (say, "produce a competitive analysis of three products") and design its orchestrator-worker system three ways — thin router + fat workers, fat orchestrator + thin workers, and hierarchical (workers spawning sub-workers) — one paragraph each on what each optimizes and costs. The weakest-responsibility honesty + the flavor decision + the three-way design = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the five orchestrator responsibilities, and say why "owns the goal" makes drift a team-level risk.
2. Separate the pattern's invariant from its design-space knobs — three of each.
3. Contrast the two orchestrator flavors and state the mature default with its exception.
4. Place orchestrator-worker against pipeline, peer-handoff, and debate — the axis that distinguishes each.
5. Why is centralized accountability an operational virtue, and what does it cost in flexibility?


---

## Wikilinks
[[build-supervisor]]
[[plan-and-execute]]
[[handoffs-routing]]
[[debate-consensus]]
[[subgraphs]]

## Status log
- Started: 2026-07-21
- Finished: null