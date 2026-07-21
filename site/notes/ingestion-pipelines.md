## ELI5
Everything so far ingested a handful of files with a script you ran by hand and trusted on faith. Production RAG lives or dies at ingestion — Ch 11 taught you that poisoned-at-birth failures are unfixable downstream — and *your* production corpus is the brain itself: hundreds of markdown notes, growing weekly for years. This build, per the node summary: **parse markdown notes → clean semantic chunks → embeddings → seed pgvector — verified with chunk-length assertions.** The pipeline you build today is the one your brain will actually run on; treat it like the permanent infrastructure it is.

## The Real Explanation
**Stage 1 — Parse (markdown-aware, wikilink-aware).** Walk the notes directory; per file, parse *structure*: frontmatter/metadata if present, header tree, code blocks (atomic — never split, per Ch 3's craft rules), and — the corpus's soul — **[[wikilinks]]**: extract every one into the chunk's metadata (`links_to: list[str]`). You're not using them for retrieval yet; you're *preserving the graph* at ingestion so Ch 19 (GraphRAG) inherits a corpus that already knows its own edges. Ingestion decisions echo for rings — this one is deliberate foresight.

**Stage 2 — Chunk (clean and semantic, as the node demands).** Ch 3's header-aware strategy, industrialized: split on the header tree, prepend the full heading-path, respect atomic units, apply a token-budget ceiling per chunk (oversized sections get recursive sub-splitting with overlap), and *drop* junk (empty sections, pure-link stubs below a floor). "Clean" is enforced, not hoped — see verification.

**Stage 3 — Embed (batched, resumable).** Local model (Ch 2), batched properly — and here's where a real pipeline diverges from a script: **content-hash idempotency.** Per chunk, compute `hash(content)`; store it; on re-runs, *skip unchanged chunks* — re-embedding 400 untouched notes because one changed is amateur hour. This single design choice makes the pipeline safely re-runnable forever, turns "sync my brain" into a cheap incremental operation, and is the direct cure for Ch 11's stale-index disease: re-run often *because* re-running is nearly free. (Deleted/renamed notes: chunks whose source file vanished get purged — staleness works in both directions.)

**Stage 4 — Seed pgvector.** The Ch 4 schema, real at last: Docker Postgres + pgvector (your Ch 8 muscle memory), the `chunks` table with content, source, heading_path, domain, links_to, content_hash, created/updated timestamps, `vector(384)` — plus the `tsvector` column for the keyword path (Ch 6's co-location argument, cashed in: one table, both modalities) and an HNSW index. Batched upserts keyed on (source, chunk-index) — the pipeline *updates*, never blindly duplicates. Repoint your retrieval layer from the JSON store to Postgres behind the same `retrieve()` interface — if Chs 5–13's machinery runs unchanged on the new store, your abstraction was honest; that seamless swap is itself a verification.

**Stage 5 — Verify (the node's own criterion: chunk-length assertions, and friends).** A `verify()` stage that *fails the pipeline loudly* on violation — pipeline QA as code, not eyeballs: every chunk within [min_tokens, max_tokens] (the literal chunk-length assertion — catches both severed fragments and unsplit giants); no chunk begins mid-sentence (heuristic: first char uppercase-or-code); every chunk carries source + heading_path + domain; code blocks intact (backtick parity); wikilink extraction count matches a regex recount; DB row count == chunk count; and a **spot-check retrieval smoke test** — three known query→chunk pairs must hit at rank ≤3, or the seed is declared bad. Plus the report: per-run summary printed and logged — files seen, chunks new/updated/skipped/purged, token stats, timing. Observability at ingestion (the ledger habit from Vol 02 Ch 11, applied to a pipeline).

**Tests** (beyond the built-in verify): parser on a fixture note with nasty structure (nested headers, code containing `##`, wikilinks inside headers); idempotency (run twice → second run reports all-skipped, DB row count unchanged — *the* test that proves the hash design); the purge path; oversized-section sub-splitting respects overlap.

## Why It Matters
Where this appears in real systems and jobs: Build an ingestion pipeline that parses markdown note files, splits them into clean semantic chunks, generates vector embeddings, and seeds a pgvector database; verify with chunk length assertions.

## Hands-On
Build it as a real CLI: `python -m brainseed sync --notes ./brain --verify`. Then the inaugural full seed of your actual brain notes → read the report → run the smoke test → then the ritual that proves the design: edit one note, `sync` again, and watch the report say "1 file changed, 3 chunks updated, 400 skipped, 0.8s." That line is the build's trophy — screenshot it into the note. Repoint retrieval to Postgres, rerun your Ch 7 twelve-query table one more time as a regression check (the numbers should hold or improve; investigate any drop — real pipelines earn trust through regression, not vibes). Tag `rag-v0.5`. This pipeline now runs for the rest of your journey — you have just built the brain's digestive system.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why must wikilinks be captured at ingestion, and which chapter inherits them?
2. Explain content-hash idempotency: the mechanism, the cost it kills, and the Ch 11 disease it cures.
3. What does the seamless store-swap verify about your architecture?
4. Recite five verify-stage assertions and what specific birth-defect each catches.
5. Why is "pipeline QA as code that fails loudly" superior to eyeballing chunks — and where did eyeballing still appear in this volume, legitimately?


---

## Wikilinks
[[chunking]]
[[vector-databases]]
[[keyword-fulltext-search]]
[[rag-failure-modes]]
[[build-chat-with-my-brain]]

## Status log
- Started: 2026-07-21
- Finished: null