-- =====================================================================
-- Seed 020: Block 11.1 — Scheduler + Morning Briefing
-- Dictionary Terms + Academy Lesson Row
-- =====================================================================

-- ---------------------------------------------------------------
-- Dictionary Terms
-- ---------------------------------------------------------------
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, first_seen_phase)
VALUES
(
    'Cron',
    'Engineering',
    'A time-based job scheduler in computer operating systems. Used to run scripts or tasks automatically at specific times, dates, or intervals.',
    'Cron is a standard syntax and utility for scheduling recurring tasks. A cron expression consists of 5 or 6 fields representing minute, hour, day of month, month, day of week, and optional year. In VIZIER, recurring tasks are managed inside the application using APScheduler and represented as cron-style triggers.',
    'Like setting an alarm clock to wake you up at 7:30 AM every Monday through Friday.',
    11
),
(
    'Misfire',
    'Engineering',
    'Occurs when a scheduled task fails to run at its designated time because the server was down or busy.',
    'A misfire in a job scheduler happens when a scheduled job cannot be triggered at its target runtime (e.g. due to scheduler downtime, system load, or the host machine being in sleep mode). Schedulers resolve this using misfire policies, such as running the job immediately upon recovery or skipping it.',
    'Like missing an appointment because you overslept. When you wake up, you must decide whether to call and reschedule immediately or just wait for the next scheduled slot.',
    11
),
(
    'Coalescing',
    'Engineering',
    'Combining multiple missed executions of a scheduled task into a single execution when the scheduler recovers from a downtime.',
    'Coalescing is a scheduling configuration that prevents a job from running multiple times back-to-back if the scheduler missed several of its trigger times during a period of downtime. When coalescing is enabled (coalesce=True), the scheduler merges all pending missed runs into a single execution once it comes back online.',
    'If you are subscribed to a daily newspaper but go on vacation for a week, coalescing is like the postman bringing you just one summary paper when you return, instead of dumping 7 individual newspapers on your doorstep.',
    11
),
(
    'Fan-Out/Fan-In',
    'Engineering',
    'Running multiple data-gathering tasks in parallel (fan-out) and then waiting for all of them to finish before combining their results (fan-in).',
    'Fan-out/Fan-in is a parallel execution pattern. Fan-out starts multiple asynchronous tasks concurrently (e.g., fetching weather, scraping RSS feeds, and querying databases in parallel threads). Fan-in waits for all tasks to complete (blocking or joining on futures) and aggregates their outputs into a single consolidated structure.',
    'Like a project manager dividing a report into 4 sections, assigning them to 4 different researchers at the same time (fan-out), and then compiling all 4 sections into a single document once they are all submitted (fan-in).',
    11
),
(
    'Graceful Degradation',
    'Engineering',
    'The ability of a system to keep running even if some of its parts fail. If weather or RSS is down, VIZIER still sends the briefing with warning placeholders.',
    'Graceful degradation is a design principle where a system maintains operational capability, possibly at a reduced quality level, when some of its components fail. In the Morning Briefing pipeline, if the Google Calendar API returns an error, the system catches the exception and renders a warning placeholder in that section of the briefing, allowing the rest of the briefing to build and deliver successfully.',
    'Like driving a car with a broken air conditioner: the car still gets you to your destination safely, even though the ride is less comfortable.',
    11
),
(
    'Proactive Agent',
    'Safety',
    'An agent that takes actions automatically on a schedule or in response to events, rather than waiting for the user to type a prompt.',
    'A proactive agent initiates workflows, queries, or actions autonomously based on scheduled triggers or event listeners, without requiring a direct user prompt. This contrast with reactive agents, which only respond to direct commands. Proactive execution requires strict safety bounds and read-only default configurations for automated outputs.',
    'Like a butler who brings you a cup of coffee and your daily schedule as soon as you wake up, without you having to ring a bell and ask for it.',
    11
)
ON CONFLICT (term) DO NOTHING;

-- ---------------------------------------------------------------
-- Academy Lesson Row
-- ---------------------------------------------------------------
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag)
VALUES (
    11,
    1,
    'Block 11.1 — Scheduler + Morning Briefing (Proactive Agent)',
    E'## What You Built\n\nYou built VIZIER''s proactive execution layer by integrating an application-level scheduler (APScheduler) and building parallel data-gathering pipelines that compile a structured daily Morning Briefing and weekly reviews.\n\n## Key Concepts\n- **Proactive Execution**: Designing systems that initiate actions based on time triggers (cron) rather than user inputs.\n- **Coalescing & Misfire Grace**: Configuring schedulers to handle system downtime (e.g. computer sleep mode) gracefully.\n- **Fan-out/Fan-in**: Running API calls (weather, calendar, RSS, todos) in parallel to minimize latency.\n- **Graceful Degradation**: Wrapping data gatherers in try-except blocks so that partial API outages do not crash the entire run.\n\n## Durable Delivery\nEach briefing is persisted to the database and delivered directly to your phone via Telegram push notifications.\n\n## Interview Line\n*"I built a scheduled proactive agent using APScheduler with coalescing and misfire-grace safety policies. The agent runs parallel fan-out API gatherers that degrade gracefully on individual service failures to compile and deliver a daily markdown morning briefing."*',
    'scheduling, cron, fan-out/fan-in, graceful degradation, proactive agent'
)
ON CONFLICT (phase, order_index) DO NOTHING;
