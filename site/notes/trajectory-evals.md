## ELI5
So far you've scored *answers* — but an agent doesn't just produce an answer, it takes a *path*: reason, act, observe, repeat (Vol 04 Ch 1). Two agents can reach the same answer, one by a clean three-step path and one by a chaotic twelve-step flail — and answer-only scoring calls them equal. The node summary: **scoring the path, not just the answer.** For agents, *how* they got there matters as much as *where* they arrived — for cost, for reliability, for debugging — and trajectory evals are how you measure the journey.

## The Real Explanation
**Why the answer alone isn't enough (the agent-specific eval gap).** An answer-only eval misses: *efficiency* (the clean path vs the twelve-step flail cost 4× — Vol 04 Ch 17; same answer, wildly different bill); *reliability* (an agent that got the right answer *by luck* — a wrong tool that happened to work — will fail next time; the *process* predicts future behavior, the answer doesn't); *the right-answer-wrong-reason trap* (correct output from flawed reasoning — Vol 02 Ch 5 — is a landmine: it passes your answer eval and explodes in production on a case where the flawed reasoning matters); *partial credit* (an agent that did excellent research but botched the final synthesis scores zero on answer-eval, but its *trajectory* was mostly right — knowing that tells you exactly what to fix). The trajectory is where an agent's *true quality* lives; the answer is just its last token.

**What to score in a trajectory — the dimensions.** *Path efficiency*: number of steps, tool calls, tokens vs the optimal — did it wander (Vol 04 Ch 16's derailment) or go straight? *Tool-use correctness*: right tools, right args, right order (Ch 6's whole subject). *Reasoning quality*: were the intermediate thoughts sound, or did it get lucky (audit the scratchpad — Vol 04 Ch 13 — which your traces, Ch 13, make visible)? *Goal adherence*: did it stay on the original goal or drift (Vol 04 Ch 8)? *Recovery*: when a step failed, did it adapt gracefully (Vol 04 Ch 16's guards) or spiral? *Error patterns*: did it exhibit any failure-zoo specimen (Vol 04 Ch 16 — loops, spam, cascades)? Each is scorable — some programmatically (step count, tool sequence), some by an LLM judge reading the trajectory (reasoning quality — the judge, Ch 3, pointed at the *path* instead of the answer).

**How trajectory evals work — the mechanism.** You need the *full trace* (Ch 13's tracing build makes this possible — trajectory evals *depend on* observability, which is why this ring pairs them): the complete record of every step, thought, tool call, observation, and decision. Then: *reference trajectories* (for some cases, you define the *ideal* path — "should search web, then notes, then synthesize" — and score against it, like golden answers but for paths — Ch 2's golden set gains trajectory expectations); *trajectory rubrics* (LLM-judge the path against criteria — "was the tool selection justified? did it recover from the error well?"); *specific metrics* (Ch 6's tool-use metrics, step counts, cost). The subtlety: paths are *more variable* than answers (many good paths exist to one answer — non-determinism compounds over steps), so trajectory scoring tolerates *path diversity* while catching *path pathology* — you're not demanding the one true path, you're catching the flails, loops, and wrong-reasons.

**When trajectory evals earn their cost.** They're more expensive than answer-evals (more to capture, more to score) and matter most for: *multi-step agents* (the more steps, the more the path matters), *cost-sensitive systems* (Vol 04 Ch 17 — efficiency *is* the metric), *reliability-critical systems* (where right-answer-wrong-reason is dangerous), and *debugging* (a failing agent's trajectory shows *where* it failed — Ch 14). For a single-shot LLM call, there's no trajectory to score; for your multi-agent research system with a node-proposer, trajectory evals are essential — which is exactly why the Ch 18 harness includes them.

## Why It Matters
Where this appears in real systems and jobs: scoring the path, not just the answer.

## Hands-On
Add trajectory scoring to your research agent (concept node, concrete): (1) On 5 golden cases, capture full trajectories (your Vol 04 agent already logs transcripts — that's your proto-trace) and score each on the dimensions: step count, tool-use correctness, goal adherence, and reasoning quality (LLM-judge the scratchpad). (2) Find the money case: an example where *answer-eval and trajectory-eval disagree* — same/good answer, bad path (a flail, a lucky wrong-tool, a near-derailment) — this disagreement is the chapter's whole point, witnessed in your own agent. (3) Define a reference trajectory for one case (the ideal path) and score against it. The dimension scores + the answer-vs-trajectory disagreement specimen + the reference-trajectory scoring = the note; feeds the Ch 18 harness.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name four things answer-only scoring misses, and why the path predicts future behavior.
2. Recite the trajectory dimensions, and which are programmatic vs judge-scored.
3. What does trajectory eval *depend on*, and why does this ring pair it with tracing?
4. How does trajectory scoring tolerate path diversity while catching pathology?
5. When do trajectory evals earn their cost, and when is there no trajectory to score?


---

## Wikilinks
[[agent-failure-modes]]
[[cost-latency-budgets]]
[[scratchpads-working-memory]]
[[tool-use-metrics]]
[[build-tracing-instrumentation]]

## Status log
- Started: 2026-07-21
- Finished: null