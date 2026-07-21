---
id: observability-slos
title: "Observability & SLOs"
domain: production
ring: 9
cluster: "Enterprise Architecture & Scale"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["monitoring-alerting", "cost-latency-dashboards", "build-tracing-instrumentation", "online-evals", "failure-drills-rollbacks"]
tags: [production]
---

## ELI5
Monitoring (Ch 15) tells you when it broke; SLOs tell you *how reliable it's supposed to be* — and give you a principled, numeric way to decide when reliability work matters more than features. The node summary: **metrics, logs, traces, and Service Level Objectives (SLOs) in production systems.** This chapter unifies the observability pillars (Vol 07, Ch 15, Ch 27) and adds the discipline that turns "make it reliable" (vague) into "99.5% of requests succeed under 2 seconds" (a target you engineer toward and measure against).

## The Real Explanation
**The three pillars of observability (unifying what you've built).** *Metrics* (Ch 15's golden signals, Vol 07 Ch 17's dashboards — numeric measurements over time: latency, error rate, throughput, cost — aggregate health). *Logs* (Ch 27's structured logs — discrete events with context — what happened, in detail). *Traces* (Vol 07 Ch 13 — the path of one request through the system — Ch 27's trace correlation). Together they answer different questions: metrics say *"something's wrong"* (the error rate spiked), logs say *"here's what happened"* (the specific errors), traces say *"here's where in the request it happened"* (the failing span). Mature observability uses all three — metrics to detect, traces to localize, logs to diagnose — the full debugging chain (Vol 07 Ch 14), infrastructure-grade.

**SLIs, SLOs, SLAs — the reliability vocabulary.** *SLI (Service Level Indicator)* — a *measured* aspect of service quality (the actual measured availability, the actual p99 latency — Ch 15's signals, as reliability measurements). *SLO (Service Level Objective)* — a *target* for an SLI ("99.5% of requests succeed," "p99 latency < 2s," "99.9% uptime") — the reliability goal you commit to and engineer toward. *SLA (Service Level Agreement)* — a *contractual* SLO with consequences (a paid customer's guaranteed uptime, with refunds if missed — the business version). The progression: measure reality (SLI), set a target (SLO), sometimes contract it (SLA). For your agent-lab, SLOs are the useful level: "my system should answer 99% of requests successfully in under N seconds" — a concrete reliability target.

**Why SLOs matter — the error budget (the genuinely useful idea).** An SLO of "99.5% success" implies an *error budget*: 0.5% of requests are *allowed* to fail. This reframes reliability powerfully: you don't need *perfection* (impossible and absurdly expensive — the last 0.01% costs more than everything before it), you need to *stay within budget*. The error budget becomes a *decision tool*: budget remaining → ship features (you're reliable enough, spend the budget on velocity); budget exhausted → stop shipping, fix reliability (you're breaking your commitment, reliability work now outranks features). This is the SRE (Site Reliability Engineering) insight that turns "how reliable should it be?" from an argument into a *number that drives decisions* — reliability and velocity balanced by budget, not by whoever argues loudest. It's Vol 04 Ch 17's budget-thinking, applied to reliability.

**SLOs for AI systems (what's different).** Beyond uptime/latency, AI systems have *quality* SLOs (Vol 07 Ch 15 — "95% of responses pass the faithfulness eval" — a reliability target on *output quality*, not just availability), *cost* SLOs (Ch 23 — "cost per task under $X"), and *safety* SLOs (Vol 08 — "zero successful exfiltrations" — the zero-exfil gate Vol 08 Ch 17 as an SLO). An agentic system's reliability is multi-dimensional: available *and* fast *and* good *and* affordable *and* safe — and SLOs on each make "is it reliable enough?" a measurable, multi-faceted question rather than a vibe. Defining your agent-lab's SLOs (across these dimensions) is defining what "working well" *means*, numerically.

## Why It Matters
Where this appears in real systems and jobs: Metrics, logs, traces, and Service Level Objectives (SLOs) in production systems.

## Hands-On
Define observability and SLOs for your system (concept node, concrete): (1) Map your three pillars: what metrics (Ch 15), logs (Ch 27), and traces (Vol 07 Ch 13) you have, and the detect→localize→diagnose chain across them. (2) Define your agent-lab's SLOs across the dimensions: availability, latency (p99), quality (Vol 07's evals), cost (Ch 23), and safety (Vol 08) — concrete targets, with the SLI (how you measure each). (3) The error-budget exercise: for one SLO, define the budget and the decision rule (budget remaining → features; exhausted → reliability) — feel reliability-as-budget. The three-pillars map + the multi-dimensional SLOs + the error-budget rule = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three observability pillars and the distinct question each answers.
2. Distinguish SLI, SLO, and SLA — measurement, target, contract.
3. Explain the error budget and how it turns reliability into a decision tool.
4. Why don't you need perfection, and what does the last 0.01% cost?
5. What SLO dimensions are AI-specific, and how do they make "reliable enough" measurable?


---

## Wikilinks
[[monitoring-alerting]]
[[cost-latency-dashboards]]
[[build-tracing-instrumentation]]
[[online-evals]]
[[failure-drills-rollbacks]]

## Status log
- Started: 2026-07-21
- Finished: null
