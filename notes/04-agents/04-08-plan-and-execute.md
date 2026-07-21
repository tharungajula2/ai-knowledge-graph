---
id: plan-and-execute
title: "Plan-and-Execute"
domain: agents
ring: 4
cluster: "LangGraph & Patterns"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["what-makes-an-agent", "structured-output", "hitl-interrupts", "build-research-agent", "reflection-patterns"]
tags: [agents]
---

## ELI5
Two ways to cook a complex dinner. **Reactor**: open the fridge, decide one step, do it, look again, decide again — flexible, but you may discover at step nine that step two doomed the dessert. **Planner**: write the full menu and sequence first, then execute it, adjusting as reality intrudes. Your agents so far are pure reactors — ReAct decides one action at a time, forever. The node summary names the alternative and the tension: **planners vs reactors.** Neither wins everywhere; knowing *which when* — and how the hybrid works — is the architectural judgment this chapter installs.

## The Real Explanation
**The reactor's hidden weaknesses — name them before fixing them.** One-step-at-a-time reasoning has three structural costs: (1) *myopia* — no step is chosen with the full journey in view, so globally-suboptimal paths (redundant searches, wrong-order dependencies) emerge from locally-sensible choices; (2) *goal drift* — over many steps, the original objective dilutes in a growing context (each decision conditions on everything, and everything keeps growing — Vol 01 Ch 8 economics compounding into Ch 16's derailment disease); (3) *no cost preview* — you can't estimate a run's budget when even the agent doesn't know what it'll do next (Ch 17 will want that preview badly).

**Plan-and-execute — the pattern.** Two roles, cleanly split: a **planner** call produces the full step list up front — structured output, naturally: `list[PlanStep]` with descriptions and dependencies (Vol 02 Ch 6, now producing *programs*) — then an **executor** loop works through steps, each step a small focused task (often itself a mini-ReAct with a narrow goal and a subset of tools). Between steps, the results accumulate in state. The wins mirror the reactor's losses: global coherence (every step chosen with the whole in view), a stable goal (the plan *is* the goal, pinned in state, immune to drift), and a previewable budget (count the steps before spending a rupee — and show the plan to a human first: **a plan is a natural gate artifact**; approving a 6-step plan once beats approving 6 actions separately — Ch 7's approval-fatigue medicine, upgraded; your Ch 18 Node-Proposer will lean on exactly this).

**The failure that defines the pattern — stale plans.** Reality diverges from step 2's assumptions, and a naive executor marches on executing a fiction (the planner's myopia in mirror image: perfect global view of a world that no longer exists). The fix, and the shape all serious implementations share: **replanning** — after each step (or on failure/surprise), a cheap check: "given what we've learned, does the remaining plan still hold?" — usually yes (continue, cheap); sometimes no (invoke the planner again with the accumulated learnings; the plan is versioned state, not scripture). Notice — and write this down, because it's the kind of connection that makes your graph a *brain* — this is **Rule 6 of your own curriculum**: replan with a written reason, never from restlessness. Your learning system and your agents share an architecture; you built the discipline before you met the pattern.

**Planner vs reactor — the decision table.** Task decomposable and stable (report generation, multi-source research, migrations)? → plan-and-execute. Environment surprising, next step genuinely unknowable (debugging, exploration, conversation)? → react. Cost/latency: planning adds an upfront call but often *reduces* total steps (fewer wanderings); reaction spends nothing up front and everything on wandering. Autonomy dial (Ch 1): a plan reviewed by a human is *less* autonomous per-step and *more* trustworthy — often exactly the trade production wants. And the answer that's usually right in practice: **hybrid** — plan the skeleton, react within each step, replan on surprise. LangGraph shape: planner node → executor subgraph (Ch 10 vocabulary incoming) → replan-check conditional edge → loop or END.

## Why It Matters
Where this appears in real systems and jobs: planners vs reactors.

## Hands-On
Paper drill, three parts: (1) Take Ch 2's manual task and *plan it first* — write the full step list with dependencies, then compare against your actual reactive transcript: count the wasted steps reaction took, and find one step where the plan's global view would have reordered things. (2) Sabotage the plan: pick a step whose assumption you now invalidate ("the calendar is actually empty that week") and walk the replan — what survives, what regenerates, what the written reason would say. (3) The routing table: six tasks (write a research report; debug a failing test; book a three-city trip; answer "what's my cheapest deploy option"; refactor a module; hold a tutoring conversation) — for each: react, plan, or hybrid, with the one-line reason. Table + the Rule 6 connection paragraph = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the reactor's three structural weaknesses and the planner win that mirrors each.
2. Why is a plan structured output, and what does that enable for gating and budgeting?
3. Define the stale-plan failure and the replanning fix — and connect it to your curriculum's Rule 6.
4. Recite the decision table's axes and place two tasks on each side.
5. Describe the hybrid and its LangGraph shape.


---

## Wikilinks
[[what-makes-an-agent]]
[[structured-output]]
[[hitl-interrupts]]
[[build-research-agent]]
[[reflection-patterns]]

## Status log
- Started: 2026-07-21
- Finished: null
