## ELI5
Your cockpit (Ch 11) has a frontend — HTML, JavaScript, CSS, images — that needs to reach users fast, everywhere. The node summary: **object storage buckets, CDN caching behavior, and edge routing for high-performance static sites.** Static content (files that don't change per-request) is served completely differently from your dynamic API (Ch 1) — from storage buckets, cached at the edge, near the user — and understanding this makes your frontend fast and cheap. It's the delivery layer for the visible half of your product.

## The Real Explanation
**Static vs dynamic content — two different delivery problems.** *Dynamic content* (your API, Ch 1 — computed per request: agent responses, live data) must run on a server that executes logic. *Static content* (your frontend's HTML/JS/CSS, images, the Next.js Ch 11 build's compiled assets — the *same* files for every user) doesn't need computation — it just needs to be *delivered*, fast. Serving static files from your application server is wasteful (it ties up your backend serving unchanging files) and slow (one server, far from most users). The right way: serve static content from *object storage + a CDN*, freeing your backend to do only the dynamic work it must.

**Object storage — where static files live.** Object storage (S3, GCS buckets, Vol 03/06's storage cousin) stores files cheaply and durably, served over HTTP. Your frontend's built assets (Ch 11's Next.js output) get uploaded to a bucket, which serves them directly — no application server involved. Cheap (storage is pennies), durable (replicated), and scalable (the bucket handles any traffic). This is where the static half of your product *lives*.

**CDN — delivery from the edge (the performance multiplier).** A Content Delivery Network (Ch 12's third caching layer) is a global network of *edge servers* that *cache* your static content near users: a user in Mumbai gets your assets from a Mumbai edge server (milliseconds) instead of a us-east bucket (hundreds of milliseconds across the world). The CDN *caches* the content at the edge (Ch 12's caching, geographically distributed), so most requests never touch your origin (the bucket) — fast for users, cheap for you (the origin serves each file once per edge, then the edge serves everyone). *Edge routing* (the node's term) directs each user to their nearest edge. For a global audience (or a portfolio piece viewed from anywhere), a CDN is the difference between fast-everywhere and slow-far-away.

**CDN caching behavior — the details that matter.** *Cache-control headers* (how long the edge caches a file — Ch 12's TTL, for static assets: cache images forever, HTML briefly). *Cache invalidation* (Ch 12's hard problem — when you deploy a new frontend Ch 22, the edges still cache the old version; the fix is *cache-busting* — versioned filenames like `app.a3f8.js` so a new deploy has new filenames the edge hasn't cached, or explicit invalidation). *Origin shielding* (the CDN protects your origin from traffic). Getting caching right means fast delivery *and* users seeing your latest deploy (not a stale cached version — the "I deployed but users see the old site" bug, solved by cache-busting).

## Why It Matters
Where this appears in real systems and jobs: Object storage buckets, CDN caching behavior, and edge routing for high-performance static sites.

## Hands-On
Understand and apply static delivery (concept node, concrete): (1) For your cockpit (Ch 11), design the static-delivery architecture: which assets go to object storage, how the CDN caches them, and the cache-busting strategy for deploys (so a new deploy Ch 22 isn't hidden by stale edge caches). (2) The dynamic/static split: draw your whole system, marking what's served dynamically (API, Ch 1) vs statically (frontend assets) — and why each is served its way. (3) If practical, deploy your frontend's static assets to a bucket + CDN and measure the latency improvement (edge vs origin). The delivery architecture + the dynamic/static split + the cache-busting strategy = the note; this completes the delivery picture for RESURRECTION (Ch 34).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish static from dynamic content and why each needs different delivery.
2. What is object storage, and why serve static assets from a bucket not your app server?
3. How does a CDN make content fast globally — edge caching and edge routing?
4. Explain cache-busting and the "I deployed but users see the old site" bug it solves.
5. Why does serving static content from a CDN free and protect your backend?


---

# PART IV — ENTERPRISE ARCHITECTURE & SCALE
*10 chapters. Building for many users, real load, and real reliability: multi-tenancy, async workers, rate limiting & logging, SLOs, auth, load testing, deep caching, failure drills, and compliance.*

---

## Wikilinks
[[caching-layers]]
[[build-command-center]]
[[deploying-backends]]
[[caching-layer-depth]]
[[cloud-fundamentals]]

## Status log
- Started: 2026-07-21
- Finished: null