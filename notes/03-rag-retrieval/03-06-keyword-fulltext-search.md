---
id: keyword-fulltext-search
title: "Keyword & Full-Text Search"
domain: rag-retrieval
ring: 3
cluster: "Retrieval, Seriously"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["nlp-transformer-lineage", "vector-databases", "build-hybrid-search", "embeddings-hands-on"]
tags: [rag-retrieval]
---

## ELI5
Plot twist for a volume about vectors: the search technology from *before* embeddings — matching literal words, scored cleverly — still beats semantic search outright on a huge class of queries, and every serious RAG system ships both. The node calls it old magic that still wins. Time to learn why the old magic works, because Chapter 7 fuses it with the new.

## The Real Explanation
**Where vectors go blind.** Embeddings compress meaning — and compression discards *exact identity*. Search your brain for `HNSW` or `ef_search`, an error string like `ECONNREFUSED`, a version number, an invoice ID, a person's name: semantic search retrieves things *about the same topic* while missing the chunk containing *the literal token* — because in meaning-space, `ef_search` and `nprobe` are neighbors, which is precisely wrong when you asked for one of them. Exact identifiers, jargon, codes, names: keyword territory, forever. (Flip side: keyword search is the one that's blind to "laptop won't turn on" ↔ "computer fails to boot." Two blindnesses, perfectly complementary — hold that thought for one chapter.)

**BM25 — the reigning king of keyword scoring, demystified.** Three intuitions stacked (each one a Vol 01, Ch 13 echo — this is TF-IDF's direct descendant, alive and winning):
1. *Term frequency, saturating*: a chunk mentioning your query word 3 times beats one mentioning it once — but 50 mentions isn't ~17× better than 3; BM25's TF term flattens out (diminishing returns), which is what made it robust where raw counting was spammable.
2. *Inverse document frequency*: rare words carry the query. In a corpus about your brain, `the` matches everything (worth ~nothing); `checkpointer` matches three chunks (worth gold). Score weight ∝ rarity across the corpus.
3. *Length normalization*: a 2,000-word chunk gets more word-lottery tickets by sheer size; BM25 penalizes length so a tight 100-word chunk with your terms beats a rambling giant that mentions them in passing.
Score = sum over query terms of (saturating TF × IDF × length-norm). That's the whole king. Decades old, brutally fast (inverted index: word → list of chunks containing it — the same structure as a book's index page), zero GPU, zero embedding model, and *interpretable* — you can always see exactly why a chunk matched, a debugging luxury vectors never grant.

**Full-text search in practice — the plumbing names.** Postgres ships it natively: `tsvector` (a processed column: text → stemmed, stop-worded, indexed lexemes — "running", "runs", "ran" all become `run`) + `tsquery` (the parsed query) + a GIN index for speed, with `ts_rank` scoring. Which means — pgvector chapter callback — **one Postgres can serve both search modalities on the same table**: a `tsvector` column beside your `vector(384)` column, keyword and semantic queries against the same chunks. That co-location is exactly what makes Chapter 7's hybrid build clean, and it's a real architectural argument in pgvector's favor that you can now articulate. (Elsewhere in the landscape: Elasticsearch/OpenSearch built empires on this; SQLite has FTS5; every one is BM25-or-cousin under the hood.)

**Stemming's sharp edge:** the same normalization that unifies run/running/ran can mangle jargon and code tokens (`embedding` → `embed` is fine; but stemmers can butcher identifiers like `ef_search`, and stop-word lists can eat meaningful short tokens). For technical corpora — yours — configure keyword search to preserve code-flavored tokens, or search both raw and stemmed. A tiny config detail with outsized retrieval consequences; you'll set it deliberately in Ch 7's build.

## Why It Matters
Where this appears in real systems and jobs: BM25/tsvector — old magic that still wins.

## Hands-On
A rigged duel, on your Ch 5 corpus, no new infrastructure (a ~30-line BM25 is a fine exercise, or use the `rank_bm25` library against your chunks): write 8 queries — 4 rigged for keywords (exact jargon from your notes: `checkpointer`, an error string, a node id like `build-gateway`, a tool name), 4 rigged for semantics (paraphrases using none of your notes' vocabulary: "how does the agent ask permission before acting?"). Run all 8 through *both* your Ch 5 vector retrieval and BM25; record which system wins each, side by side. Expected shape: a clean 4–4 split along exactly the lines this chapter drew — verify against reality, note any upset honestly. That 8-row table is Chapter 7's opening argument, written by your own corpus.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name three query types where keyword search structurally beats semantic, and explain the compression argument for why.
2. Recite BM25's three stacked intuitions and what abuse each one defends against.
3. What is an inverted index, and what interpretability luxury does keyword search grant?
4. What are `tsvector`/`tsquery`/GIN, and why does their co-location with pgvector matter architecturally?
5. Where does stemming bite technical corpora, and what will you configure differently for your brain?


---

## Wikilinks
[[nlp-transformer-lineage]]
[[vector-databases]]
[[build-hybrid-search]]
[[embeddings-hands-on]]

## Status log
- Started: 2026-07-21
- Finished: null
