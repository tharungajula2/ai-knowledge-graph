---
id: build-demo-mode
title: "Build: Credential-Free Demo Mode"
domain: production
ring: 9
cluster: "The Platform"
type: build
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["subgraphs", "build-gateway", "python-craft-professional", "ci-gates-for-ai", "build-command-center"]
tags: [production]
---

## ELI5
You want to show your agent-lab to a recruiter, run it in CI, or let someone try it — *without* handing over your Google tokens, your API keys, or racking up LLM costs. The node summary: **design and build a credential-free mock/simulator mode for the dashboard and backend APIs to run safely without live keys; verify by running local tests.** Demo mode is a fully-functional version of your system that runs on *simulated* data and *mocked* services — no real credentials, no real costs, no real side effects. It's how you demo safely, test comprehensively, and develop without burning money — and it's a mark of a thoughtfully-engineered system.

## The Real Explanation
**Why demo mode is more than a nicety.** It solves several real problems at once: *safe demos* (show the system to anyone — recruiters, the portfolio audience Vol 08 — without exposing your real inbox, real keys, or real data); *credential-free CI* (Vol 07 Ch 9 — your tests and CI pipeline run the *whole* system without needing real API keys in the CI environment, which would be a security risk and a cost — a system that can't be tested without live credentials is hard to test at all); *cost-free development* (iterate on the UI Ch 11, the flows, without every run costing LLM tokens Vol 04 Ch 17); and *reliable demos* (a live demo that depends on real APIs breaks when an API is down or rate-limited Vol 02 Ch 10 — demo mode is deterministic and always works, the difference between a demo that impresses and one that embarrasses you in front of a recruiter). Demo mode is *designed-in testability and demonstrability* — a senior engineering habit.

**The architecture — the seam that makes it possible (Vol 04 Ch 10's clean boundaries, cashing in).** Demo mode works *because* you built clean interfaces: every external dependency (the LLM gateway Vol 02 Ch 11, the Gmail/Calendar readers Ch 8, the OAuth Ch 7, real tools) sits behind an interface, so demo mode *swaps the real implementation for a mock* (dependency injection, Ch 1's `Depends`): the mock gateway returns canned/simulated LLM responses (or a cheap local model), the mock Gmail reader returns fixture emails (including Vol 08's malicious-test email!), the mock tools simulate actions without executing them (a mock `send_email` that logs instead of sends). A single config flag (`DEMO_MODE=true`) flips every dependency to its mock. This is *why* the interface discipline mattered all along — a system with clean seams can run entirely on mocks; a tangled one can't (you can't demo-mode spaghetti). Demo mode is the *reward* for good architecture.

**Designing good mocks (realistic but safe).** The mocks must be *realistic enough to demo well* (canned LLM responses that show the system's real behavior, fixture data that looks real, simulated latency so the streaming Ch 2 still *feels* live) but *completely safe* (no real sends, no real reads, no costs, no credentials). Good mock data tells a *story* (a demo inbox with interesting emails, a demo calendar with a realistic day, agent responses that showcase capability) — the demo should *impress*, which means the mocks are curated, not random. And the mocks double as *test fixtures* (Vol 01 Ch 21, Vol 07 Ch 2 — the same simulated data that demos the system tests it), unifying demo and test.

**Verification — local tests, per the node.** Demo mode runs the *entire* system (backend Ch 1, cockpit Ch 11, agents, gate) with zero real credentials: assert no real API is called (mock the network, confirm no outbound calls to real services), no real costs incur, no real side effects happen (the mock `send_email` didn't send), and yet the *full flow works* (chat, agent execution, proposals, approvals, the cockpit lights up). Run it in CI (Vol 07 Ch 9) — the whole system tested without secrets. The "full system runs credential-free" test is the proof.

## Why It Matters
Where this appears in real systems and jobs: Design and build a credential-free mock/simulator mode for the dashboard and backend APIs to run safely without live keys; verify by running local tests.

## Hands-On
Build it (est. half a day, high-leverage): a `DEMO_MODE` config flag → mock implementations behind every external interface (gateway → canned responses, Gmail/Calendar → fixtures including a malicious-test email, OAuth → bypass, tools → simulated) → curated demo data that tells an impressive story → wire it via dependency injection (Ch 1) → verify the full system runs credential-free (no real calls, no costs, no side effects, full flow works) → run it in CI. This makes RESURRECTION (Ch 34) demoable and the whole system CI-testable. Tag `prod-v0.11`. The demo-mode flag + the credential-free full-system run + the CI integration = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four problems demo mode solves (safe demos, credential-free CI, cost-free dev, reliable demos).
2. Why does demo mode *depend on* clean interfaces — and why can't you demo-mode a tangled system?
3. How does a single config flag swap the whole system to mocks (which pattern)?
4. What makes a good mock — realistic-but-safe, and why should demo data tell a story?
5. How do the mocks double as test fixtures, and what does the credential-free-full-run test prove?


---

# PART III — CLOUD & DEPLOYMENT OPS
*8 chapters. The cloud foundations: accounts and IAM, compute choices, container deployment, Kubernetes, CI/CD, the pipeline build, secrets and cost engineering, and static sites.*

---

## Wikilinks
[[subgraphs]]
[[build-gateway]]
[[python-craft-professional]]
[[ci-gates-for-ai]]
[[build-command-center]]

## Status log
- Started: 2026-07-21
- Finished: null
