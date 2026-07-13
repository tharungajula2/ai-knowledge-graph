-- =====================================================================
-- Migration 019: Briefings & Weekly Reviews Schema
-- Block 11.1 — Scheduler + Morning Briefing
-- =====================================================================

CREATE TABLE IF NOT EXISTS briefings (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    kind             TEXT NOT NULL CHECK (kind IN ('morning_briefing', 'weekly_review')),
    summary          TEXT NOT NULL, -- Formatted Markdown text
    raw_data         JSONB NOT NULL -- Gained API responses (for debugging/diagnostics)
);

CREATE INDEX IF NOT EXISTS idx_briefings_kind 
    ON briefings (kind);

CREATE INDEX IF NOT EXISTS idx_briefings_created_at 
    ON briefings (created_at DESC);

COMMENT ON TABLE briefings IS 
    'Stores generated morning briefings and weekly reviews for VIZIER.';
