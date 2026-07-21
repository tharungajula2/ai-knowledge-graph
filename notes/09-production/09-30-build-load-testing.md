---
id: build-load-testing
title: "Build: API Load Testing"
domain: production
ring: 9
cluster: "Enterprise Architecture & Scale"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["cost-latency-dashboards", "build-demo-mode", "observability-slos", "build-async-workers", "failure-drills-rollbacks"]
tags: [production]
---

## ELI5
Your system works for *you* — but will it work for a *hundred* concurrent users? The node summary: **write a load testing suite using Locust/k6 to simulate concurrent users accessing agent endpoints and analyze latency spikes.** Load testing answers "how does my system behave under real load?" *before* real users find out the hard way. It's how you discover your breaking points, latency cliffs, and bottlenecks in a controlled test rather than in a production incident — the empirical complement to all your scaling theory (Chs 25–28).

## The Real Explanation
**Why load test — knowing your limits before users do.** Your system has a *capacity* (how many concurrent requests before it degrades) and *behavior under load* (does latency climb gracefully or cliff-off? does it error? does it fall over?) — and you *don't know these* until you measure them (Vol 07's measure-don't-believe, for scale). Load testing *simulates* many concurrent users hitting your system, so you discover: the *capacity* (how many concurrent users before SLOs Ch 28 break), the *bottleneck* (what fails first — the database connections Ch 4? the LLM rate limits Vol 02 Ch 10? the workers Ch 26? CPU?), the *latency behavior* (p99 under load, Ch 28 — the "latency spikes" the node names), and the *failure mode* (does it degrade gracefully or catastrophically?). Knowing these lets you provision correctly (Ch 18), set limits (Ch 27), and define realistic SLOs (Ch 28) — *before* a traffic spike (or a demo to a recruiter) finds the breaking point for you.

**The tools and the method (Locust/k6).** *Locust* (Python-based — write user behavior as Python, familiar) and *k6* (JavaScript-based, high-performance) are load-testing frameworks: you define *virtual users* (their behavior — hit these endpoints, in this pattern) and the tool *simulates* many of them concurrently, ramping up load and measuring results. The method: define realistic user scenarios (a user chats, an agent runs — your real endpoints Ch 1); ramp load (10 users → 100 → 1000, watching where it breaks); measure (latency percentiles Ch 28, error rate, throughput, resource usage Ch 15); and *find the knee* — the load level where latency spikes or errors climb (the capacity limit). The AI-specific wrinkle: agent endpoints are *slow and expensive* (Vol 04 Ch 17), so load-testing them costs real money (LLM calls) — use demo mode (Ch 16 — mock the LLM so load tests are free and don't rate-limit you) to load-test the *system* (your API, DB, workers) without the LLM cost, then targeted small tests with real calls.

**What load testing reveals (the actionable findings).** *The bottleneck* (the first thing to saturate — Vol 04 Ch 17's profiling, for systems: don't guess what limits you, *measure* it; it's often the database connection pool Ch 4, or LLM rate limits Vol 02 Ch 10, not what you'd assume). *The capacity* (max sustainable concurrent load — informs provisioning Ch 18 and SLOs Ch 28). *The latency curve* (how p99 grows with load — graceful vs cliff). *The failure mode* (Ch 32's concern — does it shed load gracefully, or cascade-fail? — better to discover in a test). Each finding is actionable: the bottleneck is your optimization target, the capacity sets your scaling triggers (Ch 28's HPA), the failure mode drives your resilience work (Ch 32).

**Verification — simulated load runs, per the node.** Run the load test at increasing levels: confirm it measures latency percentiles, error rates, and throughput under load; identify the bottleneck (what saturates first); find the capacity (where SLOs break); characterize the latency spike (the knee). Then the payoff: *fix one bottleneck* the test found (add DB connections Ch 4, add workers Ch 26, add caching Ch 12) and *re-test* to confirm the capacity improved (Vol 07's measure-optimize-verify, for scale). The bottleneck-found-and-fixed loop is the build's real value.

## Why It Matters
Where this appears in real systems and jobs: Write a load testing suite using Locust/k6 to simulate concurrent users accessing agent endpoints and analyze latency spikes; verify with simulated load runs.

## Hands-On
Build it (est. 1 day): a Locust/k6 load-test suite (realistic user scenarios hitting your agent endpoints Ch 1) → run against your system *in demo mode* (Ch 16 — free, no LLM cost/rate-limits) at ramping load → measure (latency p99, errors, throughput, resources) → find the bottleneck and the capacity → fix one bottleneck (Ch 4/26/12) → re-test to confirm improvement. This validates RESURRECTION's scale (Ch 34) and feeds the hardening pass (Ch 36). Tag `prod-v0.17`. The load-test suite + the bottleneck/capacity findings + the fix-and-retest improvement = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why load test — what do you not know about your system until you measure it under load?
2. Describe the method (virtual users, ramping load, finding the knee) and the tools.
3. Why use demo mode for load testing agent endpoints, and what does it let you test cheaply?
4. What four things does load testing reveal, and why is each actionable?
5. Why is the bottleneck often *not* what you'd guess, and which prior principle does that echo?


---

## Wikilinks
[[cost-latency-dashboards]]
[[build-demo-mode]]
[[observability-slos]]
[[build-async-workers]]
[[failure-drills-rollbacks]]

## Status log
- Started: 2026-07-21
- Finished: null
