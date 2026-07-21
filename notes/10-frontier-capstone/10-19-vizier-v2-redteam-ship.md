---
id: vizier-v2-redteam-ship
title: "Build: v2 Deploy & Ship"
domain: frontier-capstone
ring: 10
cluster: "VIZIER v2 — The Final Masterpiece"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-github-actions-pipeline", "build-container-deployment", "docker-for-ai", "secrets-cost-engineering", "build-migration-runner", "monitoring-alerting", "resurrection", "define-vizier-v2"]
tags: [frontier-capstone]
---

## ELI5
A system that runs only on your laptop is a rehearsal. Today v2 opens: **packaged, containerized, deployed to a serverless container service, with CI/CD that ships every future change automatically** — the Vol 09 production craft, executed end to end on the system you wrote yourself. This is also where M5 completes and where the RESURRECTION spirit (Vol 09's M1 — deploy with my own hands) gets its final echo: your hands, your system, the real world.

## The Real Explanation
**Packaging.** The container: a clean multi-stage Dockerfile (Vol 09's docker-for-ai craft — slim final image, no secrets baked in, ever), settings via validated environment config (Vol 09's backend craft), secrets in the platform's secret manager mounted as env (Vol 09's secrets-engineering build — the runbook rule: nothing sensitive touches the image or the repo). The database story: migrations runner (Vol 09's build) executed against the production Postgres, with the rollback path written down *before* first deploy (Vol 09's failure-drills chapter — you plan the retreat while calm).

**Deployment.** Serverless containers (Cloud Run-style — your Vol 09 compute-choices analysis already made this call for a single-operator system: scale-to-zero ≈ near-zero idle cost, min-instances=0, max-instances low as a **cost cap**, budget alerts configured *first* — the Vol 09 runbook's day-zero discipline). Manual deploy once, by hand, feeling the full path (build → push to registry → deploy → curl the health endpoint) — because "I deployed it myself" must be literally true — then automation takes over.

**CI/CD.** The GitHub Actions pipeline (Vol 09's build, upgraded with Chapter 18's teeth): on PR — lint, typecheck, pytest, **the deterministic eval gate**; on merge to main — build image, push, deploy to the live service. Deployment authenticated via workload identity federation (no long-lived cloud keys in GitHub — Vol 09's secrets discipline applied to the pipeline itself). The acceptance ritual: one full loop, in public — open a small PR, watch checks gate it, merge, watch the deploy land, hit the live URL. Screen-record it; the film needs this thirty seconds more than any other.

**The ship checklist.** Structured JSON logging flowing to the platform's log system (Vol 09's rate-limiting-and-logging build), monitoring/alerting on error rate and cost (Vol 09 — knowing it broke before users do; "users" is you, but the discipline doesn't care), the demo-mode flag (Vol 09's credential-free mode — so the public artifact can be poked safely), and the cost table: projected monthly spend for your traffic, priced honestly, in the README.

## Why It Matters
Where this appears in real systems and jobs: Package, containerize, container-deploy, and establish CI/CD for the entire system (taught by build-github-actions-pipeline & build-container-deployment).

## Hands-On
Ship it (est. 1–2 honest days): Dockerfile + local container run; cloud project with budget alerts *before anything else*; manual deploy by hand + health check; migrations against prod; CI/CD wiring + the public full-loop run (recorded); logging/monitoring/alerts verified by *forcing* one error and watching the alert arrive; the cost table. Then the closing act of the masterpiece: re-run the **entire acceptance suite from your Chapter 14 spec** against the *deployed* system — every criterion, checked against production, results committed as `V2_ACCEPTANCE.md`. When the last box ticks: **M5 is lit.** Tag `v2-1.0`. Write the M5 milestone entry in the note in your own words — the sentence your milestone list promised: *spec'd and built by ME, not by an IDE agent* — now true, now proven, now deployed.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Trace a git push all the way to the live URL, naming every stage and where each was taught.
2. Why budget alerts before deployment, and why min-instances=0? Cite the Vol 09 economics.
3. Where do secrets live at each stage — repo, image, CI, runtime — and where must they never be?
4. What breaks first at 100× your traffic? Answer from the Vol 09 enterprise cluster, honestly.
5. M5's definition, verbatim from your milestone list — and the evidence file that proves each clause.


---

# PART IV — GRADUATION
*5 chapters. The system is built; now the story gets told, filmed, enthroned, examined — and the torch gets carried forward. These nodes look soft after the builds. They are not. Synthesis is where learning becomes permanent, and public proof is where a curriculum becomes a career.*

---

## Wikilinks
[[build-github-actions-pipeline]]
[[build-container-deployment]]
[[docker-for-ai]]
[[secrets-cost-engineering]]
[[build-migration-runner]]
[[monitoring-alerting]]
[[resurrection]]
[[define-vizier-v2]]

## Status log
- Started: 2026-07-21
- Finished: null
