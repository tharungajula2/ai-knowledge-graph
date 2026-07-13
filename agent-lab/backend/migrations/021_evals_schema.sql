-- =====================================================================
-- Migration 021: Evaluations Schema
-- Block 12.1 — Langfuse Integration + Golden Evaluations
-- =====================================================================

CREATE TABLE IF NOT EXISTS eval_runs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    run_id           TEXT NOT NULL,          -- Groups test cases of a single batch run
    query            TEXT NOT NULL,          -- Test case input query
    expected_route   TEXT NOT NULL,          -- Expected specialist route (e.g. SCHEDULER, SCRIBE)
    actual_route     TEXT NOT NULL,          -- Actual specialist route recorded
    routing_match    BOOLEAN NOT NULL,       -- TRUE if expected == actual
    judge_score      FLOAT NOT NULL,         -- Score from LLM Judge (0.0 to 1.0)
    judge_reason     TEXT NOT NULL,          -- Explanation from LLM Judge
    raw_response     TEXT NOT NULL           -- The full agent response text
);

CREATE INDEX IF NOT EXISTS idx_eval_runs_run_id 
    ON eval_runs (run_id);

CREATE INDEX IF NOT EXISTS idx_eval_runs_created_at 
    ON eval_runs (created_at DESC);

COMMENT ON TABLE eval_runs IS 
    'Stores test execution runs, routing metrics, and LLM-as-a-Judge scores.';
