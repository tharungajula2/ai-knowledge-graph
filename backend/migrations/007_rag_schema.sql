-- ==========================================
-- VIZIER RAG Schema Migration (007_rag_schema)
-- ==========================================

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. CREATE DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CREATE DOCUMENT CHUNKS TABLE
CREATE TABLE IF NOT EXISTS doc_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(768),
    tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CREATE HNSW VECTOR INDEX (Cosine similarity search)
-- HNSW (Hierarchical Navigable Small World) provides approximate nearest neighbor search 
-- which scales logarithmic-like compared to exact search (brute force table scans).
CREATE INDEX IF NOT EXISTS doc_chunks_embedding_hnsw_idx 
ON doc_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. CREATE GIN FULL-TEXT SEARCH INDEX (Keyword search)
-- GIN (Generalized Inverted Index) stores inverted lookup lists for fast full-text 
-- keyword search queries using tsvectors.
CREATE INDEX IF NOT EXISTS doc_chunks_tsv_gin_idx 
ON doc_chunks USING gin (tsv);
