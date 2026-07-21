## ELI5
"What did I write about checkpointers *in the agents domain* *after June*?" Half that question is meaning (checkpointers) — and half is **structure**: a domain tag and a date. Vector similarity cannot see structure; a filter cannot see meaning. Real retrieval, per the node summary, is both at once: **retrieval with structure** — semantic search *inside* a structurally-defined slice of the corpus. Small build, disproportionate power, and one sharp trap.

## The Real Explanation
**Metadata at birth, cashed in now.** Ch 3's craft rule — attach metadata when chunking — was the deposit; this is the withdrawal. Extend your `Chunk` model: `source: str, domain: str, doc_type: str, created: date, tags: list[str], heading_path: str`. For your corpus, `domain` maps beautifully to your brain's ten rings (a chunk from an agents note carries `domain="agents"`) — your curriculum's structure becomes your retrieval's structure, which is exactly the kind of alignment that makes systems feel inevitable.

**Pre-filter vs post-filter — the design decision.** *Post-filter*: retrieve top-k by similarity over everything, then discard non-matching. Broken in an obvious-once-you-see-it way: retrieve top-10, filter to `domain="agents"`, and if 9 of 10 came from other domains you're left holding one chunk — or zero. The filter starved the retrieval. *Pre-filter*: restrict the search space *first*, then rank top-k within the slice — always yields k results if the slice has k chunks, and it's what real engines do. In your brute-force store, trivial (filter the list, then cosine); in pgvector, it's Ch 4's promised WHERE-clause-plus-ORDER-BY in one query plan; dedicated engines expose filter parameters that do the same. (Deep footnote worth one sentence in your note: pre-filtering *inside ANN indexes* is genuinely hard — a filtered-out HNSW node still sits on the graph path — and engines handle it with varying grace; another axis your Ch 8 harness could measure someday.)

**The API.** `retrieve(query, filters: Filters | None)` where `Filters` is a small Pydantic model (equality, `IN`-lists, date ranges, tag-contains). Compose with everything already built: filters apply to *both* hybrid paths (semantic and BM25 — a keyword search also respects the slice), then RRF, then rerank. The stack stays decomposable.

**The trap — filter misfire, and the mitigation.** Ch 11 previewed it: a wrong or over-tight filter silently excludes the answer's partition, and the symptom (NOT-IN-NOTES) looks identical to genuine absence. Two mitigations, both cheap: **visibility** — `--show-work` prints the active filters and the *size of the filtered slice* ("searching 37 of 412 chunks where domain=agents") so an over-tight filter is seen, not suspected; **fallback honesty** — when a filtered search returns nothing, automatically re-run unfiltered and report *"nothing in [agents]; found this elsewhere:"* — never let structure make the system dumber than no structure. Write that sentence down; it's a design principle with a long life.

**The horizon (one paragraph, no build):** who *sets* the filters? Today: you, explicitly — correct for a CLI. In products, an LLM can parse "what did I note about RAG last month?" into `{domain:"rag-retrieval", created_after:...}` — structured output (Vol 02, Ch 6) aimed at query parsing; it's called self-query retrieval, it's Ch 13's query-surgery theme arriving early, and it's how filters reach users who'll never write one.

## Why It Matters
Where this appears in real systems and jobs: retrieval with structure — dates, tags, domains.

## Hands-On
Build it: extend `Chunk` + re-ingest with domain/date metadata → `Filters` model → pre-filtering in both paths → slice-size visibility → empty-slice fallback → tests (pre-vs-post: construct the 9-of-10-wrong-domain scenario and assert pre-filter returns k while post-filter starves; fallback fires on empty slice; date-range boundaries). Then the payoff session: five structured questions against your own brain — "checkpointers, agents domain only", "anything about testing, foundations domain, this month" — and one deliberate misfire: filter to a wrong domain, watch the fallback save the answer, screenshot it. Tag `rag-v0.4`.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why can't similarity see structure, and why can't structure see meaning? One example each.
2. Demonstrate post-filter starvation with the 9-of-10 arithmetic, and state what pre-filter guarantees.
3. Where does pre-filtering live in pgvector, and why is filtered-ANN genuinely hard?
4. Recite the two filter-misfire mitigations and the design principle behind the fallback.
5. What is self-query retrieval, and which two prior chapters does it compose?


---

## Wikilinks
[[chunking]]
[[vector-databases]]
[[build-hybrid-search]]
[[rag-failure-modes]]
[[structured-output]]

## Status log
- Started: 2026-07-21
- Finished: null