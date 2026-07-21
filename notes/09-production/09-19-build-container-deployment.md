---
id: build-container-deployment
title: "Build: Manual Container Deployment"
domain: production
ring: 9
cluster: "Cloud & Deployment Ops"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["docker-for-ai", "deploying-backends", "secrets-cost-engineering", "build-github-actions-pipeline", "cost-latency-budgets"]
tags: [production]
---

## ELI5
Theory becomes real here: you take your containerized backend (Ch 5) and *put it on the internet*. The node summary: **build a Docker image, push it to a registry, and manually deploy it to a serverless container service (e.g., Cloud Run); verify with curl endpoint test.** This is the first time your code runs *in the cloud, reachable by anyone* — a genuine milestone. Doing it *manually* first (before automating it in CI, Ch 22) means you understand every step, so when the pipeline does it for you, it's not magic.

## The Real Explanation
**The deployment pipeline, by hand (understand each step before automating it).** The path from code to live URL:
1. *Build the image* (Ch 5 — `docker build` produces your container image locally).
2. *Push to a registry* — a *container registry* (Docker Hub, GCP Artifact Registry, etc.) is where images live so the cloud can pull them (Vol 01 Ch 19's Git-remote intuition, for images): `docker push` uploads your image to the registry, tagged with a version (Vol 07 Ch 11's versioning — tag images, don't just use `latest`, so you know what's deployed and can roll back Ch 32). The registry is the hand-off point between "built" and "deployable."
3. *Deploy to the service* — point the serverless container service (Cloud Run, Ch 18) at your registry image; it pulls the image and runs it, giving you a public URL. Configure: the container's port (Ch 1's server), environment variables (secrets, Ch 24 — injected at runtime, Ch 5), resource limits (CPU/memory), and scaling (min/max instances, scale-to-zero Ch 6).
4. *It's live* — your backend answers requests at a public HTTPS URL.

**What you learn by doing it manually (the point of the "manual").** Automating deployment (Ch 22's CI/CD) is the goal, but *manual first* teaches what the automation *does*: you feel the build→push→deploy sequence, hit the real errors (the image won't start because a secret's missing — Ch 1's fail-loud config; the port's wrong; the resource limit's too low and it OOMs), and understand the moving parts (registry, image tags, runtime config, scaling settings). When Ch 22's pipeline does this automatically, you'll *understand* it (and debug it when it breaks — Vol 07 Ch 14's trace-reading, for deploys) rather than treating it as an opaque incantation. This is the curriculum's bet again: do it by hand once, own it forever.

**The production configuration that matters.** *Environment variables / secrets* (Ch 24 — your API keys, DB URL, injected at deploy, never in the image Ch 5); *resource allocation* (CPU/memory — too little and it's slow or crashes, too much and it's wasteful, Vol 04 Ch 17 cost); *scaling config* (min instances — 0 for scale-to-zero cheapness Ch 6, or 1+ to avoid cold-start latency; max instances — a cap so a traffic spike or loop Vol 04 Ch 16 doesn't scale you into a huge bill, Ch 17's budget-as-architecture); *health checks* (the service pings your app to know it's alive — Ch 1's `/status`, Ch 15's monitoring foundation); *the request timeout* (Ch 6 — long enough for your agents' multi-second calls). Getting these right is the difference between a deploy that works and one that crashes, costs too much, or times out your agents.

**Verification — curl endpoint test, per the node.** The deployed service works from the public internet: `curl https://your-service-url/status` returns healthy; `curl` your chat/agent endpoint returns a real response (the whole stack, live — your agents answering over the internet). Test the streaming endpoint (Ch 2 — does SSE work through the platform? Ch 6's buffering concern, live). Test that secrets loaded (no missing-config crash). Test scaling (hit it, watch it scale; leave it, watch it scale to zero). The curl-returns-a-real-agent-response from a public URL is the milestone — your system is *live*.

## Why It Matters
Where this appears in real systems and jobs: Build a Docker image, push it to a registry, and manually deploy it to a serverless container service (e.g., Cloud Run); verify with curl endpoint test.

## Hands-On
Deploy for real (est. 1 day, a genuine milestone): build your image (Ch 5) → push to a registry (tagged, versioned) → deploy to Cloud Run (or equivalent, per Ch 6's decision) → configure runtime (secrets Ch 24, resources, scaling with a max cap, health check, timeout) → **curl the live URL** and get a real agent response → test streaming, secrets, and scale-to-zero. Hit and fix the real errors (missing config, wrong port, timeout). This is the dress rehearsal for RESURRECTION (Ch 34). Tag `prod-v0.12`. The live public URL + the curl-response demo + the config-you-had-to-get-right = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk the four deployment steps (build → push → deploy → live), and what the registry is for.
2. Why deploy *manually* first — what does it teach that automation would hide?
3. Why tag images with versions rather than `latest`?
4. Name the production config that matters (secrets, resources, scaling cap, health check, timeout) and what each prevents.
5. Why is a max-instances cap a budget-as-architecture control?


---

## Wikilinks
[[docker-for-ai]]
[[deploying-backends]]
[[secrets-cost-engineering]]
[[build-github-actions-pipeline]]
[[cost-latency-budgets]]

## Status log
- Started: 2026-07-21
- Finished: null
