## ELI5
"The cloud" is just someone else's computers, rented — but rented with a whole apparatus of accounts, permissions, regions, and billing that you must understand before you deploy anything. The node summary: **cloud accounts, projects, regions, IAM roles, and setting up budget/billing alerts from day zero.** This chapter is the orientation to cloud infrastructure — the concepts every deployment sits on — with one piece of hard-won wisdom baked into the node itself: *set up billing alerts from day zero*, because the cloud's convenience includes the convenience of a surprise four-figure bill.

## The Real Explanation
**The account hierarchy — accounts, projects, resources.** Cloud providers (AWS, GCP, Azure) organize everything in a hierarchy: an *account/organization* (your top-level identity and billing) contains *projects* (GCP) / *accounts* (AWS) — isolated environments grouping related resources (your agent-lab is a project; a separate project for experiments keeps them isolated) — which contain *resources* (the actual things: databases, servers, storage buckets). Understanding the hierarchy matters for organization (keep prod and dev separate), billing (costs roll up per project — you can see what the agent-lab costs vs experiments), and security (blast radius, Vol 08 Ch 1 — a compromised dev project shouldn't reach prod resources).

**Regions and zones — where your computers physically are.** Cloud resources live in *regions* (geographic locations — us-east, europe-west, asia-south) subdivided into *zones* (isolated data centers within a region). Why it matters: *latency* (Vol 03 Ch 8 — a server near your users is faster; for you in India, an asia-south region cuts latency vs us-east); *data residency* (Vol 08 Ch 18's compliance — some data must stay in certain jurisdictions — GDPR, Indian data-localization); *availability* (spreading across zones survives a single data-center failure, Ch 32); and *cost* (prices vary by region). Choosing a region is a real decision (near your users, compliant with your data rules, reasonably priced).

**IAM — who can do what (Vol 08 Ch 8's least-privilege, as cloud infrastructure).** Identity and Access Management is the cloud's permission system: *identities* (users, service accounts — the non-human identities your app uses) get *roles* (bundles of permissions) scoped to *resources*. This is least-privilege (Vol 08 Ch 8) at cloud scale, and it's *critical*: your app's service account should have *only* the permissions it needs (read this bucket, write this database — not admin-over-everything), so a compromised app (Vol 08's threat model) can't wreck your whole cloud account. The cardinal IAM sins (that cause real breaches): over-permissioned service accounts (admin "to make it work" — Vol 08 Ch 8's over-provisioning, now with cloud-wide blast radius), long-lived credentials (Ch 24 — prefer short-lived, rotated), and root/owner account overuse (use it to set up, then lock it away). IAM done right is Vol 08's least-privilege realized in infrastructure; done wrong, it's the headline breach.

**Billing alerts from day zero — the node's hard-won wisdom (and it's serious).** The cloud bills *by usage*, *automatically*, and a mistake (a runaway agent looping Vol 04 Ch 16, a misconfigured resource, an attack Vol 08, a forgotten expensive service) can generate a *shocking* bill *fast* — the infamous "$5000 overnight from a forgotten GPU / a loop / a leaked key someone mined crypto with." The defense, set up *before you deploy anything*: *budget alerts* (notify me when spend crosses $X — the early warning), *hard budget caps* where available (stop services at a limit — the circuit breaker, Vol 04 Ch 17's budget-as-architecture, at cloud scale), *billing dashboards* (Vol 07 Ch 17 — watch the spend), and *cost anomaly detection* (alert on unusual spikes). This is Vol 04 Ch 17's cost discipline and Ch 24's cost engineering, applied to the cloud bill *from day zero* — because the one time you skip it is the time the loop runs all weekend. The node names "day zero" deliberately: billing alerts are the *first* thing you set up, not the thing you add after the first scary bill.

## Why It Matters
Where this appears in real systems and jobs: Cloud accounts, projects, regions, IAM roles, and setting up budget/billing alerts from day zero.

## Hands-On
Set up cloud foundations (concept node, concrete — do it for real): (1) Set up a cloud account/project for your agent-lab (GCP's free tier is generous, and Cloud Run Ch 20 is a natural fit) → **immediately set budget alerts and a cap** (day zero — before anything else; pick a threshold that would alarm you). (2) Create a least-privilege service account for your app (only the permissions it needs — practice Vol 08 Ch 8 in IAM) rather than using an owner credential. (3) Choose your region deliberately (near you/your users, compliant, priced-well) and write why. The account+budget-alert setup + the least-privilege service account + the region decision = the note; this underpins Ch 20's deployment and Ch 24's cost engineering.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Explain the account → project → resource hierarchy and why it matters for billing and security.
2. Why does region choice matter — name the four factors (latency, residency, availability, cost)?
3. How is IAM the cloud realization of Vol 08's least-privilege, and what are the cardinal IAM sins?
4. Why set billing alerts on *day zero*, and what disaster does skipping them risk?
5. Connect cloud billing caps to Vol 04 Ch 17's budget-as-architecture.


---

## Wikilinks
[[least-privilege-tools]]
[[cost-latency-budgets]]
[[secrets-cost-engineering]]
[[compute-choices]]
[[cost-latency-dashboards]]

## Status log
- Started: 2026-07-21
- Finished: null