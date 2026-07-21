## ELI5
Your containerized backend (Ch 5) runs on your laptop — but production means it runs *somewhere always-on, reachable by users*. The node summary: **current hosting options and tradeoffs when I light this node.** Where you deploy is a consequential choice with real tradeoffs — cost, control, complexity, scale — and this chapter gives you the permanent framework for choosing, so whatever platforms exist when you read this, you can evaluate them clearly rather than defaulting to whatever's trendy.

## The Real Explanation
**Axis 1 — The abstraction level (how much infrastructure you manage).** The spectrum from most-managed to most-control: *PaaS / app platforms* (Render, Railway, Fly, and kin — push code/container, they run it, you manage almost nothing — fastest to ship, least control, good for small-to-medium apps and exactly right for shipping fast, which the 45-day mission wants); *serverless containers* (Cloud Run, and kin — Ch 20 — your container runs on-demand, scales to zero, you pay per use — the sweet spot for many API backends: managed but flexible); *VMs* (raw virtual machines — you manage the OS, the runtime, everything — maximum control, maximum ops burden — Ch 19); *managed Kubernetes* (Ch 21 — orchestration for many containers at scale — powerful, complex, for large systems). More management = more control and often lower per-unit cost at scale, but more ops burden and slower shipping. The judgment: *least infrastructure that meets your needs* (the least-X principle, again — least-ops here).

**Axis 2 — Cost model and scale behavior.** *Scale-to-zero* (serverless — pay nothing when idle, pay per request when active — ideal for spiky/low-traffic apps, and for a portfolio project that's mostly idle, near-free); *always-on* (VMs, some PaaS — pay a fixed rate whether used or not — predictable, wasteful at low traffic, economical at steady high traffic); *per-resource* (pay for CPU/memory/bandwidth). The AI-specific wrinkle: your *LLM API costs* (Vol 04 Ch 17) usually dwarf your *hosting* costs (you're calling models, not running them — so hosting can be cheap while the model bill is the real cost — Ch 24's cost engineering). Match the cost model to your traffic shape: scale-to-zero for a portfolio project idle most of the day; always-on when latency-sensitive (scale-to-zero has cold-start latency — the first request after idle is slow).

**Axis 3 — The AI-backend-specific needs.** *Long-running requests* (LLM/agent calls take seconds-to-minutes — Vol 04 Ch 17 — some serverless platforms have request timeouts too short for agents; check the limit — a platform that kills requests at 30s can't host a 2-minute research agent); *streaming support* (Ch 2's SSE — does the platform support long-open streaming connections, or buffer them?); *background work* (Ch 3's scheduler, Ch 27's workers — does it support persistent background processes, or only request/response?); *stateful needs* (your DB, Vol 03/06 — usually a separate managed database service, not the app host); *GPU* (only if self-serving models — rare for you). These needs *disqualify* some platforms — a platform perfect for a normal web app may be wrong for an agent backend with 2-minute streaming requests and background schedulers.

**Axis 4 — Operational maturity (the boring-but-critical).** *Deploys* (how easy — git-push? CI/CD, Ch 22?); *rollbacks* (Ch 32 — can you revert a bad deploy fast?); *logs/monitoring* (Vol 07, Ch 15 — can you see what's happening?); *secrets* (Ch 24 — secure config injection); *custom domains, HTTPS* (table stakes); *vendor lock-in* (how hard to leave — a container is portable, a platform's proprietary features aren't). For shipping fast *and* responsibly (the mission + Vol 08 Ch 18), you want good deploys, easy rollbacks, and real observability — a platform without these is a liability at the first incident.

## Why It Matters
Where this appears in real systems and jobs: current hosting options and tradeoffs when I light this node.

## Hands-On
Run the frontier-scan (Rule 7): (1) Search the *current* backend-hosting landscape — the live PaaS/serverless/VM/k8s options, their pricing, their limits (request timeouts! streaming! background work!) *now*. (2) Build the landscape table with the four axes as columns and the live platforms as rows — abstraction level, cost/scale, AI-backend-fit (the disqualifiers!), operational maturity. (3) The decision: for *your* agent-lab specifically (long requests, streaming, a scheduler, a database, mostly-idle-portfolio-traffic), which platform, and why — and which platforms its needs *disqualify*. Date-stamp it (rots per Rule 7). This decision drives RESURRECTION's deployment (Ch 34).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the abstraction-level spectrum from PaaS to Kubernetes, with the control/ops tradeoff.
2. Why do LLM API costs usually dwarf hosting costs, and how does that shape the hosting-cost decision?
3. Name three AI-backend-specific needs that can *disqualify* a platform.
4. Recite the operational-maturity checklist, and why it matters at the first incident.
5. Why is this a frontier node — what rots, what doesn't?


---

## Wikilinks
[[docker-for-ai]]
[[compute-choices]]
[[build-container-deployment]]
[[cost-latency-budgets]]
[[resurrection]]

## Status log
- Started: 2026-07-21
- Finished: null