-- Migration 011: simple todos table

CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Seed initial todos so the table isn't empty!
INSERT INTO todos (task) VALUES
('Set up Google Workspace API permissions'),
('Configure daily notification triggers'),
('Refactor prompt delimiters for safety testing');
