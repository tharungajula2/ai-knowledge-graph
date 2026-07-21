---
id: build-migration-runner
title: "Build: Migration Runner & Pool"
domain: production
ring: 9
cluster: "The Backend Craft"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-idempotency-audit", "vector-databases", "git-mastery", "data-versioning-reproducibility", "build-fastapi-backend"]
tags: [production]
---

## ELI5
Your database schema will change — you'll add a table, a column, an index, as your system grows. The node summary: **build a schema migration runner that connects to PostgreSQL, manages transaction safety, runs sequential SQL migrations, and exposes database pooling; verify with a clean database reset.** How do you change a *live* database's structure without losing data or breaking the running app? Migrations. And how do you handle many concurrent database connections efficiently? Pooling. This build is the database-operations foundation everything persistent depends on.

## The Real Explanation
**Migrations — versioned schema change.** Your database has a *schema* (tables, columns, indexes — Vol 03 Ch 4's pgvector schema, Vol 06's memory tables, Vol 08's audit tables — you have many now), and it *evolves*. A **migration** is a versioned, sequential change to the schema — "migration 003 adds the `memories` table," "migration 004 adds an index." The runner applies migrations *in order*, tracks *which have been applied* (a `migrations` table recording version + timestamp), and applies only the *new* ones. This is Git-for-your-schema (Vol 01 Ch 19's versioning intuition, for database structure): your schema's history is a sequence of migrations, reproducible on any database (a fresh dev DB, staging, production — all reach the same schema by running the same migrations in order). Without migrations, schema changes are manual, unversioned, error-prone chaos; with them, schema is code (versioned, reviewed, tested, reproducible).

**Transaction safety — the critical correctness property.** A migration that half-applies (added the table but failed on the index) leaves the database in a *broken, inconsistent* state — catastrophic in production. The fix: run each migration in a **transaction** (Vol 08 Ch 10's atomicity, now for schema) — either the whole migration succeeds and commits, or *any* failure rolls back the entire migration, leaving the schema untouched. All-or-nothing. This is why the runner "manages transaction safety" — a migration is atomic, so a failed migration is a *no-op* you can fix and retry, never a half-broken schema you must manually untangle at 3am. (Caveat: some operations can't run in transactions in all databases — the runner handles those specially.)

**Connection pooling — the efficiency foundation.** Opening a database connection is *expensive* (a network handshake, auth — tens of milliseconds), and a web server handling many requests can't open a fresh connection per request (it would be slow and would exhaust the database's connection limit). A **connection pool** maintains a set of *reusable* open connections: a request *borrows* a connection from the pool, uses it, *returns* it (doesn't close it) — the next request reuses it. The pool bounds the total connections (protecting the database — Vol 02 Ch 10's limits, database side) and eliminates per-request connection overhead (the latency win). Your FastAPI app (Ch 1's lifespan) opens the pool at startup, and every endpoint borrows from it. Pooling is invisible when it works and catastrophic when it's missing (connection exhaustion, the classic production database outage).

**Verification — clean database reset, per the node.** The runner can *reset* a database to a clean state and re-apply all migrations from scratch (proving migrations are complete and ordered — a fresh DB reaches the full current schema). Assert: migrations apply in order; the migrations-tracking table records correctly; re-running is idempotent (already-applied migrations skip — Vol 08 Ch 10's exactly-once, for schema); a *failing* migration rolls back atomically (inject a bad migration, confirm the schema is untouched); and the clean-reset reproduces the exact schema (the reproducibility test — Vol 07 Ch 11). Plus the pool: concurrent requests correctly borrow/return connections without exhaustion.

## Why It Matters
Where this appears in real systems and jobs: Build a schema migration runner that connects to PostgreSQL, manages transaction safety, runs sequential SQL migrations, and exposes database pooling; verify with a clean database reset.

## Hands-On
Build it (est. 1-1.5 days): the migration runner (sequential SQL migrations, a tracking table, apply-only-new logic) → transaction-wrapped application (atomic, rollback on failure) → connection pooling (open at app startup, borrow/return per request) → the clean-reset capability → tests (ordered application, idempotent re-run, atomic rollback on a bad migration, clean-reset reproducibility, concurrent pooling). Wire it to hold your real schemas (pgvector Vol 03, memory Vol 06, audit Vol 08). This is RESURRECTION infrastructure (Ch 34). Tag `prod-v0.3`. The migration runner + the atomic-rollback demo + the clean-reset reproducibility + the pooling test = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is a migration, and why is schema-as-versioned-migrations better than manual changes?
2. Why must migrations be transactional — what's the disaster a half-applied migration causes?
3. Explain connection pooling — what does it eliminate and what does it protect?
4. Why is connection exhaustion a classic production outage, and how does pooling prevent it?
5. What does the clean-reset test prove, and how is it a reproducibility check?


---

## Wikilinks
[[build-idempotency-audit]]
[[vector-databases]]
[[git-mastery]]
[[data-versioning-reproducibility]]
[[build-fastapi-backend]]

## Status log
- Started: 2026-07-21
- Finished: null
