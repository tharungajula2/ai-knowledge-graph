---
id: vizier-v2-evals-traces
title: "Build: v2 Evals & Tracing"
domain: frontier-capstone
ring: 10
cluster: "VIZIER v2 — The Final Masterpiece"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-eval-judge", "build-tracing-instrumentation", "build-eval-harness", "judge-bias-pinning", "ci-gates-for-ai", "failure-to-golden-loop", "synthesis-evals"]
tags: [frontier-capstone]
---

## ELI5
Right now, when someone asks "does v2 work?", your honest answer is "the tests pass and the demos looked good" — which is to say: vibes with extra steps. Today v2 gets the senior-engineer superpower (Vol 07's opening words): **measurement of a non-deterministic system**. LLM-as-judge regression testing so quality is a number with a trend, and observability tracing so every run is a readable story. After this chapter, "does it work?" gets answered the only way that counts: *here's the scorecard, here's the trace.*

## The Real Explanation
**The judge harness.** Per your Vol 07 builds, aimed at v2: golden datasets per subsystem (routing intents — exact-match, no judge needed; retrieval quality — the Vol 03 metrics; end-to-end task quality — rubric'd LLM-judge with the full discipline: versioned rubric, **pinned judge model** (Vol 07 Ch 4 — you know precisely why, twice over after Chapter 13), calibration rows, confidence flags). One command runs the sweep and emits a scorecard JSON + table. **Regression gating**: thresholds file in the repo; CI runs the cheap deterministic subset on every push (routing, scanner precision/recall, schema validity) and fails the build on regression (Vol 07 Ch 9's evals-as-merge-blockers, now guarding *your* main branch); the judge-based subset runs on demand — cost and flakiness documented as the reason, because writing down *why* a check isn't in CI is itself a senior habit. And the harvest loop: every real failure becomes a golden row (Vol 07's failure→golden build — the suite grows teeth from actual bites).

**The tracing layer.** Per your Vol 07 instrumentation build: spans around every meaningful unit — supervisor decision, each specialist run, every tool call, every gateway call — nested to mirror the graph, tagged with tokens/cost (tokentools' final promotion: from Vol 01 exercise to v2's cost nervous system) and latency, exported to your tracing backend (Langfuse-style). The acceptance demo is Vol 07 Ch 13's skill performed live: take one *real* v2 failure, open its trace, and debug from the spans alone — no print statements, no re-running. When a trace reads like a story, the instrumentation is right.

**Eval-driven development, closed loop.** The Vol 07 synthesis, now your operating system: change prompt/model/route → run sweep → read delta → keep or revert, *with the changelog reason* (Rule 6 breathing inside your dev loop). This is also where Chapter 12's before/after table generalizes: every future change to v2 gets a before/after table. That's just how you work now.

## Why It Matters
Where this appears in real systems and jobs: Implement LLM-as-a-judge regression testing and observability span tracing (taught by build-eval-judge & build-tracing-instrumentation).

## Hands-On
Build to acceptance (est. 1–2 honest days): assemble the golden sets (much is inherited — Vol 03's retrieval set, Chapter 15's routing intents, Chapter 17's attack suite as the security rows; add 10 end-to-end task rows fresh); judge + rubric + pinning + calibration; the one-command sweep; CI wiring with thresholds and one *deliberately-broken* push to watch the gate slam (screenshot for the film); tracing spans + backend + the live trace-debug of one real failure, written up. Then the inaugural **v2 scorecard** — every metric, dated — committed to the repo as `SCORECARD_v2.0.md`: the baseline all future work moves against. Tag `v2-evals-0.1`. In the note: the scorecard, the trace-debug story, and one sentence on which number surprised you.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Which v2 evals need a judge and which refuse one? State the dividing principle.
2. Judge pinning: give both reasons you now know — the Vol 07 one and the Chapter 13 one.
3. Why does the deterministic subset gate CI while the judge subset doesn't? Recite your documented reason.
4. Walk one real trace from your backend: span by span, where did the tokens and milliseconds go?
5. Describe the failure→golden loop with the actual failure you harvested this week.


---

## Wikilinks
[[build-eval-judge]]
[[build-tracing-instrumentation]]
[[build-eval-harness]]
[[judge-bias-pinning]]
[[ci-gates-for-ai]]
[[failure-to-golden-loop]]
[[synthesis-evals]]

## Status log
- Started: 2026-07-21
- Finished: null
