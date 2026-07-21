---
id: build-chat-with-my-brain
title: "Build: Chat With My Brain"
domain: rag-retrieval
ring: 3
cluster: "RAG on My Own Brain"
type: build
size: L
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-cli-chatbot", "ingestion-pipelines", "query-rewriting-hyde", "citations-grounding", "metadata-filters", "reranking"]
tags: [rag-retrieval]
---

## ELI5
The node summary says it best: *meta and glorious.* Every component this volume built — the pipeline, the hybrid engine, the reranker, the citations, the filters, the query surgery — assembles into one product: **a conversational interface to your own accumulated knowledge.** You will ask your brain questions and it will answer *from your notes, citing them, filtered by domain.* The system you're building to learn AI now answers questions about learning AI. The snake eats its tail; the demo sells itself in interviews forever.

## The Real Explanation
**The chassis:** Vol 02 Ch 17's CLI chatbot — persona, streaming, memory loop, token-budget trimming, `/usage` — forked and rewired: the gateway call is replaced by the full RAG stack over your Postgres-seeded brain (Ch 15). Every turn: conversational rewrite → retrieve → generate grounded → render cited.

**The retrieval turn, composed (the whole volume in one function):**
1. **Conversational rewriting** (Ch 13's medicine #2, mandatory): history + new message → standalone query via a cheap gateway call. Without this, every follow-up dies; with it, "and how do I test that?" just works. Show the rewritten query in `--show-work` — debugging starts at the query now, not the chunks.
2. **Optional filter parsing** (Ch 12's horizon, made real): a structured-output call maps "in the agents domain" / "from this month" → `Filters`; slice-size visibility and empty-slice fallback ship as built.
3. **Hybrid retrieve → rerank** (Ch 7 + Ch 9): top-20 fused, cross-encoder to top-5. Wired through the *same* decomposable `retrieve()` — every mode still callable for debugging.
4. **Grounded generation with structural citations** (Ch 10): claims + chunk_ids, validated, repaired, rendered as `[source.md > heading-path]`, `--sources` on demand, NOT-IN-NOTES proud and honest.
5. **The answer enters chat history** — and here's the L-node's subtle design problem, worth real thought: retrieved chunks are *per-turn scaffolding*, not conversation — append full chunks to history and three turns will devour your token budget (Vol 01, Ch 8 arithmetic). Ship the sane default: history keeps the user's message and the *answer text only*; chunks are re-retrieved fresh each turn (the rewriter makes follow-ups retrievable, so this works). Document the tradeoff you're accepting: an answer referencing "the chunk above" loses its referent — note it, live with it, revisit in Domain 06 (this exact tension is a memory-architecture problem, and naming-it-now is the setup).

**Commands for a brain:** `/domains` (list rings with chunk counts — the corpus introduces itself), `/filter agents` (session-sticky filter), `/sources` (last answer's chunks in full), `/sync` (invoke the Ch 15 pipeline in-place — edit a note mid-conversation, sync, ask again, watch the answer update: *the freshest demo move you own*), `/usage` (gateway ledger: this conversation's cost).

**Engineering standards — L-node means no shortcuts:** every component behind interfaces, config in one place (models, k values, budgets — you *will* tune), the full pytest suite green across the composed stack (the component tests from Chs 5–15 all still run — composition must not break them; plus new integration tests: rewrite→retrieve→cite end-to-end on fixture notes), and the ledger tracking per-turn cost — a RAG turn is now ~4 LLM calls (rewrite, filter-parse, generate, judge-nothing-yet) plus retrieval; *know* what your brain costs per question (`tokentools`, forever).

## Why It Matters
Where this appears in real systems and jobs: RAG over my own notes, with citations + domain filters — meta and glorious.

## Hands-On
Assemble it (est. 2–3 honest days) — then the inaugural session, transcribed into the note: 15 real questions across at least 4 domains, including 3 follow-ups (rewriter test), 2 filtered queries, 1 deliberate out-of-corpus question (honest refusal test), and 1 live-sync demo (edit → `/sync` → re-ask). Label every turn with the Ch 11 taxonomy where anything wobbles — those labels are Ch 18's golden-set seeds, and *that* is why the transcription matters. Tag `brain-chat-v1.0`. Then record a 90-second screen capture of the sync demo and the citations — capstone ammunition, and honestly, portfolio ammunition.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Trace one follow-up question through all five stages, naming the chapter behind each.
2. Defend the chunks-are-scaffolding decision with token arithmetic, and state the tradeoff accepted and its future domain.
3. Why must component tests survive composition, and what does a green composed suite certify?
4. What is your per-turn cost and its breakdown by call?
5. Why is `/sync` mid-conversation the sharpest demo move — which ring-1 disease does it visibly cure?


---

## Wikilinks
[[build-cli-chatbot]]
[[ingestion-pipelines]]
[[query-rewriting-hyde]]
[[citations-grounding]]
[[metadata-filters]]
[[reranking]]

## Status log
- Started: 2026-07-21
- Finished: null
