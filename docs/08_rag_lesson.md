# Lesson 8.0: Retrieval-Augmented Generation (RAG) & Vector Geometry

In this lesson, we explore the math, architectures, and design trade-offs behind building a production-grade **Retrieval-Augmented Generation (RAG)** system using **pgvector** and **Hybrid Search**.

---

## 1. Vector Geometry & Embeddings

At the core of RAG is **semantic embedding**:
* **Embedding Model:** A neural network that translates text content into a coordinate point (a vector) in a high-dimensional vector space. In VIZIER, we use Gemini's `text-embedding-004` which outputs **768-dimensional** vectors.
* **Semantic Distance:** If two paragraphs talk about similar concepts (e.g. "persistence" and "database saving"), the angle between their vectors is very small. We calculate this using **Cosine Similarity**:
  $$\text{Cosine Similarity} = 1 - \text{Cosine Distance}$$
  In pgvector, Cosine distance is queried using the `<=>` operator.

---

## 2. Ingestion Pipeline & Chunking Tradeoffs

You cannot feed a 100-page document directly into an LLM context window without incurring massive costs, latency, and context degradation ("lost in the middle" effect). We segment documents using an **Ingestion Pipeline**:

1. **Extraction:** Read text from PDFs (via PyMuPDF) or markdown files.
2. **Chunking:** Slice text into segments of ~800 characters.
3. **Overlap:** Keep a small window of ~100 characters between adjacent slices. This prevents structural breaks in paragraphs or sentences from clipping context.
4. **Indexing:** Embed chunks and write them to Supabase.

---

## 3. Hybrid Search: Vector vs. Keyword

Vector search is excellent at identifying *synonyms* and *concepts*. However, it struggles with:
* Exact word matches (e.g. phone numbers, email addresses, product SKU numbers).
* Specific function names (e.g. `call_supervisor`).

Keyword search (e.g. BM25 or PostgreSQL `tsvector`) excels at exact string matches but fails to understand synonyms (e.g., searching for "automobile" won't find "car").

**Hybrid Search** solves this by running both queries in parallel:
1. Vector Similarity Index (HNSW).
2. Full-text Keyword Index (GIN on `tsvector`).

---

## 4. Reciprocal Rank Fusion (RRF) & Reranking

Once both search runs return their results, we have two different lists of matching documents with incompatible scores (one is a cosine distance, the other a search query text rank). We merge them using **Reciprocal Rank Fusion (RRF)**:

$$RRF(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$

Where $r_m(d)$ is the rank of document $d$ in result list $m$, and $k$ is a smoothing constant (standard is 60). RRF ranks items highly if they perform well across both vector and keyword queries.

### Reranking (Cross-Encoders)
RRF returns a good list of candidates. To achieve maximum accuracy, we can optionally pass the top-5 candidates through a **Reranker** model (like mixedbread-ai or Cohere). Rerankers are heavy, deep cross-encoders that evaluate query-context relevance with absolute precision, reorganizing the final list to place the absolute best context at the very top.
