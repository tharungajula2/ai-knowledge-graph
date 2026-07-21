---
id: build-poller-engine
title: "Build: Async Queue Poller"
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
wikilinks: ["build-proposal-gate", "build-idempotency-audit", "build-async-workers", "realtime-subscriptions", "the-bridge"]
tags: [production]
---

## ELI5
The approvals UI (Ch 10) shows proposals appearing; something on the *backend* has to watch for approved proposals and *execute* them. The node summary: **build a terminal-based and web-based queue poller that fetches pending database tasks, checks status transitions, and triggers executors; verify with mock queues.** A poller is the workhorse that turns a queue of pending work into *done* work — it watches the queue, picks up tasks that are ready, runs them, and updates their status. It's the execution engine behind the gate, and a fundamental production pattern.

## The Real Explanation
**The poller pattern — watch, claim, execute, update.** The loop: (1) *poll* the queue table (Vol 08 Ch 9's proposals) for tasks in a ready state (approved, pending-execution); (2) *claim* a task (mark it in-progress — atomically, so two pollers don't grab the same one, Vol 08 Ch 10's atomicity); (3) *execute* it (run the approved action — call the tool, send the email, idempotently, Vol 08 Ch 10); (4) *update* its status (done, or failed-with-reason); (5) sleep briefly, repeat. This is the "check status transitions and trigger executors" the node names — the poller moves tasks through their lifecycle (pending → approved → executing → done/failed), driving the queue forward. It's the complement to Ch 10's UI: the UI is where humans *decide*, the poller is where the system *acts* on those decisions.

**Polling vs the alternatives (the honest tradeoff).** *Polling* (repeatedly asking "any ready tasks?") is simple, robust, and easy to reason about — but has latency (up to one poll-interval between a task becoming ready and being picked up) and does wasted work (polling an empty queue). *Push/realtime* (Ch 9's Supabase realtime — the DB notifies on change) is lower-latency but more complex and requires the notification channel. *Task queues* (Ch 27's Redis/Celery — purpose-built job queues with push semantics) are the scalable production answer. The poller is the *right first build* — simple, understandable, robust (it recovers naturally: if it crashes, it resumes polling; no task is lost because the queue is the durable source of truth) — and Ch 27 shows the scale-up path. The node's "terminal-based and web-based" means the poller can run as a standalone process (terminal) *and* be triggered/monitored via the web (the cockpit, Ch 11).

**The production concerns.** *Atomic claiming* (Vol 08 Ch 10 — two pollers must not execute the same task; use a database-level claim — `UPDATE ... WHERE status='ready' RETURNING` — so exactly one poller wins the row). *Idempotency* (Vol 08 Ch 10 — if a task is claimed, executed, but the status-update fails, a re-poll must not re-execute — the idempotency key guards this). *Failure handling* (a task's execution fails — retry with backoff, Vol 02 Ch 9? mark failed and alert, Ch 15? — an explicit policy). *Stuck tasks* (a task claimed but never completed because the poller crashed mid-execution — a timeout/reclaim mechanism recovers it). *Poll interval* (too frequent wastes resources, too slow adds latency — tune it). These are the details that separate a poller that works from one that double-executes or loses tasks.

**Verification — mock queues, per the node.** A mock queue with test tasks: assert the poller picks up ready tasks (not pending/done ones), claims atomically (two pollers → each task executed once — the concurrency test), executes and updates status correctly, handles a failing task per policy, and recovers stuck tasks. Test idempotency (a claimed-executed-but-not-updated task doesn't re-execute on re-poll). The atomic-claim-under-concurrency test is the crown (it's Vol 08 Ch 10's race, in the poller).

## Why It Matters
Where this appears in real systems and jobs: Build a terminal-based and web-based queue poller that fetches pending database tasks, checks status transitions, and triggers executors; verify with mock queues.

## Hands-On
Build it (est. half a day): the poll loop (fetch ready tasks) → atomic claiming (DB-level, race-safe) → executor trigger (run the approved action, idempotently) → status transitions (pending → executing → done/failed) → failure + stuck-task handling → terminal process + web-trigger → test with mock queues (pickup, atomic claim under concurrency, execution, failure, recovery, idempotency). This is the execution engine behind THE BRIDGE (Ch 35 — it executes approved node-proposals). Tag `prod-v0.9`. The poller + the atomic-claim-under-concurrency test + the idempotency test = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk the poller pattern's five steps (poll, claim, execute, update, repeat).
2. Compare polling to push/realtime and task queues — why is the poller the right *first* build?
3. Why must claiming be atomic, and what breaks without it?
4. How do idempotency and stuck-task recovery keep the poller correct?
5. What does the atomic-claim-under-concurrency test prove, and which Vol 08 concept is it?


---

## Wikilinks
[[build-proposal-gate]]
[[build-idempotency-audit]]
[[build-async-workers]]
[[realtime-subscriptions]]
[[the-bridge]]

## Status log
- Started: 2026-07-21
- Finished: null
