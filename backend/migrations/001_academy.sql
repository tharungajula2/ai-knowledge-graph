-- ==========================================
-- VIZIER Academy - Schema Migration (001_academy)
-- ==========================================

-- CONCEPT EXPLANATION: EXTENSIONS
-- Extensions are pre-packaged modules that add features to Postgres.
-- 'uuid-ossp' is used for generating globally unique IDs (UUIDv4).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DICTIONARY TERMS TABLE
-- Stores glossary items for agentic AI.
-- CONCEPT: PRIMARY KEY - Unique identifier for each row, ensuring no duplicates.
-- CONCEPT: UNIQUE - Constraints a column so that no two rows can have the same value.
-- CONCEPT: TEXT[] - An array/list of text items, allowing us to store multiple related term references.
-- CONCEPT: TIMESTAMPTZ - Uptime timestamp with timezone awareness, the standard for reliable timestamps.
-- CONCEPT: DEFAULT - Assigns a default value (e.g. current time or generated UUID) if none is provided.
CREATE TABLE IF NOT EXISTS dictionary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    beginner_definition TEXT NOT NULL,
    deep_definition TEXT NOT NULL,
    analogy TEXT NOT NULL,
    related_terms TEXT[] DEFAULT '{}',
    first_seen_phase TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. LESSONS TABLE
-- Stores the curriculum body content.
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    body_markdown TEXT NOT NULL,
    competency_tag TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Ensure each lesson order is unique within its phase
    CONSTRAINT unique_phase_order UNIQUE (phase, order_index)
);

-- 3. WORKBOOK EXERCISES TABLE
-- Stores hands-on challenges linked to lessons.
-- CONCEPT: FOREIGN KEY - Establishes a link/relationship between two tables. 
-- Here, lesson_id references lessons(id). If a lesson is deleted, ON DELETE CASCADE automatically deletes its exercises.
CREATE TABLE IF NOT EXISTS workbook_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    instruction_markdown TEXT NOT NULL,
    expected_observation TEXT NOT NULL,
    break_it_challenge TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. USER PROGRESS TABLE
-- Tracks the learning and review state of terms, lessons, and exercises.
-- CONCEPT: CHECK CONSTRAINT - Validates that values stored in a column match a specific set of rules.
-- This ensures item_type is strictly 'term', 'lesson', or 'exercise', and status is not corrupted.
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type TEXT NOT NULL CHECK (item_type IN ('term', 'lesson', 'exercise')),
    item_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'done', 'review')),
    notes TEXT,
    ease_factor FLOAT DEFAULT 2.5, -- For SuperMemo spaced-repetition logic later
    next_review_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index to make querying progress status fast
CREATE INDEX IF NOT EXISTS idx_user_progress_item ON user_progress(item_type, item_id);
