---
id: cicd-fundamentals
title: "CI/CD Pipeline Fundamentals"
domain: production
ring: 9
cluster: "Cloud & Deployment Ops"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["ci-gates-for-ai", "build-injection-suite", "git-mastery", "build-github-actions-pipeline", "python-craft-professional"]
tags: [production]
---

## ELI5
You've deployed manually (Ch 19); doing that by hand every time is slow and error-prone. The node summary: **pipeline execution, runner containers, trigger events, and automated stage routing.** CI/CD automates the path from "I pushed code" to "it's tested, built, and deployed" — so shipping becomes a `git push` instead of a manual ritual, and every change is *automatically* verified before it goes live. You met CI for evals (Vol 07 Ch 9) and security (Vol 08 Ch 17); this chapter is the general model those were instances of.

## The Real Explanation
**CI and CD — the two halves.** *Continuous Integration (CI)*: every code change is automatically *integrated and verified* — on each push, run the tests (Vol 01 Ch 21), lint the code, run the evals (Vol 07 Ch 9), run the security suite (Vol 08 Ch 17) — so problems are caught *immediately*, at the change that caused them, not weeks later (the fast-feedback that makes a codebase maintainable). *Continuous Delivery/Deployment (CD)*: every change that passes CI is automatically *delivered* toward production — built into an image (Ch 5), pushed to a registry (Ch 19), deployed to staging (Ch 22) and (with Continuous Deployment) to production. Together: push code → automatically tested, built, and deployed. Shipping becomes safe, fast, and boring (boring is good — Vol 08's "quality is pipeline," realized).

**The pipeline anatomy (the node's terms).** *Trigger events* — what starts the pipeline (a push to a branch, a pull request, a tag, a schedule Ch 3 — the pipeline runs *in response* to these). *Stages* — the sequential (or parallel) steps (lint → test → build → deploy — Ch 22's concrete pipeline), each gating the next (Vol 07 Ch 9's gates — a failed test stage stops the pipeline before deploy, so broken code can't ship). *Runner containers* — the pipeline runs in *fresh, isolated containers* (Ch 5 — each run starts clean, so the pipeline is reproducible Vol 07 Ch 11 and can't be corrupted by prior runs; the runner is a disposable environment that does the work). *Automated stage routing* — the logic deciding which stages run when (deploy to staging on the main branch, to production only on a tag; run the full eval suite on PRs, fast checks on every push — Vol 07 Ch 9's tiering).

**Why CI/CD is a force multiplier (and a senior signal).** It transforms shipping: *speed* (push and it ships — no manual ritual, faster iteration for the 45-day mission); *safety* (Vol 07/08's gates enforced automatically — broken, unmeasured, or insecure code *can't* merge/ship, structurally); *consistency* (the pipeline does it the same way every time — no "I forgot to run the tests" or "I deployed the wrong image" human error); *reproducibility* (Vol 07 Ch 11 — clean runners, versioned images, traceable deploys). A project with real CI/CD signals engineering maturity (it's how professional teams ship); building it for your agent-lab shows you work the way serious teams do. It's the automation that makes "measure, don't believe" (Vol 07) and "security is pipeline" (Vol 08) *actually happen on every change* rather than when-you-remember.

**The AI-specific pipeline stages (what's different).** Beyond lint/test/build/deploy, an AI system's pipeline adds: *eval gates* (Vol 07 Ch 9 — golden-set scores must pass), *security gates* (Vol 08 Ch 17 — the injection suite, the zero-exfil gate), *cost checks* (Ch 24 — flag a change that spikes cost), and *the demo-mode tests* (Ch 16 — the credential-free full-system test runs in CI). The pipeline for an agent-lab enforces not just "does the code work?" but "is it still good (evals), safe (security), and affordable (cost)?" — the whole curriculum's disciplines, automated into the ship path.

## Why It Matters
Where this appears in real systems and jobs: Pipeline execution, runner containers, trigger events, and automated stage routing.

## Hands-On
Understand the pipeline model (concept node, concrete — Ch 22 builds it): (1) Design your agent-lab's full pipeline: the trigger events, the stages (lint → test → eval Vol 07 → security Vol 08 → build → deploy-staging), the gating (what stops the pipeline), and the routing (staging vs prod, PR vs push). (2) Map your existing disciplines into stages: where do your pytest (Vol 01 Ch 21), evals (Vol 07 Ch 9), security suite (Vol 08 Ch 17), and demo-mode tests (Ch 16) fit? (3) Articulate the force-multiplier: what does CI/CD give your specific workflow (speed, safety, consistency, reproducibility) — concretely. The pipeline design + the disciplines-to-stages mapping + the force-multiplier articulation = the note; Ch 22 builds this for real.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish CI from CD — what does each automate, and what's the combined payoff?
2. Define the pipeline anatomy: trigger events, stages, runner containers, stage routing.
3. Why do runner containers start fresh, and how does that give reproducibility?
4. Why is CI/CD a force multiplier and a senior signal — the four benefits?
5. What AI-specific stages does an agent-lab's pipeline add beyond lint/test/build/deploy?


---

## Wikilinks
[[ci-gates-for-ai]]
[[build-injection-suite]]
[[git-mastery]]
[[build-github-actions-pipeline]]
[[python-craft-professional]]

## Status log
- Started: 2026-07-21
- Finished: null
