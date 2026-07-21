## ELI5
The node summary is the whole point in one line: **knowing it broke before users do.** Monitoring is the continuous watching of your production system's health; alerting is being *told* the moment something goes wrong. The nightmare of production isn't that things break — things always break — it's finding out from an angry user (or worse, not finding out) instead of from your own systems. This chapter is how you *know*, fast, so you can fix it before it becomes an incident.

## The Real Explanation
**Monitoring vs the observability you built (Vol 07, now operational).** Vol 07's tracing/dashboards let you *investigate* (see inside a run, debug a failure); monitoring is the *continuous, automated watching* that tells you *when to investigate*. They're complementary: monitoring detects "something's wrong" (a spike in errors, latency, cost), and observability (Vol 07's traces, Ch 11's cockpit) lets you *diagnose* it. Monitoring answers "is it healthy *right now*?"; observability answers "*why* is it unhealthy?"

**The golden signals (what to monitor — the industry-standard four, plus AI's fifth).** *Latency* (Vol 03 Ch 8, Vol 07 Ch 17 — p50/p95/p99 response times; a latency spike means trouble). *Traffic* (request rate — a drop means something's broken upstream, a spike means load, Ch 28). *Errors* (error rate — the most direct "something's wrong" signal; a rising error rate is the alarm). *Saturation* (resource utilization — CPU, memory, DB connections Ch 4, near limits means imminent failure). And AI's fifth: *cost* (Vol 04 Ch 17, Ch 24 — a cost spike, from a loop Vol 04 Ch 16 or an attack Vol 08, needs immediate attention — the runaway-agent-bill alarm; and *quality*, Vol 07 Ch 15's online evals — a drop in output quality, caught by continuous eval). These signals, watched continuously, catch most production problems early.

**Alerting — from signal to notification (and the discipline of good alerts).** An alert fires when a signal crosses a threshold (error rate > 5%, p99 latency > 10s, cost/hour > $X, Vol 07 Ch 9's threshold-setting) and *notifies* you (Ch 14's Telegram, email, PagerDuty). The discipline that separates useful alerting from noise: *alert on symptoms users feel* (high error rate, slow responses — not every internal blip); *actionable alerts only* (an alert you can't act on is noise that trains you to ignore alerts — the alert-fatigue that gets real incidents missed, Vol 04 Ch 7's fatigue lesson, at the ops layer); *severity tiers* (page-me-now for user-facing outages, notify-me-soon for degradations, log-it for informational — Vol 07 Ch 9's hard/soft/info gates, for alerts); and *runbooks* (each alert links to "here's what this means and how to fix it" — so a 3am alert is actionable, not a panic). Good alerting is *high signal, low noise* — you're notified of what matters, when it matters, with what to do.

**The AI-specific monitoring (what's different about watching agents).** Beyond the golden signals: *agent-specific health* (are agents completing tasks or derailing, Vol 04 Ch 16? — trajectory monitoring, Vol 07 Ch 5, online); *cost-per-task drift* (Vol 04 Ch 17 — creeping up means inefficiency or attack); *quality drift* (Vol 07 Ch 15's online evals — the model provider updated, Vol 07 Ch 4, and quality shifted); *safety signals* (Vol 08 — a spike in guardrail-blocks or injection-detections means you're under attack, Vol 08 Ch 15); *gate metrics* (Vol 08 Ch 9 — proposal volume, approval latency, edit-rate). Monitoring an agentic system means watching not just "is the server up?" but "are the agents behaving, affordable, safe, and good?" — the whole curriculum's concerns, watched live.

## Why It Matters
Where this appears in real systems and jobs: knowing it broke before users do.

## Hands-On
Design monitoring for your system (concept node, concrete): (1) Define the golden signals + AI signals for your agent-lab: what latency/traffic/error/saturation/cost/quality metrics, from where (your Vol 07 traces, Ch 11 cockpit, Ch 24 cost tracking). (2) Design the alerts: for each signal, the threshold, the severity tier, the notification path (Ch 14's Telegram), and a one-line runbook. Prioritize *actionable* and *user-felt* — resist alerting on everything. (3) Wire one real alert end-to-end: pick a signal (cost/hour, or error rate), set a threshold, and trigger a Telegram alert when crossed (test by forcing the condition). The signal design + the alert-with-runbook design + the one working alert = the note; this is Ch 34's RESURRECTION operability.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish monitoring from the observability you built — detection vs diagnosis.
2. Recite the golden signals plus AI's additions (cost, quality), and what each catches.
3. What separates good alerting from noise — the four disciplines?
4. Why is alert-fatigue dangerous, and how do severity tiers and runbooks fight it?
5. What's AI-specific about monitoring an agentic system — beyond "is the server up?"


---

## Wikilinks
[[observability-slos]]
[[cost-latency-dashboards]]
[[online-evals]]
[[webhooks-telegram]]
[[failure-drills-rollbacks]]

## Status log
- Started: 2026-07-21
- Finished: null