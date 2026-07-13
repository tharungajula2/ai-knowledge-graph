-- Migration 009: memory table with pgvector and HNSW index

CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind VARCHAR(50) NOT NULL CHECK (kind IN ('semantic', 'episodic', 'procedural')),
    content TEXT NOT NULL,
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 10),
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for pgvector similarity search using HNSW
CREATE INDEX IF NOT EXISTS memories_embedding_idx ON memories 
USING hnsw (embedding vector_cosine_ops);
