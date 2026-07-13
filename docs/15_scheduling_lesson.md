# Block 11.1 — Durable Execution & Schedulers

## 1. Scheduling Strategies in Production

When scheduling background jobs or proactive workflows in production, engineers choose between different architectures depending on scale, reliability, and hosting constraints.

| Strategy | Pros | Cons | Best Use Case |
| :--- | :--- | :--- | :--- |
| **In-Process Scheduler** (e.g. APScheduler, Celery Beat) | Simple to implement, shares app code/memory, fine for single instances. | Fails if app crashes, does not scale horizontally (causes duplicate runs on multiple pods). | Single-user systems, developer tools, low-criticality notifications. |
| **Database-Level Cron** (e.g. `pg_cron` in Supabase/Postgres) | Highly reliable, close to data, lives within Postgres cluster. | Hard to run external API calls directly, couples logic to database level. | SQL cleanups, data archiving, database-internal triggers. |
| **Serverless / Managed Cron** (e.g. GitHub Actions, Cloud Scheduler) | Extremely robust, handles automatic retries, scales to zero. | Higher latency, setup overhead, requires public endpoints or secure runners. | Enterprise microservices, fleet operations, critical pipelines. |

---

## 2. In-Process Scheduling with APScheduler
VIZIER uses **APScheduler** (`AsyncIOScheduler`) running inside the FastAPI lifespan thread. Because VIZIER is designed as a personal, single-tenant assistant, this is highly efficient.

To make the scheduling robust, we configure:

### A. Coalescing (`coalesce=True`)
If the scheduler misses multiple run times (e.g., the laptop is put to sleep for 3 days), when it wakes up, it "coalesces" (merges) all the missed executions into **a single run**. This prevents the system from bombarding the APIs (and your phone) with 3 days' worth of back-to-back notifications.

### B. Misfire Grace Time (`misfire_grace_time=3600`)
Determines how long after the scheduled time a job is allowed to run if it was delayed. We configure a **1-hour grace window** so that if the host machine wakes up from sleep at 08:00 AM, the 07:30 AM morning briefing is still built and sent immediately rather than being skipped.

---

## 3. Parallel Gathering (Fan-Out / Fan-In)
To generate the Morning Briefing, VIZIER needs to fetch data from 6 separate APIs and database sources. If done sequentially, the latency of each HTTP request would stack up, taking 10-15 seconds.

Instead, we use **Fan-Out / Fan-In** via Python's `asyncio.gather`:

```
                           +---> Fetch Weather API (HTTP)
                           |
       [START JOB] ------->+---> Fetch RSS Headlines (HTTP) ------> [AGGREGATE & LLM]
         (Fan-Out)         |
                           +---> Query Todos (Database)             (Fan-In)
```

By fanning out, all network requests occur concurrently, reducing the total duration of the gathering phase to the speed of the slowest single request.

---

## 4. Graceful Degradation
Scheduled jobs must be resilient to partial failures. If a third-party RSS feed is down or your Gmail OAuth credentials expire, the morning briefing should **still compile** using whatever data is available.

We wrap every individual gatherer in `try-except` blocks. If one source fails:
1. The error is caught.
2. A warning string (`"⚠️ Gmail retrieval failed"`) is returned instead of raising an exception.
3. The LLM still receives the other raw inputs and builds the rest of the briefing successfully.

---

## Key Terms Learned
- **APScheduler**: Advanced Python Scheduler, a library that schedules job execution within Python apps.
- **Misfire Grace Time**: Maximum allowed delay (in seconds) for a scheduled job trigger.
- **Coalescing**: Merging multiple missed execution triggers into one single run.
- **pg_cron**: PostgreSQL extension that allows database-level cron job scheduling.
- **Fan-Out/Fan-In**: Concurrent execution of independent tasks (fan-out) followed by joining and aggregation of results (fan-in).
