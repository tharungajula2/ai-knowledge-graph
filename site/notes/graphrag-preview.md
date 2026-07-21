## ELI5
Your RAG treats the brain as a *pile* — chunks in a bag, fished out by similarity. But your brain isn't a pile; it's a **web**: notes wikilinked to notes, concepts belonging to domains, builds depending on concepts. The node summary names the shift: *when knowledge is a graph, not a pile* — and names the machinery: community summaries, entity linking, hierarchical relationship indexing. This is a preview node — mechanism and judgment today, implementation when the frontier-shaped future arrives — but for *your* corpus it's more than a preview: your ingestion pipeline has been saving wikilinks since Ch 15 precisely for this chapter's someday.

## The Real Explanation
**What vector RAG structurally cannot answer.** Two question families expose the pile's limits. *Global questions*: "what are the main themes across my agents notes?" — no chunk contains the themes; the answer is a property of the *whole collection*, and retrieving top-k of anything misses it by construction (top-k of what? the question matches everything weakly and nothing well). *Relational questions*: "how does the checkpointer relate to the human-approval gate?" — the answer lives in *connections between* notes; Ch 14's multi-hop can walk 2–3 connections at query time, expensively, per query — but it re-derives the web every time, and deep or broad traversals explode. The diagnosis in one sentence: **similarity search finds things *like* the query; it cannot find things *related to each other*.**

**The GraphRAG move — pre-compute the web.** Three stages, mapping exactly to the node's three named techniques:
1. **Entity linking / graph extraction** (ingestion-time): an LLM pass over chunks extracts entities ("checkpointer", "supervisor", "HITL gate") and typed relationships ("supervisor *routes to* Scheduler", "gate *protects* saves") → a knowledge graph of nodes and edges beside the vector index. Entity *linking* is the hard half: "the gate", "HITL approval", "human-in-the-loop check" must resolve to *one* node or the graph fragments into synonyms — and notice: **your wikilinks already did this by hand.** `[[hitl-interrupts]]` is a human-curated, pre-disambiguated edge. Your corpus was born linked; most corpora must have their graph *guessed* by an LLM (error-prone, expensive); yours has it *declared*. This is the "almost comically well-shaped" claim from Ch 14, now cashed out.
2. **Community detection + summaries**: graph algorithms cluster densely-connected regions into *communities* (your domains will emerge as natural communities — plus surprises: cross-domain clusters like "everything touching Pydantic" that no folder structure knows about). Then an LLM writes a **summary per community** — and stores it. *This* is the answer to global questions: "main themes across agents notes?" retrieves the agents-community summary — pre-computed synthesis, fished out like any chunk. The pile could never; the graph does it at ingestion, once.
3. **Hierarchical relationship indexing**: communities nest (sub-communities within domains; a root summary above all), giving query-time a *resolution dial* — global questions read high-level summaries, specific questions drop to entities and raw chunks, relational questions *walk edges* (the pre-computed multi-hop: "checkpointer → persists → state ← reads ← gate" is a path lookup, not a retrieval loop). Query routing decides the entry level — the routing drumbeat (Chs 9, 13, 14) plays its fourth verse.

**The honest costs — why this is a preview, not this ring's build.** Ingestion cost explodes: LLM extraction over every chunk + community summarization ≈ orders of magnitude more calls than embedding (your ledger instincts should wince — good). *Graph staleness* is nastier than index staleness: one edited note can re-wire edges and invalidate community summaries up the hierarchy (Ch 15's idempotency thinking, but transitive — a genuinely hard cache-invalidation problem). Extraction quality bounds everything (garbage edges → confident garbage walks — poisoned-at-birth, graph edition). And the adoption rule this volume has drilled: most corpora, most questions, plain hybrid RAG wins on cost-adjusted quality; GraphRAG earns its complexity when global/relational questions are *the workload*, not the exception. For your brain — a corpus that *is* a graph, queried by someone who thinks in connections — the case is unusually strong, which is exactly why the curriculum plants the seed here and schedules the build for later, when the frontier node regenerates against the field as-it-is (Rule 7 thinking, applied to technique choice).

## Why It Matters
Where this appears in real systems and jobs: when knowledge is a graph, not a pile, leveraging community summaries, entity linking, and hierarchical relationship indexing.

## Hands-On
Paper preview, three exercises: (1) *Extract by reading*: take three of your linked notes; hand-draw their entity-relationship graph — nodes, typed edges — using wikilinks as ground truth plus relationships you know but never linked (those gaps are what LLM extraction would add — and where it would err; mark which edges feel guessable vs fragile). (2) *Community intuition*: sketch your brain's likely community structure — the ten domains, then predict two *cross-domain* communities (Pydantic-everywhere? evaluation-everywhere?); write the one-paragraph community summary for one of them yourself — feel what the LLM would be asked to produce. (3) *The routing table*: six questions about your brain — two global, two relational, two specific — and per question: which resolution level answers it, and what plain-RAG would have done instead (fail, multi-hop expensively, or tie). Photos + table = the note; the note itself gets wikilinked richly — it's future ground truth.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the two question families the pile cannot answer, and the one-sentence diagnosis.
2. Map the three stages to the node's three named techniques, from memory.
3. Why is entity linking the hard half, and why is your corpus exceptional here?
4. What answers global questions in GraphRAG, and *when* is that answer computed?
5. State the adoption judgment: the costs, the workload that justifies them, and your honest verdict for the brain.


---

## Wikilinks
[[multi-hop-retrieval]]
[[ingestion-pipelines]]
[[rag-failure-modes]]
[[model-landscape]]
[[semantic-caching]]

## Status log
- Started: 2026-07-21
- Finished: null