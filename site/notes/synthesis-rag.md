## ELI5
Volume 01's synthesis explained the machine; Volume 02's explained the call. This one explains **the open book** — the full pipeline, one diagram, per the node summary: every stage from a markdown note being saved to a cited answer streaming out, with the failure modes and the metrics annotated in place. When you can draw this cold and narrate it in ninety seconds, you don't "know some RAG" — you own the most-hired-for architecture in applied AI, from ingestion verbs to eval arithmetic.

## The Real Explanation
A note is saved. The **ingestion pipeline** wakes [15]: markdown parsed structure-aware, wikilinks preserved, **chunked** along its own headers with heading-paths prepended and atomic units intact [3], content-hashed so only the changed survive re-embedding [15], **embedded** into meaning-coordinates [2], and seeded into **one Postgres** holding vectors, tsvectors, and metadata side by side [4, 6] — verified by assertions that fail loudly, because poisoned-at-birth is unfixable downstream [11, 15]. A question arrives, conversational and lazy; **query surgery** fixes it first — rewritten standalone against chat history, expanded or decoyed via HyDE when vocabulary mismatches, decomposed when compound, routed to a **multi-hop loop** when its second half depends on its first half's answer [13, 14]. **Filters** carve the structural slice — domain, date — pre-filter, never post, with slice-size visible and empty-slice fallback honest [12]. Two scouts search the slice: **semantic** nearest-neighbor through an ANN index whose speed↔recall dial you have personally turned [4, 8], and **BM25** keyword matching that still wins on jargon and identifiers [6]; their rankings — never their scores — fuse by **RRF** [7], and a **cross-encoder reranker** deep-reads the shortlist, promoting near-misses that cosine's separation could never see [9]. The survivors enter a **grounded prompt** — delimited as data, strict-context, refusal-permitted — and generation returns not prose but **claims with chunk-id citations**, validated for referential integrity, repaired or rejected, rendered with heading-paths a human can verify in seconds [5, 10]. The whole turn was first checked against a **semantic cache** — past answers, vector-searched, threshold tuned precision-first, invalidated by the provenance its own citations recorded [20]. And whether any of it *works* is never vibes: **context recall and precision** thermometer the retrieval organ, **faithfulness and relevance** the generation organ, judged by a calibrated judge against a golden set whose rows are your own diagnosed failures, and every change to any stage answers to the before/after table [16, 18]. Where the pile's shape fails — global themes, relational webs — the **graph** waits: entities your wikilinks already declared, communities summarized at ingestion, hierarchy walked instead of searched [19].

## Why It Matters
Where this appears in real systems and jobs: the full pipeline, one diagram.

## Hands-On
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every stage present, correctly ordered, failure-modes named where they live. **(b)** The napkin — *the node summary's literal demand*: one diagram, two lanes (ingestion lane: save→parse→chunk→hash→embed→seed→verify; query lane: rewrite→filter→hybrid→RRF→rerank→ground→cite→validate→render), the cache as a bypass valve at the query lane's mouth, the eval thermometers clipped to their organs, the graph sketched as the horizon box. Red-arrow the four failure families onto their stages [11]. Photograph into the note. **(c)** The 90-second spoken version — and know its audience: this is *the* answer to "design a system that answers questions over our company's documents," the single most common applied-AI interview question in existence. Record, critique, re-record. Any stage you glossed: reopen its chapter before lighting.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 90-second version cold.
2. Trace one query that hits: cache miss → rewrite → filter → hybrid → rerank promotes rank 6 → cited answer → cache store. Name every mechanism and its chapter.
3. Place all four eval metrics on the diagram as arrows — which organ, which direction.
4. For each failure family [11], point to its stage on your napkin and name its named fix.
5. Draw the napkin from memory.


---

## Wikilinks
[[synthesis-rag]]

## Status log
- Started: 2026-07-21
- Finished: null