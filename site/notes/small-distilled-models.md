## ELI5
For years the field's slogan was "bigger is better." Then a quieter counter-current: a 3B model, trained *well*, on data *curated by a bigger model*, started beating last year's 70B at specific jobs. Why are tiny models eating the edge? Because most real workloads don't need a philosopher — they need a fast, cheap, reliable clerk. And because big models can now *teach* small ones.

## The Real Explanation
**The two forces.** (1) **Data quality beats parameter count** past a threshold: a small model trained on carefully filtered, textbook-quality tokens punches far above its weight class. (2) **Distillation** — the big idea you'll formalize in Chapter 12: use a large "teacher" model to generate training data (or soft probability targets) for a small "student." The student inherits a compressed slice of the teacher's ability at a fraction of the serving cost. Much of the small-model boom is teachers quietly educating students at industrial scale.

**The permanent decision frame — capability density.** Ask of any workload: what's the *minimum* capability that clears the quality bar (your evals define the bar — Vol 07's whole point)? Route to the smallest model that clears it. This is your gateway's routing policy (Vol 02) and the cost lever from Vol 04 Ch 17, now with a principled basis: frontier model for hard reasoning, small model for classification/extraction/formatting, local model for private/cheap. The engineer's edge isn't knowing the biggest model; it's knowing the *cheapest sufficient* one — and proving sufficiency with a golden set, not vibes.

**Where small wins structurally.** Edge devices (phones, laptops — Chapter 1's world), high-volume pipelines (millions of cheap calls), latency-critical paths (voice — Chapter 3 will demand this), and privacy-bound workloads. Where small loses: long-horizon reasoning, broad world knowledge, and graceful handling of the weird — exactly the failure shapes your evals catch.

## Why It Matters
Where this appears in real systems and jobs: why tiny models are eating the edge.

## Hands-On
Take one real task from your own system — the memory-extraction classification from Vol 06 is perfect (semantic/episodic/procedural is a clerk's job). Run its golden set against three tiers: a frontier model, a small hosted model, and your Chapter 1 local model. Build the honest table: quality score, cost per 1K calls (tokentools prices it — Vol 01's package still paying rent in the final ring), latency. Write the routing verdict in your note. If the small model clears the bar: change the route in your gateway config *for real*.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Explain distillation to a 12-year-old (a great teacher writing a summary textbook for a young student works).
2. What are the two forces that made small models good, and which one is under your control as an app engineer?
3. Define "cheapest sufficient model" and name what makes sufficiency *provable* rather than vibes.
4. From your table: where did the small model break, and was the break predictable from this chapter's "where small loses" list?
5. Why do small models matter *more* as agent systems scale? (Hint: Vol 04 Ch 17's cost integral — many loop iterations × per-call cost.)


---

## Wikilinks
[[preference-tuning-distillation]]
[[local-models]]
[[build-gateway]]
[[cost-latency-budgets]]
[[build-golden-dataset]]

## Status log
- Started: 2026-07-21
- Finished: null