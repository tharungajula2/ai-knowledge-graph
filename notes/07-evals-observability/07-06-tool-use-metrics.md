---
id: tool-use-metrics
title: "Tool-Use Metrics"
domain: evals-observability
ring: 7
cluster: "Measuring Quality"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["tool-calling", "designing-tools", "agent-failure-modes", "trajectory-evals", "cost-latency-budgets"]
tags: [evals-observability]
---

## ELI5
Trajectory evals (Ch 5) score the whole path; this chapter zooms into the single most consequential thing on that path — tool use. The node summary is the checklist: **right tool, right args, right time.** An agent is only as good as its tool use (Vol 04 Ch 7 — tools are how it acts on the world), and tool-use failures are a huge fraction of all agent failures (Vol 04 Ch 16's tool pathologies). Measuring tool use precisely tells you exactly where your agent's *hands* fail — separate from whether its *reasoning* is sound.

## The Real Explanation
**The three questions, made metrics (the node's triad, operationalized).**
- **Right tool** — *tool selection accuracy*: given a situation, did the agent pick the correct tool? Measured against expected selections (Ch 2's golden cases can specify "should use search_notes here"). Failures: wrong tool chosen (Vol 04 Ch 3's misuse — usually a description problem), tool called when none was needed (tool spam — Vol 04 Ch 16), needed tool *not* called (the agent answered from vibes when it should have searched — a grounding failure). This metric isolates *selection* quality.
- **Right args** — *argument correctness*: given the right tool, were the arguments well-formed and appropriate? Failures: malformed args (schema violations — Vol 02 Ch 6, should be caught by validation), wrong values (right tool, bad query — "search for X" when it should search for the more specific Y), missing/hallucinated parameters. This isolates *parameterization* quality, which is often where a "smart" agent quietly fails — it picks the right tool and feeds it a bad query.
- **Right time** — *sequencing and timing*: was the tool called at the right point in the path? Failures: premature calls (acting before gathering enough context), out-of-order calls (calling B before A when B needs A's output — Vol 04 Ch 14's dependency), redundant calls (calling the same tool with the same args twice — the loop signature, Vol 04 Ch 16). This isolates *orchestration* quality.

**Why decompose tool use this way — the diagnostic power.** An aggregate "the agent's tool use is bad" is useless; the triad *localizes*: bad selection → fix tool descriptions (Vol 04 Ch 3); bad args → fix the arg schemas/descriptions or the reasoning that fills them; bad timing → fix the orchestration logic or add sequencing guards (Vol 04 Ch 16). Each metric points at a *different* fix. This is Vol 01 Ch 12's precision/recall spirit — decompose a vague quality into specific, actionable measurements — applied to the agent's hands.

**How to measure — the mechanism.** From traces (Ch 13): extract every tool call with its context, selection, args, and position. Then: *selection accuracy* — programmatic where golden cases specify expected tools, LLM-judge where selection requires judgment ("was calling search justified here?"). *Arg correctness* — schema validation (programmatic, free) catches malformed; LLM-judge or golden-comparison catches wrong-but-valid values. *Timing/sequencing* — programmatic detection of redundant calls (hash the (tool,args) — Vol 04 Ch 16's repetition detection, reused as a metric), out-of-order patterns, and call-count vs optimal. Aggregate into a *tool-use scorecard* per agent: selection accuracy %, arg-correctness %, redundant-call rate, unnecessary-call rate. That scorecard, tracked over versions, tells you if a change to your tools or prompts helped or hurt the agent's hands.

**The special metrics that matter in production.** *Unnecessary tool-call rate* (tool spam — direct cost, Vol 04 Ch 17): what fraction of calls didn't need to happen? *Tool-error recovery rate*: when a tool returned an error (Vol 04 Ch 3's legible errors), did the agent recover (adapt) or spiral? — a reliability metric that predicts production robustness. *Tool latency contribution*: which tools dominate the agent's wall-clock (Ch 17's dashboards) — the slow tool is the optimization target. These production-flavored metrics connect tool-use quality directly to the cost and latency you'll dashboard in Ch 17.

## Why It Matters
Where this appears in real systems and jobs: right tool, right args, right time.

## Hands-On
Build a tool-use scorecard for your research agent (concept node, concrete): (1) From 5 golden-case trajectories, extract every tool call and score the triad — selection (right tool? against expected), args (well-formed? appropriate values?), timing (redundant? out-of-order?). Produce the scorecard: selection %, arg %, redundant-rate, unnecessary-rate. (2) Find the localizing insight: which of the three (selection/args/timing) is your agent's *weakest*, and therefore which fix (descriptions / schemas / orchestration) would help most? This is the diagnostic payoff — one metric pointing at one fix. (3) Measure error recovery: on a case where a tool errored, did the agent recover? Score the recovery. The scorecard + the weakest-dimension diagnosis + the recovery result = the note; feeds the Ch 18 harness.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the three tool-use questions as metrics, and the distinct failure modes under each.
2. Why decompose tool use into the triad — what does each metric's *fix* point at?
3. How is each of the three measured — programmatic vs judge?
4. Name the three production-flavored tool metrics and what each predicts.
5. Give an example where "the agent picked the right tool but still failed" — which metric catches it?


---

## Wikilinks
[[tool-calling]]
[[designing-tools]]
[[agent-failure-modes]]
[[trajectory-evals]]
[[cost-latency-budgets]]

## Status log
- Started: 2026-07-21
- Finished: null
