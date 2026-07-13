-- =====================================================================
-- Migration 016: Safety Cockpit Schema
-- Block 10.1 — Approval Inbox + permission tiers + audit log
-- =====================================================================

-- 1. ACTION PERMISSIONS TABLE
-- Allows configuring human-in-the-loop safety settings per action type.
-- Tiers:
-- - 'always_ask':             Always create a proposal row and wait for human review.
-- - 'auto_approve_low_risk':  Automatically approve and execute low-risk actions.
-- - 'blocked':                Instantly reject the action without proposing.
CREATE TABLE IF NOT EXISTS action_permissions (
    action_type      TEXT PRIMARY KEY CHECK (action_type IN (
                         'send_email',
                         'create_calendar_event',
                         'create_task',
                         'label_email'
                     )),
    permission_tier  TEXT NOT NULL DEFAULT 'always_ask' CHECK (permission_tier IN (
                         'always_ask',
                         'auto_approve_low_risk',
                         'blocked'
                     )),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE action_permissions IS 
    'Stores permission configurations per action type for the proposal pipeline.';

-- Seed default settings: everything always_ask by default
INSERT INTO action_permissions (action_type, permission_tier)
VALUES
    ('send_email', 'always_ask'),
    ('create_calendar_event', 'always_ask'),
    ('create_task', 'always_ask'),
    ('label_email', 'always_ask')
ON CONFLICT (action_type) DO NOTHING;


-- 2. AUDIT LOG TABLE
-- An append-only historical log of all actions, approvals, and system state modifications.
-- Extremely critical for enterprise tracking, compliance, and security forensics.
CREATE TABLE IF NOT EXISTS audit_log (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ts               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor            TEXT NOT NULL, -- 'agent', 'human', 'system'
    event_type       TEXT NOT NULL, -- e.g., 'proposal_created', 'proposal_approved', 'permission_changed'
    details          JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_ts 
    ON audit_log (ts DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_event_type 
    ON audit_log (event_type);

COMMENT ON TABLE audit_log IS 
    'Append-only security and operational audit trail for all VIZIER actions.';
