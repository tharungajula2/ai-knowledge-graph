---
id: build-writer-critic
title: "Build: Writer + Critic"
domain: multi-agent-mcp
ring: 5
cluster: "Team Builds"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["reflection-patterns", "debate-consensus", "orchestrator-worker", "when-many-beats-one", "build-eval-judge"]
tags: [multi-agent-mcp]
---

## ELI5
The cluster's warm-up build, and the cleanest possible multi-agent system: **two agents improving a draft in a loop; add a supervisor; measure gain.** The node summary embeds the whole scientific method — build the team, *and prove it's better than not having it*. This is Vol 04 Ch 9's reflection socialized into two real agents (Ch 6's role-based adversarial, minimal case), and — critically — the first build where you *measure the multi-agent gain* instead of assuming it, exactly as Ch 1 and Ch 7 demanded.

## The Real Explanation
**The two agents, and why they're two (not one reflecting).** *Writer*: produces and revises the draft — its own context, its own system prompt (a generative voice). *Critic*: evaluates against explicit criteria and returns structured feedback — *separate* context, *separate* prompt (an evaluative voice). Why two agents rather than one agent critiquing itself (Vol 04 Ch 9)? The Ch 1 isolation argument, concretely: the critic that *never saw the writer's rationalizations* judges more honestly — fresh eyes, unpolluted by the generation's in-flight commitments. This is the multi-agent justification (reason 2, context isolation) actually *earning* its keep, and the build lets you test whether it does.

**The loop.** Writer drafts → Critic evaluates against a rubric (structured output: `Critique(approved: bool, issues: list[Issue])` — Vol 02 Ch 6, Vol 04 Ch 9's rubric discipline) → if not approved, feedback goes to Writer → Writer revises → repeat, **budget-capped** (Vol 04 Ch 9/16 — reflection loops are infinite-loop bait; max rounds, non-negotiable). LangGraph shape: writer node → critic node → conditional edge (approved → END; else → writer), with round-count in state.

**Adding the supervisor (the node's "add a supervisor").** The two-agent loop is peer-ish; the supervisor makes it orchestrated (Ch 2): a supervisor node that takes the task, dispatches to the writer-critic subgraph (Vol 04 Ch 10 — the loop is a *subgraph*), and decides completion/integration. Why add it? Scalability of the pattern (the supervisor could route to *different* writer-critic pairs by content type) and clean accountability (Ch 2's centralized-ownership virtue). It also sets up the measurement: supervisor-orchestrated team vs bare single agent.

**Measuring the gain — the point of the whole build.** This is where Ch 1's skepticism and Domain 07's evals meet in your own hands. Take a set of ~8 writing tasks with *checkable quality criteria* (a rubric: covers required points, correct format, cited if needed, under length, no hedging). Run each three ways, scoring quality and cost: (a) single agent, one shot; (b) single agent with self-reflection (Vol 04 Ch 9 — the *fair* baseline, because it isolates "two agents" from "just reflecting at all"); (c) the writer-critic team. The crucial comparison is **(b) vs (c)** — does *separating* the critic beat *self*-critique, and is the gain worth the cost (Ch 7)? Report honestly: the multi-agent gain might be real (isolation helps), marginal (self-reflection was most of it), or negative on some tasks (coordination overhead exceeded the benefit). *Whatever the numbers say is the finding* — this is a real experiment (Ch 17 scales it), and reporting an honest null or negative result is the mark of an engineer, not a hype-merchant.

**Verification.** Isolation: writer produces drafts, critic produces structured critiques with issues, loop terminates on approval and on budget. Integration: supervisor dispatches and completes. The measurement harness: the three-way scoring across 8 tasks, with a small rubric-based scorer (your Vol 03 Ch 18 eval instincts). Tests: budget cap fires; critic's rejection actually changes the next draft (assert the revision differs); approved drafts pass the rubric.

## Why It Matters
Where this appears in real systems and jobs: two agents improving a draft in a loop; add a supervisor; measure gain.

## Hands-On
Build it (est. 1 day): writer + critic nodes → the capped loop → the subgraph → the supervisor → the three-way measurement harness → run the 8 tasks → the honest comparison table. Then write the finding as if publishing it (it feeds Ch 17 and your capstone): *did separating the critic beat self-reflection, by how much, at what cost multiple, and on which task types?* Include the surprise if there is one (a task where the team did *worse*). Tag `writer-critic-v0.1`. The three-way table + the honest finding paragraph = the note — and notice you've now done, in miniature, exactly what Ch 17 does at full scale.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why two agents instead of one self-critiquing? State the isolation argument concretely.
2. Why is the *fair* baseline single-agent-with-reflection, not single-agent-one-shot?
3. What does the (b) vs (c) comparison actually test, and what are the three honest possible outcomes?
4. Why is the budget cap non-negotiable, and where have you met this exact hazard before?
5. Your finding: did isolation earn its keep? The number, the cost, and the honest verdict.


---

## Wikilinks
[[reflection-patterns]]
[[debate-consensus]]
[[orchestrator-worker]]
[[when-many-beats-one]]
[[build-eval-judge]]

## Status log
- Started: 2026-07-21
- Finished: null
