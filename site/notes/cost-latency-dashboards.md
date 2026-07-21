## ELI5
You've tracked cost and latency in ledgers since Vol 04 — but numbers in a log file don't drive decisions; *dashboards* do. The node summary: **see the money and the milliseconds.** This build turns your scattered cost/latency data into live, visual dashboards that surface where the money goes and where the time goes — making the invisible economics of your AI systems *visible and actionable*. It's the operational complement to quality evals: quality dashboards tell you if it's *good*, cost/latency dashboards tell you if it's *affordable and fast*, and production needs both.

## The Real Explanation
**What to dashboard — the operational metrics (your ledger and traces, visualized).** From your traces (Ch 13) and ledger (Vol 04 Ch 17), aggregate and visualize: *cost* — total spend over time, cost per request/task/user, cost broken down by model / agent / step (which span dominates the bill — Ch 14's cost-culprit, dashboarded), cache-hit rate and savings (Vol 02 Ch 10, Vol 03 Ch 20); *latency* — p50/p95/p99 over time (Vol 03 Ch 8's percentiles — never the mean, Ch 8 taught you why: p99 is what your worst-hit users feel), latency by step/tool (which span is slow — Ch 14's latency-culprit), time-to-first-token for streaming (Vol 02 Ch 8); *throughput* — requests over time, concurrency; *reliability* — error rates, retry rates (Vol 02 Ch 9), fallback frequency (Vol 02 Ch 11's gateway — how often is the primary failing?). These are the vital signs of a production AI system, and a dashboard makes their trends and spikes *obvious* at a glance.

**Why dashboards over logs — the actionability argument.** A ledger records; a dashboard *reveals*. Trends (cost creeping up week over week — before it's a crisis), spikes (a latency spike at 2pm — correlate with a traffic pattern), distributions (p99 latency is 10× p50 — a tail problem hiding behind a fine average), and breakdowns (80% of cost is one agent's synthesis step — the optimization target, obvious) all *jump out* of a good dashboard and *hide* in a log. Dashboards turn data into decisions: "our cost per task doubled this month" (dashboard-obvious) drives investigation; the same fact buried in a ledger goes unnoticed until the bill arrives. This is the operational-awareness that Vol 04 Ch 17's budget-as-product-design needs to *act on* — you can't manage what you can't see.

**The build — from traces to dashboards.** Options (scan on build day): tracing tools (Langfuse, Ch 13) often *include* dashboards (cost/latency views over your traces — the easiest path, and your Ch 13 instrumentation already feeds them); or a metrics stack (Prometheus + Grafana — the classic ops tooling, more setup, more control); or a simple custom dashboard (your ledger → a Streamlit/Plotly app — Vol 01's data-viz, full control, good for learning). The build: aggregate your trace/ledger data → compute the metrics (percentiles! — the p95/p99 that means production) → visualize over time with breakdowns → and crucially, *make it live* (updating as new runs happen) so it's an operational instrument, not a one-time report. Add *alerting thresholds* (cost-per-day above X, p99 above Y → flag — the proactive version, connecting to Ch 15's drift alerts).

**Verification.** The dashboard shows real data from real runs: cost and latency percentiles compute correctly (reconcile against your ledger — Vol 04 Ch 17, and your Ch 13 traces — three sources agreeing); breakdowns correctly attribute cost/latency to the right agent/step; the p95/p99 are actually tail percentiles (not means mislabeled — the classic dashboard lie); trends update as you generate new runs. Then the payoff: use the dashboard to *find* an optimization — the dashboard should make one cost or latency culprit *obvious* (the dominant span, the slow tool), which you then optimize (route it cheaper, cache it, parallelize it — Vol 04 Ch 17's levers) and *watch the dashboard confirm the improvement*. That closed loop — see, optimize, verify-on-dashboard — is the build's soul.

## Why It Matters
Where this appears in real systems and jobs: see the money and the milliseconds.

## Hands-On
Build it (est. 1 day): choose the approach (Langfuse dashboards if you set it up in Ch 13, or custom Streamlit/Plotly over your ledger) → aggregate cost/latency/throughput/reliability metrics with correct percentiles → visualize over time with model/agent/step breakdowns → make it live → add one alerting threshold. Then the optimization loop: find the dominant cost or latency culprit on the dashboard → apply a Vol 04 Ch 17 lever → verify the improvement *on the dashboard*. Tag `observability-v0.2`. The dashboard screenshots + the culprit-found-and-fixed loop + the ledger/trace reconciliation = the note; this is the operational half of the ring, and a strong portfolio piece (cost-awareness is a rare, senior signal).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What metrics belong on cost and latency dashboards, and why p95/p99 over the mean?
2. Make the dashboards-over-logs argument — what four things "jump out" of a dashboard?
3. Where does the dashboard's data come from, and how do you verify the numbers?
4. Describe the see-optimize-verify loop, with a Vol 04 Ch 17 lever.
5. Why is a live cost dashboard a senior signal, and what decision does it enable that a ledger doesn't?


---

# PART IV — THE HARNESS
*5 chapters. It all unifies: one eval harness around the node-proposer, the failure→golden flywheel, error-analysis practice, eval-driven development internalized, and the ring's close.*

---

## Wikilinks
[[cost-latency-budgets]]
[[build-tracing-instrumentation]]
[[build-gateway]]
[[rate-limits-caching]]
[[reading-traces]]

## Status log
- Started: 2026-07-21
- Finished: null