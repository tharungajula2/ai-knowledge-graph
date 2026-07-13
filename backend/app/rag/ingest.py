import os
import sys
import argparse
import re
import fitz  # PyMuPDF
import psycopg

# Adjust path to run from root of backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.settings import settings
from app.llm.gateway import gateway

# DB DSN Parser
def parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"

def recursive_chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list:
    """
    Recursively splits text into chunks of roughly chunk_size characters with overlap.
    """
    # Simple recursive sliding window over paragraphs or sentences
    chunks = []
    text_len = len(text)
    start = 0
    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def ingest_document(filepath: str, title: str = None) -> str:
    """
    Loads, chunks, embeds, and stores a document in the pgvector database.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    
    filename = os.path.basename(filepath)
    ext = os.path.splitext(filename)[1].lower()
    doc_title = title or filename
    
    print(f"\n[Ingest] Processing file: {filename} ({ext})")
    
    # 1. Read document text based on extension
    raw_text = ""
    if ext == ".pdf":
        try:
            doc = fitz.open(filepath)
            for page_num, page in enumerate(doc):
                raw_text += page.get_text()
            print(f"[Ingest] Loaded PDF with {len(doc)} pages.")
        except Exception as e:
            raise RuntimeError(f"Error reading PDF: {e}")
    else:
        # Markdown, text, etc.
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                raw_text = f.read()
            print(f"[Ingest] Loaded text file with {len(raw_text)} characters.")
        except Exception as e:
            raise RuntimeError(f"Error reading text file: {e}")

    if not raw_text.strip():
        raise ValueError("Document has no text content.")

    # 2. Chunk text
    chunks = recursive_chunk_text(raw_text, chunk_size=800, overlap=100)
    print(f"[Ingest] Created {len(chunks)} chunks of size ~800 characters.")

    # 3. Generate embeddings
    print(f"[Ingest] Calling gateway to embed {len(chunks)} chunks...")
    embeddings = gateway.embed(chunks)
    
    # 4. Save to Database
    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    
    print("[Ingest] Connecting to Supabase Postgres...")
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            # Check if document already exists by title
            cur.execute("SELECT id FROM documents WHERE title = %s", (doc_title,))
            row = cur.fetchone()
            if row:
                doc_id = row[0]
                print(f"[Ingest] Document '{doc_title}' already exists. Deleting old chunks to re-index...")
                cur.execute("DELETE FROM doc_chunks WHERE document_id = %s", (doc_id,))
            else:
                # Insert document metadata
                cur.execute(
                    "INSERT INTO documents (title, source) VALUES (%s, %s) RETURNING id",
                    (doc_title, filename)
                )
                doc_id = cur.fetchone()[0]

            # Insert chunks and embeddings
            print(f"[Ingest] Inserting {len(chunks)} chunks into doc_chunks table...")
            for chunk_content, embedding in zip(chunks, embeddings):
                # In pgvector, we can format a float list as a string like '[0.1, 0.2, ...]'
                # or pass it as an array to let psycopg serialize it.
                # In pgvector/psycopg, list formatted as string is most reliable.
                embedding_str = "[" + ",".join(map(str, embedding)) + "]"
                cur.execute(
                    "INSERT INTO doc_chunks (document_id, content, embedding) VALUES (%s, %s, %s)",
                    (doc_id, chunk_content, embedding_str)
                )
            
            conn.commit()
            print(f"[Ingest Success] Ingested '{doc_title}' successfully under UUID: {doc_id}")
            return str(doc_id)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Markdown, Text, or PDF documents into VIZIER RAG.")
    parser.add_argument("file", type=str, help="Absolute path to the document file to ingest.")
    parser.add_argument("--title", type=str, default=None, help="Custom document title.")
    
    args = parser.parse_args()
    try:
        ingest_document(args.file, args.title)
    except Exception as e:
        print(f"[Ingest Error] Ingestion failed: {e}")
        sys.exit(1)
