## ELI5
An agent task takes 45 seconds; a user's HTTP request can't wait that long (it'll time out, Ch 6). The node summary: **build a background task worker loop using Redis/Celery to run long-running agent execution tasks asynchronously; verify with mock task status polling.** Background workers decouple *slow work* from *fast responses*: the API accepts the task instantly (returns "started"), a worker runs it in the background, and the user checks status or gets notified (Ch 14) when it's done. This is how production runs long agent jobs without blocking anyone — the scale-up of Ch 13's poller.

## The Real Explanation
**The problem — long work vs fast responses.** HTTP requests should be fast (seconds — Ch 6's timeouts, users' patience). But agent tasks are *slow* (multi-step research, Vol 04 — tens of seconds to minutes) and *variable*. You can't run a 2-minute agent inside a request (it times out, ties up the server, and the user stares at a spinner). The solution: *accept the task fast, run it slow in the background*. The API endpoint (Ch 1) *enqueues* the task and immediately returns a task ID; a *worker* (a separate process) picks up the task, runs it, and stores the result; the user *polls* the task status (or gets notified, Ch 14) and retrieves the result when ready. Fast API, slow work, decoupled.

**The architecture — queue + workers (Ch 13's poller, scaled up).** *A task queue* (Redis, or a managed queue) holds pending tasks — durable (tasks survive crashes), ordered, and shared between the API (which enqueues) and workers (which dequeue). *Workers* (Celery, or a custom loop — Ch 13's poller, productionized) are processes that *consume* the queue: pull a task, execute it (run the agent), store the result, repeat. *Scaling* is beautiful here: more load → run more workers (they share the queue, each pulling tasks — horizontal scaling, Ch 28), and workers are independent (one crashing doesn't stop others — resilience). Celery is the standard Python task-queue framework (workers, retries, scheduling — Ch 3's cron, unified; result storage); Redis is the common queue/result backend. The pattern — a durable queue feeding a pool of workers — is fundamental production architecture.

**Why this is the right architecture for agents specifically.** Agents are *exactly* the slow, variable, failure-prone work background processing is built for: *duration* (agents take real time — background is mandatory); *retries* (Vol 02 Ch 9 — a failed agent task retries via the queue, idempotently Vol 08 Ch 10); *scaling* (agent load spikes — add workers); *isolation* (a runaway agent Vol 04 Ch 16 is contained to its worker, not blocking the API — Vol 08 Ch 14's blast radius); *long-running progress* (stream progress updates as the worker runs — Ch 2/10's realtime, from the worker). Your research agent, your node-proposer (Vol 04 Ch 18), your briefing builder (Ch 3) — all belong in workers, not in request handlers. This build is where your agents get a *proper* execution home.

**The production concerns.** *Task status tracking* (the node's "task status polling" — pending → running → done/failed, stored so the user/UI can check — Ch 10's realtime shows it live). *Idempotency* (Vol 08 Ch 10 — a retried task doesn't double-execute). *Result storage* (where the agent's output goes, retrievable by task ID). *Failure handling* (retry with backoff Vol 02 Ch 9, or fail-and-notify Ch 14). *Worker health* (Ch 15 — dead workers detected, stuck tasks reclaimed Ch 13). *Concurrency limits* (Ch 28 — bound the workers so they don't overwhelm the LLM API rate limits Vol 02 Ch 10 or your budget Ch 23).

**Verification — mock task status polling, per the node.** Enqueue a mock long task, and: the API returns a task ID instantly (doesn't block); a worker picks it up and runs it; status transitions correctly (pending → running → done); the result is retrievable by ID; polling shows progress; a failing task retries or fails-gracefully per policy; idempotency holds (retried task, single execution). The API-returns-instantly-while-worker-runs-in-background is the core proof.

## Why It Matters
Where this appears in real systems and jobs: Build a background task worker loop using Redis/Celery to run long-running agent execution tasks asynchronously; verify with mock task status polling.

## Hands-On
Build it (est. 1-1.5 days): set up Redis + Celery (or a custom worker loop, Ch 13 productionized) → an API endpoint that enqueues a task and returns an ID instantly (Ch 1) → workers that consume the queue, run agent tasks, store results → status tracking (pending/running/done/failed) → idempotency (Vol 08 Ch 10), retries (Vol 02 Ch 9), result storage → concurrency limits (Ch 23/28) → verify with mock task polling (instant-enqueue, background-execution, status-transitions, retrieval, retry, idempotency). Move your real agents (research, node-proposer, briefing) into workers. This is RESURRECTION's execution engine (Ch 34). Tag `prod-v0.15`. The queue+workers + the instant-enqueue-background-run demo + the status-polling test = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why can't long agent tasks run inside HTTP requests, and what's the decouple-fast-from-slow solution?
2. Describe the queue + workers architecture and how it scales (more load → more workers).
3. Why are agents *exactly* the workload background processing is built for — name four reasons.
4. Recite the production concerns (status, idempotency, results, failures, health, concurrency limits).
5. What does the instant-enqueue-while-worker-runs test prove?


---

## Wikilinks
[[build-poller-engine]]
[[build-research-agent]]
[[build-idempotency-audit]]
[[errors-retries-backoff]]
[[rate-limiting-logs]]

## Status log
- Started: 2026-07-21
- Finished: null