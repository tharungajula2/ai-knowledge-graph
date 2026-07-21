---
id: hardening-pass
title: "Build: Hardening Pass"
domain: production
ring: 9
cluster: "The Resurrection"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-load-testing", "secrets-cost-engineering", "failure-drills-rollbacks", "resurrection", "observability-slos"]
tags: [production]
---

## ELI5
The system is alive (Ch 34) and fused with your brain (Ch 35) — now you make it *tough*. The node summary: **load, cost caps, failure drills.** A hardening pass is the deliberate pass over a working system to make it *production-robust* — verifying it survives load, can't run away on cost, and recovers from failure. It's the difference between "it works when I use it gently" and "it holds up in the real world" — applying this ring's scale-and-resilience disciplines (Chs 25-32) to your resurrected system as a final toughening before you call it production-ready.

## The Real Explanation
**Hardening as a deliberate pass (not scattered fixes).** You've *built* the hardening capabilities (load testing Ch 30, cost caps Ch 23, failure drills Ch 32) throughout the ring; the hardening pass is where you *systematically apply them* to the whole resurrected system (Ch 34-35), finding and fixing the weaknesses before real users (or a demo) find them. It's a focused, deliberate sweep: *test the system's limits, bound its risks, verify its recovery* — turning the working-but-untested resurrection into a genuinely production-ready system. Three fronts, per the node:

**Load hardening (Ch 30 applied).** Load-test the resurrected system (Ch 30, in demo mode Ch 16 to avoid LLM costs): find its capacity, its bottleneck, its latency-under-load (Ch 28's SLOs). Then *fix the bottlenecks*: add database connections (Ch 4), scale workers (Ch 26), add caching (Chs 12/31), tune rate limits (Ch 27). The goal: the system holds its SLOs (Ch 28) under realistic load, and you *know* its capacity (so a traffic spike or a demo doesn't surprise you). Verify: re-load-test, confirm the capacity and latency improved (Vol 07's measure-optimize-verify).

**Cost hardening (Ch 23 applied).** Verify the system *cannot* run away on cost (Vol 04 Ch 17, Vol 08's runaway-agent, Ch 23's strict caps): every LLM-calling path is cost-tracked (Ch 23), strict budget caps enforce (global, per-user, per-day — the request is *refused* at the cap, not just alerted), and the loops/agents can't spiral into a huge bill (Vol 04 Ch 16's guards + Ch 23's caps). Verify: force a cost spike (a loop, a burst) and confirm the caps *stop* it (the runaway-bill disaster, prevented and *tested*). Cost hardening is sleeping-at-night insurance — you *know* the bill can't explode.

**Failure hardening (Ch 32 applied).** Run failure drills (Ch 32) against the resurrected system: kill the database, fail the LLM API (Vol 02 Ch 11's fallbacks), drop a worker (Ch 26), cut a dependency — and verify graceful degradation (fallbacks, honest errors, recovery) not catastrophic failure. Fix the resilience gaps the drills expose. Verify the rollback protocol (Ch 32 — can you revert a bad deploy fast?) and the migration backups (Ch 32 — is your data safe through schema changes?). The goal: the system *recovers* from the failures that *will* happen, and you've *rehearsed* the recovery (Vol 08 Ch 14's assume-breach).

**Why a hardening pass matters (the production-ready threshold).** A system that works in gentle use but hasn't been load-tested, cost-capped, and failure-drilled is *not production-ready* — it's a demo waiting to break under real conditions (Vol 08 Ch 18's responsible shipping — you don't ship what you haven't hardened). The hardening pass is the threshold-crossing: after it, you can *responsibly* say the system is production-ready, because you've *verified* it survives load, can't run away on cost, and recovers from failure — the three ways production systems fail, each tested and defended. It's also the maturity signal: an engineer who *hardens* (not just builds) thinks about production reality, not just the happy path.

## Why It Matters
Where this appears in real systems and jobs: load, cost caps, failure drills.

## Hands-On
Harden the resurrection (est. 1-1.5 days): (1) *Load*: load-test the full system (Ch 30, demo mode) → find and fix bottlenecks → re-test → confirm SLOs hold under load (Ch 28). (2) *Cost*: verify strict caps enforce (Ch 23) → force a cost spike → confirm the caps refuse-and-stop it → the bill-can't-explode proof. (3) *Failure*: run drills (Ch 32 — kill DB, fail LLM, drop worker) → fix resilience gaps → verify graceful degradation + rollback + migration backups. Document the hardening (what you tested, what you found, what you fixed). This makes RESURRECTION (Ch 34) genuinely production-ready. Tag `prod-v1.0`. The load-hardening (capacity + fixes), the cost-cap-stops-runaway proof, and the failure-drill-and-recovery = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is a hardening pass, and how does it differ from scattered fixes?
2. Walk load hardening — test, find bottleneck, fix, re-verify against SLOs.
3. How does cost hardening prove the bill can't explode, and why is that sleeping-at-night insurance?
4. What do failure drills verify, and what three failure fronts does hardening cover?
5. Why is a hardening pass the production-ready threshold, and how does it relate to responsible shipping?


---

## Wikilinks
[[build-load-testing]]
[[secrets-cost-engineering]]
[[failure-drills-rollbacks]]
[[resurrection]]
[[observability-slos]]

## Status log
- Started: 2026-07-21
- Finished: null
