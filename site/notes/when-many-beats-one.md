## ELI5
The industry is drunk on multi-agent systems — swarms, crews, societies of minds. Some of it is real engineering; much of it is one agent wearing five hats and a marketing budget. The node summary is a promise to stay sober: **honest criteria for multi-agent (and when it's hype).** Before you build a team this volume, you earn the right to by learning exactly when a team is *worse* than a soloist — because the default answer, more often than demos admit, is "use one agent."

## The Real Explanation
**The null hypothesis, stated first and defended hard: one good agent with good tools usually wins.** A single ReAct agent (Vol 04) with a well-designed toolbox is simpler to build, debug, price, and reason about — and every agent you add multiplies cost (Ch 7's math), multiplies failure surface (each agent has Vol 04 Ch 16's whole zoo), and adds a *new* failure class that solo agents can't have: coordination failure (handoffs dropping context, agents disagreeing, the supervisor misrouting). The burden of proof is on *many*, always. "Least agents that solve the task" is Vol 04 Ch 1's least-autonomy principle, one level up — and it's the sentence that separates engineers from enthusiasts in interviews.

**The three honest reasons to go multi — and only these.**
1. **Genuinely distinct specialties with distinct tools and context.** When subtasks need *different toolboxes, different system prompts, different failure modes* — research (web tools, exploratory) vs writing (style rubric, reflection) vs calculation (sandboxed math, verification) — one agent juggling all of it suffers *context interference*: its scratchpad mixes search snippets with draft prose with numbers, its tool catalog balloons (more tools = worse selection, Vol 04 Ch 3), its one system prompt can't be optimal for three jobs. Separation buys focus. This is the real reason your Vol 04 supervisor exists — and the test is *distinctness*, not merely "multiple steps" (multiple steps is a job for one agent's loop, not many agents).
2. **Context isolation as a feature.** Sometimes you *want* walls: a critic that must not see the generator's rationalizations (Ch 15's writer-critic depends on this — fresh eyes require an unpolluted context, Vol 04 Ch 9's reflection insight, enforced by architecture); a sub-agent handling untrusted content quarantined from one holding secrets (a security boundary — Ch 13's MCP security theme foreshadowed). Isolation you'd have to *fake* inside one agent is *free* across two.
3. **Parallelism for latency.** Independent subtasks running concurrently (Ch 5) — three sources researched at once, not in sequence — genuinely cuts wall-clock. But note the honesty (Ch 7): parallelism cuts *latency*, never *cost* (you still pay for every agent's every token), and only *independent* work parallelizes.

**The hype tells — how to smell a fake team.** Multi-agent theater has signatures: agents that could be functions (a "summarizer agent" that makes one LLM call is a *tool*, not an agent — Vol 04 Ch 1's test: does it loop through the world?); "roles" that are just personas on the same context (five hats, one head — no isolation, no distinct tools, pure ceremony); coordination overhead exceeding the work (a supervisor spending more tokens routing than the task needs total); and the tell-tale demo that would be *simpler and better* as one agent with five tools. The diagnostic question for any proposed team: *what does each agent have that the others don't — tools, context, or genuine parallelism?* If the answer is "a different prompt," it's hype.

**The cost you're signing up for (preview of Ch 7).** Every agent-to-agent handoff re-establishes context (tokens), the supervisor reasons about routing (tokens), and specialists can't share a scratchpad without recreating context interference (so they re-derive shared facts — tokens). A naive three-agent system can cost 3–5× a solo agent for the *same task* — sometimes worth it (the three reasons above), often not. You'll measure this yourself, honestly, in Ch 17's one-vs-many experiment; this chapter is the hypothesis that experiment tests.

## Why It Matters
Where this appears in real systems and jobs: honest criteria for multi-agent (and when it's hype).

## Hands-On
The sobriety drill: (1) Audit five "multi-agent" systems — your own Vol 04 supervisor plus four from blog posts / framework demos / product announcements — against the three honest reasons and the hype tells. For each: real team or hype, and *which specific reason* (or which tell) decides it. Be ruthless with the demos; be ruthless with your own. (2) Take your Vol 04 research agent and ask the hard question: could it have been a *team*? Would that have been better? Write the honest answer with the cost/benefit named — you may conclude your solo agent was correct, and concluding that correctly is the chapter's real win. (3) Write your own one-sentence test for "does this task want a team?" and attack it with an edge case until it survives. The refined test opens the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the null hypothesis and defend the burden-of-proof direction.
2. Name the three honest reasons, and give the distinctness-vs-multiple-steps distinction for reason 1.
3. Explain context isolation as a feature with the critic example — why can't one agent fake it well?
4. Recite three hype tells and the single diagnostic question that exposes a fake team.
5. What does multi-agent cost, roughly, versus solo — and which chapter makes you prove it?


---

## Wikilinks
[[what-makes-an-agent]]
[[build-supervisor]]
[[token-economics-of-teams]]
[[experiment-one-vs-many]]

## Status log
- Started: 2026-07-21
- Finished: null