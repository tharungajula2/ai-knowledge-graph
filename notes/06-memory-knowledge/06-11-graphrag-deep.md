---
id: graphrag-deep
title: "GraphRAG Properly"
domain: memory-knowledge
ring: 6
cluster: "Knowledge Graphs"
type: concept
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["graphrag-preview", "entity-extraction", "knowledge-graphs-101", "temporal-knowledge", "build-learning-recall-agent"]
tags: [memory-knowledge]
---

## ELI5
Vol 03 Ch 19 was the preview; this is the real thing. The node summary: **community summaries, graph-aware retrieval.** You now have the pieces the preview lacked — entity extraction (Ch 10), a knowledge graph (Ch 9), and the retrieval mastery of Vol 03 — so GraphRAG stops being "someday" and becomes buildable architecture. This chapter is the full method: how a knowledge graph transforms retrieval from *finding similar chunks* to *reasoning over connected knowledge*, answering the global and relational questions vector RAG structurally cannot.

## The Real Explanation
**The problem GraphRAG solves — recall Vol 03 Ch 19's two failures.** *Global questions* ("what are the main themes across my agents notes?") — no chunk contains the answer; it's a property of the *whole collection*, and top-k retrieval misses it by construction. *Relational questions* ("how does the checkpointer relate to the gate?") — the answer is in the *connections*, which vector search can't traverse. Standard RAG fails both because it treats knowledge as an unstructured pile. GraphRAG treats it as a structured graph, and structure answers both.

**The method — the full GraphRAG pipeline (Vol 03 Ch 19's three techniques, now understood in depth).**
1. **Graph construction** (Ch 10, done): entities and relations extracted from the corpus into a knowledge graph, entity-resolved. Your notes → your graph.
2. **Community detection**: graph algorithms (Leiden/Louvain are the famous ones — you don't implement them, you *use* them) cluster densely-connected regions into *communities* — groups of entities more connected to each other than to the rest. For your brain, domains emerge as natural communities, *plus* surprises: cross-domain communities like "everything touching Pydantic" or "everything the gate protects" that no folder structure knows (Vol 03 Ch 19's promise, now real). Communities can be *hierarchical* (sub-communities within domains, a root above all — the resolution dial).
3. **Community summarization** — *the key move for global questions*: an LLM writes a *summary of each community* ("the agents-domain community covers the reason-act-observe loop, its patterns, and its failure modes...") and *stores it*. Now global questions have an answer to retrieve: "main themes across agents notes?" → retrieve the agents-community summary → pre-computed synthesis, fished out like any chunk. The pile could never; the graph does it *at ingestion, once*, and reuses it for every global query.
4. **Graph-aware retrieval** — the query-time method, which *routes by question type* (the routing doctrine, Vol 05 Ch 3, at the retrieval layer): *global question* → retrieve community summaries (high-level, pre-computed); *specific question* → find relevant entities, retrieve their neighborhoods and the underlying chunks (drill down); *relational question* → find the entities, *walk the path* between them (the graph traversal vector search can't do). Often *hybrid with vector RAG*: use vector search to find entry-point entities (semantic entry), then traverse the graph from there (structural expansion) — vectors for "where do I start," graph for "what's connected." The two retrieval paradigms compose, each doing what it's best at.

**The honest costs — why GraphRAG is a judgment call, not a default (Vol 03 Ch 19's adoption rule, now with the full cost picture).** *Construction cost explodes*: LLM extraction over every chunk + community summarization ≈ orders of magnitude more expensive than embedding (Vol 04 Ch 17's ledger instincts wince — correctly). *Graph staleness is nastier than index staleness* (Ch 12's whole subject): one edited note can re-wire edges and invalidate community summaries *up the hierarchy* — a transitive cache-invalidation problem far harder than re-embedding one chunk. *Extraction quality bounds everything* (Ch 10 — garbage triples → confident garbage traversals; poisoned-at-birth, graph edition). *Complexity*: more moving parts, more failure surface, more to maintain. The adoption judgment, sharpened: GraphRAG earns its cost when *global and relational questions are the workload* (not the exception), when *the corpus's value is its connections* (not just its content), and when you'll *invest in construction and maintenance*. For most corpora and most questions, hybrid vector RAG wins on cost-adjusted quality. **For your brain** — a densely-wikilinked graph, queried by someone who thinks in connections, where "how does X relate to Y across domains?" is a *native* question — the case is unusually, genuinely strong, which is exactly why your curriculum schedules the real build here rather than dismissing it.

## Why It Matters
Where this appears in real systems and jobs: community summaries, graph-aware retrieval.

## Hands-On
Build a slice of proper GraphRAG on your Ch 10 graph (concept node, but concrete — full build is Ch 14/17 territory): (1) *Community detection*: run a community algorithm (via `networkx` or `igraph` — libraries, don't implement) on your extracted graph; inspect the communities — do your domains emerge? What *cross-domain* community surprised you? (2) *Community summarization*: LLM-summarize your two most interesting communities (one domain-aligned, one cross-cutting); these summaries *are* your global-question answers — test one ("what's the main theme of [community]?"). (3) *The routing table*: six questions about your brain (two global, two relational, two specific) and, for each, which GraphRAG path answers it (community summary / graph walk / entity-neighborhood + chunks) vs what plain vector RAG would have done (fail / expensive multi-hop / tie). The communities + the summaries + the routing table = the note; this is Ch 14's memory layer and the recall agent (Ch 17) designed early.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the two question-types GraphRAG solves and why plain RAG fails each.
2. Walk the four-stage pipeline, and identify which stage answers global questions and *when* it's computed.
3. Explain graph-aware retrieval's routing by question type, and the vectors-for-entry/graph-for-expansion hybrid.
4. Name the four honest costs, and why is graph staleness worse than index staleness?
5. State the adoption judgment, and defend why your brain is an unusually strong case.


---

## Wikilinks
[[graphrag-preview]]
[[entity-extraction]]
[[knowledge-graphs-101]]
[[temporal-knowledge]]
[[build-learning-recall-agent]]

## Status log
- Started: 2026-07-21
- Finished: null
