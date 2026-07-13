import os
import sys
import re
import psycopg
from typing import List, Dict, Any

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

def reciprocal_rank_fusion(vector_results: List[Dict[str, Any]], text_results: List[Dict[str, Any]], k: int = 60) -> List[Dict[str, Any]]:
    """
    Combines two ranked list results using Reciprocal Rank Fusion (RRF).
    Scores docs based on inverse rank: 1 / (k + rank)
    """
    scores = {}
    
    # 1. Score vector results
    for rank, doc in enumerate(vector_results):
        doc_id = doc["id"]
        if doc_id not in scores:
            scores[doc_id] = {"doc": doc, "score": 0.0}
        scores[doc_id]["score"] += 1.0 / (k + rank + 1)
        
    # 2. Score keyword results
    for rank, doc in enumerate(text_results):
        doc_id = doc["id"]
        if doc_id not in scores:
            scores[doc_id] = {"doc": doc, "score": 0.0}
        scores[doc_id]["score"] += 1.0 / (k + rank + 1)

    # 3. Sort by aggregated score descending
    sorted_scores = sorted(scores.values(), key=lambda x: x["score"], reverse=True)
    return [item["doc"] for item in sorted_scores]

def search(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Performs hybrid Cosine Similarity and Keyword GIN Index search,
    merging results via Reciprocal Rank Fusion (RRF).
    """
    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    
    # 1. Generate query embedding
    print(f"[RAG Retrieve] Query embedding generation for: '{query}'")
    try:
        query_vector = gateway.embed([query])[0]
        query_vector_str = "[" + ",".join(map(str, query_vector)) + "]"
    except Exception as e:
        print(f"[RAG Retrieve Warning] Query embedding generation failed: {e}. Defaulting to keyword-only search.")
        query_vector_str = None

    vector_results = []
    text_results = []

    # 2. Connect to Database and query both methods
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            # A. Vector Search (Cosine Similarity distance '<=>')
            if query_vector_str:
                cur.execute("""
                    SELECT c.id, c.content, d.title, 1 - (c.embedding <=> %s::vector) AS score
                    FROM doc_chunks c
                    JOIN documents d ON c.document_id = d.id
                    ORDER BY c.embedding <=> %s::vector
                    LIMIT %s;
                """, (query_vector_str, query_vector_str, limit * 2))
                for row in cur.fetchall():
                    vector_results.append({
                        "id": row[0],
                        "content": row[1],
                        "document_title": row[2],
                        "score": float(row[3])
                    })

            # B. Keyword/Text Search (tsvector GIN matches ranked by ts_rank)
            # We use websearch_to_tsquery for safe google-style search parsing
            cur.execute("""
                SELECT c.id, c.content, d.title, ts_rank(c.tsv, websearch_to_tsquery('english', %s)) AS score
                FROM doc_chunks c
                JOIN documents d ON c.document_id = d.id
                WHERE c.tsv @@ websearch_to_tsquery('english', %s)
                ORDER BY score DESC
                LIMIT %s;
            """, (query, query, limit * 2))
            for row in cur.fetchall():
                text_results.append({
                    "id": row[0],
                    "content": row[1],
                    "document_title": row[2],
                    "score": float(row[3])
                })

    # 3. Merge Vector and Keyword outputs via RRF
    rrf_results = reciprocal_rank_fusion(vector_results, text_results, k=60)
    
    # Slice to final limit
    final_docs = rrf_results[:limit]
    
    # 4. Optional Reranking Step (Conceptual Placeholder)
    # Rerankers (e.g. cross-encoders) inspect the search query alongside each retrieved chunk's content, 
    # predicting an exact relevance score. It is highly accurate but computationally expensive.
    # To implement locally, we would run:
    # 
    #   from sentence_transformers import CrossEncoder
    #   model = CrossEncoder("mixedbread-ai/mxbai-rerank-large-v1")
    #   pairs = [[query, doc["content"]] for doc in final_docs]
    #   scores = model.predict(pairs)
    #   for doc, score in zip(final_docs, scores):
    #       doc["rerank_score"] = float(score)
    #   final_docs = sorted(final_docs, key=lambda x: x["rerank_score"], reverse=True)
    #
    print(f"[RAG Retrieve] Successfully retrieved {len(final_docs)} merged documents using RRF.")
    return final_docs

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python retrieve.py <search_query>")
        sys.exit(1)
        
    search_query = " ".join(sys.argv[1:])
    results = search(search_query)
    print("\n--- HYBRID SEARCH RESULTS (RRF MERGED) ---")
    for idx, doc in enumerate(results):
        print(f"\n[{idx + 1}] Source: {doc['document_title']}")
        print(f"Content:\n{doc['content']}")
        print("-" * 50)
