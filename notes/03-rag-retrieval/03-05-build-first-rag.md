---
id: build-first-rag
title: "Build: First RAG Pipeline"
domain: rag-retrieval
ring: 3
cluster: "Retrieval Fundamentals"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["why-rag", "chunking", "embeddings-hands-on", "build-gateway", "rag-failure-modes"]
tags: [rag-retrieval]
---

## ELI5
Four chapters of parts on the workbench: the why, the vectors, the chunks, the store. Today they become a machine — **ingest → embed → store → retrieve → answer**, the five verbs of the node summary, wired end to end with your own hands and *no framework*. When LangChain-style abstractions appear later in your journey, they'll be conveniences over a machine you've personally assembled — never magic. This is the ring's first working RAG, and the honest baseline every later chapter improves.

## The Real Explanation
Corpus: start meaningfully small and *yours* — 10–15 of your own brain notes plus your PROJECT_TRUTH doc (markdown, header-structured: Ch 3 told you the right chunking family). Store: keep it deliberately primitive this chapter — chunks and vectors in memory or a JSON file, brute-force cosine search with *your own* Ch 2 function. Yes, primitive. You must feel brute force work (and later, in Ch 8, measure exactly what indexes buy over it). pgvector arrives in Ch 15 when the corpus earns it.

**The five verbs, as functions (this decomposition *is* the architecture — every RAG framework on earth is these five names in a trenchcoat):**
```python
def ingest(paths: list[Path]) -> list[Doc]          # read files, capture source metadata
def chunk(docs) -> list[Chunk]                       # header-aware + heading-path prepend (Ch 3)
def embed_and_store(chunks) -> Store                 # local model (Ch 2), batched; save vectors+text+metadata
def retrieve(query: str, store, k: int = 4) -> list[Scored]   # embed query, cosine against all, top-k
def answer(query: str, hits: list[Scored]) -> Answer          # build grounded prompt, call gateway
```
Pydantic models for `Chunk` (id, content, source, heading_path, embedding) and `Answer` (text, sources_used) — the boundary discipline (Vol 02, Ch 6) applies to your own pipeline too.

**The grounded prompt — where Volume 02 pays rent.** Full skeleton: system rules ("You answer strictly from the provided context. If the context doesn't contain the answer, say exactly: NOT IN NOTES. For each claim, cite the chunk id in [brackets]."), retrieved chunks delimited as data — numbered, with their heading-paths visible (`<chunk id=3 source="agents/gate.md > HITL">...</chunk>`) — then the question. Every clause earns its keep: strict-context fights hallucination (Vol 01, Ch 10), NOT-IN-NOTES makes honest failure *visible and testable*, bracket-citations preview Ch 10 of this volume, and delimiters are injection hygiene (Vol 02, Ch 12 — your notes are your own, but the *habit* must be unconditional). Temperature 0 (Vol 01, Ch 9's table: this is extraction-flavored work).

**The inspection window — the build's real lesson.** Add `--show-work`: print the query, the top-k chunks *with their similarity scores*, then the answer. Then live in that window: ask ten real questions about your own notes and *read what retrieval actually fetched before reading the answer*. You will see, within ten queries, at least one of each: a great hit (right chunk, high score, grounded answer — the system working), a *near miss* (right note, wrong chunk — chunking tension from Ch 3, alive), a *vocabulary miss* (you asked with words your notes don't use — Ch 13's future customer), and a correct NOT-IN-NOTES refusal. Congratulations: you've now personally met the failure taxonomy that Chapter 11 formalizes. Retrieval quality problems are *invisible* in the final answer and *obvious* in the inspection window — the single most important operational habit in all of RAG is: **when the answer is wrong, look at the chunks first.**

**Tests** (Vol 01, Ch 21): chunker never severs a heading from its section; retrieval on a query *copied verbatim from a chunk* returns that chunk at rank 1 (the sanity floor); a question about content deliberately absent from the corpus yields NOT-IN-NOTES; `Answer.sources_used ⊆ retrieved ids`.

## Why It Matters
Where this appears in real systems and jobs: ingest → embed → store → retrieve → answer.

## Hands-On
Build it — suggested order: ingest+chunk (Ch 3's script grows up) → embed+store with the local model → retrieve (your cosine, a sort, top-k) → the grounded prompt via your gateway → `--show-work` → the ten-question inspection session, transcribed honestly into the note with each query labeled {hit | near-miss | vocab-miss | correct-refusal} → tests green → tag `rag-v0.1`. Estimated one honest day. Keep the ten labeled queries safe: they are the embryo of Ch 16's golden set and Ch 18's eval build — your measurement story starts with this exact list.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the five verbs and each one's input → output.
2. Justify every clause of the grounded prompt — four clauses, four reasons, four chapter citations.
3. Why brute force *now* and indexes *later*? What does the primitive store let you feel?
4. Describe one near-miss from your inspection session and diagnose it with Ch 3's vocabulary.
5. State the operational habit this build installs, and why answer-reading alone can't debug RAG.


---

# PART II — RETRIEVAL, SERIOUSLY
*11 chapters. The baseline works; now make it good — old keyword magic, hybrid fusion, benchmarks, rerankers, citations, the failure taxonomy, filters, query surgery, multi-hop, the industrial pipeline, and the beginning of measurement.*

---

## Wikilinks
[[why-rag]]
[[chunking]]
[[embeddings-hands-on]]
[[build-gateway]]
[[rag-failure-modes]]

## Status log
- Started: 2026-07-21
- Finished: null
