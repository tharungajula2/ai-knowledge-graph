---
id: online-evals
title: "Online Evals"
domain: evals-observability
ring: 7
cluster: "Seeing Inside"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["rag-evals-intro", "build-eval-judge", "judge-bias-pinning", "failure-to-golden-loop", "temporal-knowledge"]
tags: [evals-observability]
---

## ELI5
Your golden set (Ch 2) tests 20 curated cases; production sees *thousands of real, messy, unpredictable* inputs you never imagined. The node summary: **scoring production traffic continuously.** Offline evals (Part I) measure your system against a fixed test set *before* shipping; online evals measure it against *reality* after shipping — catching the failures your golden set didn't anticipate, tracking quality as it drifts, and turning production into a continuous eval. This is how you know your system is *still* good, not just *was* good at launch.

## The Real Explanation
**Offline vs online — the complementary pair.** *Offline evals* (Chs 2-9): fixed golden set, run before deploy, controlled, comparable, catch known-issue-types — but limited to what you thought to test (your golden set can't contain the inputs you never imagined). *Online evals*: score *real production traffic*, continuously, after deploy — catch the *unknown unknowns* (the weird real inputs), detect *drift* (quality silently degrading over time — model updates, changing user behavior, data shift), and measure *actual* user-facing quality (not proxy golden-set quality). You need both: offline to ship safely, online to *stay* safe. Online evals are where your system meets reality, and reality always has cases your golden set didn't.

**How you score traffic you have no ground truth for — the core challenge.** Offline, you authored expected answers (Ch 2); online, real inputs arrive with *no known-correct answer* — so how do you score them? The techniques: *reference-free LLM judges* (Ch 3's judge scoring quality without a golden answer — "is this response faithful to the retrieved context?" needs no ground truth, just the context and the answer — Vol 03 Ch 18's faithfulness works online!); *implicit signals* (user behavior as a quality proxy — did they accept the answer, retry, thumbs-down, abandon? — real signal, noisy); *explicit feedback* (thumbs up/down, ratings — direct but sparse, most users don't rate); *guardrail checks* (programmatic — did the output violate a rule, leak PII (Vol 06 Ch 8), hallucinate a citation (Vol 03 Ch 10's integrity check, run online)?); and *sampling for human review* (score a random sample by hand — expensive but ground-truth, and it *calibrates* the automated online scores, Ch 4's discipline). The mix: cheap automated scoring (judges, guardrails, implicit signals) on *all* traffic, human review on a *sample* to calibrate.

**Drift detection — the thing online evals uniquely catch.** Quality *degrades over time* for reasons offline evals can't see: *model drift* (the provider updated the model behind your API — Ch 4's pinning problem, now hitting production behavior), *data drift* (user inputs shift — a new use case emerges, seasonal changes, a viral prompt pattern), *concept drift* (what counts as a good answer changes — Vol 06 Ch 12's temporal knowledge, at the quality level). Online evals catch drift by *tracking metrics over time* — faithfulness this week vs last month, user-acceptance trending down, a spike in guardrail violations. A drift alert ("faithfulness dropped 8% this week") is the signal to investigate *before* users revolt. Offline evals are a snapshot; online evals are the *continuous monitoring* that catches the slow rot.

**The feedback loop — online evals feed offline (closing the ring's flywheel).** The deepest value: production failures caught by online evals become *new golden cases* (Ch 20's failure→golden loop — the real inputs you never imagined become permanent offline tests). Online eval finds a failure class → you add golden cases for it → your offline suite now catches it → CI gates it (Ch 9) → it never regresses. Online → offline → CI is the flywheel that makes your eval coverage *grow toward reality* over time, driven by production itself. This is how mature AI systems get *more* reliable in production rather than rotting — every real failure permanently strengthens the net.

## Why It Matters
Where this appears in real systems and jobs: scoring production traffic continuously.

## Hands-On
Design online eval for your systems (concept node, concrete): (1) Design the online eval layer for your brain-chat or research agent *if it were in production*: which reference-free judges run on all traffic (faithfulness, guardrails), which implicit signals you'd capture (retries, abandonment), what human-review sampling rate, and how you'd calibrate the automated scores. (2) Prototype one: run a reference-free faithfulness judge (Vol 03 Ch 18, no ground truth needed) on a batch of *unlabeled* real queries to your brain-chat — you're scoring "production" traffic. What did it catch? (3) Design drift detection: which metrics you'd track over time, what a drift alert looks like, and the online→offline→CI flywheel for one failure class. The online-eval design + the reference-free scoring result + the drift/flywheel design = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Contrast offline and online evals — what does each catch that the other can't?
2. How do you score traffic with no ground truth? Name four techniques and the calibration step.
3. Name the three types of drift and how online evals catch them.
4. Explain the online→offline→CI flywheel and why it makes systems *more* reliable over time.
5. Why do you need *both* offline and online evals, not either alone?


---

## Wikilinks
[[rag-evals-intro]]
[[build-eval-judge]]
[[judge-bias-pinning]]
[[failure-to-golden-loop]]
[[temporal-knowledge]]

## Status log
- Started: 2026-07-21
- Finished: null
