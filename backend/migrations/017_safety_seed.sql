-- =====================================================================
-- Seed 017: Block 10.1 — Approval Inbox + permission tiers + audit log
-- Dictionary Terms + Academy Lesson Row
-- =====================================================================

-- ---------------------------------------------------------------
-- Dictionary Terms
-- ---------------------------------------------------------------
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, first_seen_phase)
VALUES
(
    'Human-in-the-Loop',
    'Safety',
    'A safety design where a human must review and approve a decision made by an AI agent before any real-world action takes place. Prevents the AI from taking actions autonomously.',
    'Human-in-the-Loop (HITL) is an interactive control paradigm where the workflow of an autonomous agent is gated by human authorization. The agent pauses its execution, persists its state, and awaits an explicit user approval signal before resuming. In VIZIER, HITL is implemented via the proposed_actions database table (for CRUD actions) and via LangGraph interrupts (for durable workflow state pauses).',
    'Like a nuclear launch protocol where the system can calculate trajectory and target, but requires a human to turn the physical key to authorize the launch.',
    10
),
(
    'Interrupt/Resume',
    'LangGraph',
    'A framework feature that pauses an agent mid-thought, saves its state to a database, and waits for a human to resume it. Durable state saving is handled automatically by checkpointers.',
    'Interrupt/Resume is a native capability of LangGraph. When the `interrupt()` function is called inside a node, the graph pauses, serializes the current state, and writes a checkpoint to the PostgresSaver checkpointer. The execution halts without consuming server threads. It is resumed when a client sends a Command containing a resume value to the graph run, resuming execution on the line immediately following the interrupt call.',
    'Like pausing a video game. The game console saves the exact coordinates and inventory of your character to disk, allowing you to turn off the console and load the game later exactly where you left off.',
    10
),
(
    'Permission Tier',
    'Safety',
    'A safety setting for an action type (always_ask, auto_approve_low_risk, blocked) that controls whether VIZIER asks for permission, does it automatically, or blocks it completely.',
    'Permission tiers configure the execution gate. (1) always_ask: requires manual human approval for every proposal. (2) auto_approve_low_risk: automatically approves and runs low-risk actions (risk_tier=''low'') without prompt, while medium/high risk still prompt. (3) blocked: outright rejects and prevents the creation of the proposal, blocking the action structurally.',
    'Like setting screen-time permissions on your child''s phone: Blocked (can''t open YouTube at all), Always Ask (must send a request for approval), or Auto-Approve (free access to educational apps).',
    10
),
(
    'Audit Log',
    'Safety',
    'A permanent, append-only history of everything VIZIER did, who approved it, and any failures. Crucial for tracing security and operational events.',
    'An audit log is an append-only, tamper-evident record of all system transactions, proposals, and user-initiated configuration changes. The database schema restricts updates and deletions. Each entry logs timestamp (ts), actor (agent/human/system), event_type (proposal_created, proposal_approved, setting_changed), and payload details. It is a standard compliance requirement in enterprise software.',
    'Like a ship''s logbook or a bank ledger written in pen: you can add new lines at the bottom, but you are not allowed to erase or scribble out previous pages.',
    10
),
(
    'Append-Only',
    'Engineering',
    'A database property where rows can only be inserted, never updated or deleted. This ensures history cannot be altered or erased by an attacker or a buggy program.',
    'Append-only database design refers to writing transaction histories where UPDATE and DELETE operations are forbidden by application policy (and optionally by DB triggers or permissions). This maintains a continuous chronological audit trail of occurrences, safeguarding against history rewriting attacks and malicious trace deletion.',
    'Like time-lapse security footage: you can keep recording new frames onto the disk, but you cannot go back and edit the frames from yesterday.',
    10
),
(
    'Supabase Realtime',
    'Frontend',
    'A service that automatically pushes changes from your database directly to your web browser. This means your dashboard updates live without needing a page refresh.',
    'Supabase Realtime is a client-server sync protocol built on WebSockets. It listens to Postgres replication Write-Ahead Logs (WAL) and publishes database INSERT, UPDATE, and DELETE changes to authorized frontend channels in real time. This allows frontend UIs to dynamically sync changes (such as displaying new proposed actions instantly) without polling HTTP endpoints.',
    'Like a live sports ticker or a chat room where messages pop up on your screen the exact millisecond they are sent by someone else, without you needing to press a refresh button.',
    10
)
ON CONFLICT (term) DO NOTHING;

-- ---------------------------------------------------------------
-- Academy Lesson Row
-- ---------------------------------------------------------------
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag)
VALUES (
    10,
    1,
    'Block 10.1 — Approval Inbox + Permission Tiers + Audit Log',
    E'## What You Built\n\nYou built VIZIER''s safety cockpit by integrating a database-level configuration system (permission tiers) and a security log (audit logs), coupled with a web-based Approvals UI and a LangGraph-native interrupt mechanism.\n\n## Key Concepts\n- **Human-in-the-Loop (HITL)**: Decoupling LLM suggestions from API invocations using human gates.\n- **LangGraph interrupt()**: Durable graph pause and resume capabilities that survive process crashes.\n- **Permission Tiers**: Gating proposal pipeline behavior (always_ask, auto_approve_low_risk, blocked).\n- **Audit Log**: An append-only historical database of all safety decisions.\n\n## The Realtime Sync\nUsing Supabase Realtime (WebSockets), proposed actions appear immediately on the approvals cockpit as soon as the agent saves them.\n\n## Interview Line\n*"I implemented a multi-tiered permission gate and an append-only SQL audit log for safety. I also built a Next.js cockpit that uses Supabase WebSockets to display proposals in real time and handles durable pauses using LangGraph native interrupts."*',
    'human-in-the-loop, interrupt, audit log, realtime, web sockets'
)
ON CONFLICT (phase, order_index) DO NOTHING;
