-- =====================================================================
-- Migration 014: proposed_actions table
-- Block 9.2 — Write Actions via Proposal Gate
-- =====================================================================
-- The PROPOSAL PATTERN is the core safety architecture for agentic write actions.
-- Instead of letting agents execute directly, they INSERT a proposal row.
-- A human reviews and approves/rejects via the CLI (or later the web UI).
-- The executor is only called after status='approved', and uses idempotency_key
-- to guarantee the same approval NEVER triggers a double-send.
--
-- IDEMPOTENCY EXPLAINED:
-- Imagine you approve a payment. The network hiccups. You click "Approve" again.
-- Without idempotency, you get charged twice. With idempotency, the second call
-- detects the same key already processed and silently returns "already done."
-- The UNIQUE constraint on idempotency_key is the database-level enforcement.
-- =====================================================================

CREATE TABLE IF NOT EXISTS proposed_actions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Which specialist agent proposed this action
    agent            TEXT NOT NULL,

    -- The type of action being proposed
    -- Each type maps 1:1 to an executor function in app/actions/executors.py
    action_type      TEXT NOT NULL CHECK (action_type IN (
                         'send_email',
                         'create_calendar_event',
                         'create_task',
                         'label_email'
                     )),

    -- The full structured payload for the executor (varies by action_type)
    -- send_email:             {to, subject, body}
    -- create_calendar_event:  {title, start_time, end_time, description}
    -- create_task:            {title, due_date, notes}
    -- label_email:            {email_id, label_name}
    payload          JSONB NOT NULL,

    -- Why the agent thinks this action is necessary (shown to human in review)
    rationale        TEXT NOT NULL DEFAULT '',

    -- RISK TIER: how dangerous is this action?
    -- low:    reversible, low-impact (create_task, label_email)
    -- medium: moderate, can be undone (create_calendar_event)
    -- high:   irreversible, external impact (send_email)
    risk_tier        TEXT NOT NULL CHECK (risk_tier IN ('low', 'medium', 'high')),

    -- LIFECYCLE STATUS:
    -- proposed  → awaiting human review
    -- approved  → human said yes; executor will run
    -- rejected  → human said no; executor will NOT run
    -- executed  → executor ran successfully
    -- failed    → executor ran but encountered an error
    status           TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN (
                         'proposed', 'approved', 'rejected', 'executed', 'failed'
                     )),

    -- IDEMPOTENCY KEY: a UUID generated at proposal creation time.
    -- UNIQUE ensures even if "approve" is called twice, the second
    -- call detects a duplicate and does nothing — preventing double sends.
    idempotency_key  TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,

    -- Timestamps for audit trail
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at       TIMESTAMPTZ,            -- set when approved or rejected
    executed_at      TIMESTAMPTZ,            -- set when executor completes

    -- The raw result JSON from the Google API response (or error message on failure)
    result           JSONB
);

-- Index for fast lookup of pending proposals by status
CREATE INDEX IF NOT EXISTS idx_proposed_actions_status
    ON proposed_actions (status, created_at DESC);

-- Index for looking up by agent name (useful for debugging which agent proposes most)
CREATE INDEX IF NOT EXISTS idx_proposed_actions_agent
    ON proposed_actions (agent);

COMMENT ON TABLE proposed_actions IS
    'Block 9.2: Stores all write-action proposals from specialist agents. '
    'Agents propose; humans approve; executors execute. '
    'idempotency_key guarantees at-most-once execution even if approve is called multiple times.';
