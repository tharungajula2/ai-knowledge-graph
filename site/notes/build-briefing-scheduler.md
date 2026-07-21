## ELI5
Not everything happens in response to a request — some things happen *on a schedule*, in the background, whether anyone's watching or not. The node summary: **build a background cron scheduler that runs periodic briefing builders, aggregating calendars, emails, and notes into structured summaries; verify by triggering manual runs.** This is your agent-lab's morning-briefing engine — the thing that wakes up every morning, gathers your world (calendar, inbox, notes), and produces a summary before you ask. It introduces *scheduled background work*, a whole category of production capability beyond request/response.

## The Real Explanation
**Scheduled work — the category.** Request/response (Ch 1) is *reactive* — something happens because a user asked. Scheduled work is *proactive* — something happens because *time* passed: a nightly report, a periodic sync, a morning briefing. "Cron" (from the classic Unix scheduler) means "run this task on this schedule" (every morning at 6am, every hour, every Monday). Production systems are full of scheduled work, and building a scheduler teaches the pattern: a background process that wakes on a schedule, does work, and sleeps again — independent of any user request.

**The briefing builder — the concrete task.** Every morning (say), aggregate the user's world into a structured summary: *calendar* (today's events — Ch 8's Calendar reader), *emails* (overnight/unread highlights — Ch 8's Gmail reader), *notes* (relevant items from your brain — Vol 03/06's retrieval), synthesized by an LLM (your agents, Vol 04) into a briefing. It's a mini-agent pipeline (gather → synthesize → deliver) on a schedule — and it's genuinely useful (a real morning-briefing feature, the kind that makes a product feel alive). The aggregation touches multiple data sources (Ch 7-8's OAuth and readers), the synthesis uses your agent stack, and the delivery pushes to the user (Ch 13's Telegram/webhooks, or the dashboard Ch 11).

**The scheduling mechanisms (the how).** *Simple*: a loop with `sleep` (crude, fragile — dies if the process dies). *APScheduler* (a Python scheduling library — cron-like schedules in-process, persistence options — good for a single service). *System cron / cloud scheduler* (the OS or cloud triggers your endpoint on a schedule — robust, decoupled from your app's lifetime — Cloud Scheduler, GitHub Actions cron, etc.). *Task queue with scheduled tasks* (Celery beat — Ch 27's workers, with scheduling — the scalable production choice). The tradeoffs: in-process is simple but tied to your app's uptime; external schedulers are robust but add infrastructure. For the agent-lab, an in-process scheduler (APScheduler) or a cloud scheduler hitting an endpoint both work; the build teaches the pattern regardless.

**The production concerns (scheduled work has its own failure modes).** *Idempotency* (Vol 08 Ch 10 — if the briefing job runs twice, does it send two briefings? Make it exactly-once, or safe-to-repeat). *Failure handling* (the 6am job fails — does it retry? alert? silently skip? — Ch 15's monitoring; a scheduled job that fails silently is worse than no job, because you *rely* on it). *Missed runs* (the server was down at 6am — does the job run late when it recovers, or skip? — a real design decision). *Observability* (Vol 07 — you need to *know* the job ran, succeeded, and what it produced — scheduled work is invisible unless you instrument it). *Manual triggering* (the node's verification — a way to run the job on-demand for testing and recovery, decoupled from the schedule).

**Verification — manual runs, per the node.** A manual-trigger endpoint/command that runs the briefing builder on-demand (so you can test without waiting for 6am). Assert: the aggregation gathers from all sources (mock them — Ch 16's demo mode), the synthesis produces a valid structured briefing, the delivery works, idempotency holds (run twice, verify safe), and failures are handled (mock a source failure, confirm graceful degradation — a briefing with "calendar unavailable" beats no briefing).

## Why It Matters
Where this appears in real systems and jobs: Build a background cron scheduler that runs periodic briefing builders, aggregating calendars, emails, and notes into structured summaries; verify by triggering manual runs.

## Hands-On
Build it (est. 1-1.5 days): the briefing builder (aggregate mock calendar/email/notes → LLM synthesis → structured briefing) → the scheduler (APScheduler or a cloud-scheduler-hit endpoint) → manual-trigger endpoint → idempotency (Vol 08 Ch 10) → failure handling (graceful degradation per source) → observability (log every run: started, succeeded, produced) → test via manual runs (all sources, one-source-failure, double-run). This is a RESURRECTION subsystem (Ch 34). Tag `prod-v0.2`. The briefing builder + the manual-run demo + the graceful-degradation test = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish reactive (request/response) from proactive (scheduled) work — why do production systems need both?
2. Recite the scheduling mechanisms and their tradeoffs (in-process vs external).
3. Why is idempotency critical for scheduled jobs, and what's the double-briefing risk?
4. Why is a silently-failing scheduled job *worse* than no job?
5. Why is a manual-trigger essential, and what does it enable beyond testing?


---

## Wikilinks
[[build-idempotency-audit]]
[[gmail-calendar-read]]
[[build-async-workers]]
[[monitoring-alerting]]
[[build-research-agent]]

## Status log
- Started: 2026-07-21
- Finished: null