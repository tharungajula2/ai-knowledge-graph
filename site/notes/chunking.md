## ELI5
You can't embed a 200-page book as one vector — one pin can't hold two hundred pages of meaning; the embedding averages into mush. You can't embed every sentence alone either — "It increased by 40%" means nothing without the sentence before it. **Chunking** is deciding where to cut documents so each piece is (a) small enough to have *one* clear meaning, (b) big enough to *carry its own context*, and (c) shaped so that when retrieved, it actually answers questions. It looks like a preprocessing detail. It is, in practice, the highest-leverage quality dial in most RAG systems — bad chunks poison everything downstream, and no reranker can resurrect a fact that got severed in half.

## The Real Explanation
**The tension, named.** Small chunks → precise retrieval (the vector means one thing) but starved generation (the model receives fragments missing their context). Large chunks → rich generation context but blurry retrieval (multi-topic chunks average their meanings; Vol 01 Ch 5's geometry — a pin between two neighborhoods is in neither) plus wasted window (Vol 01, Ch 8). Every strategy below is a different resolution of this one tension. There is no universal best; there is best *for a corpus and question style* — and (Ch 16 foreshadow) the only way to know is to measure.

**The strategy ladder, per your node's summary:**
- **Fixed-size sliding window** — the baseline: cut every N tokens (say 500) with **overlap** (say 50–100) so sentences straddling a boundary survive in at least one chunk whole. Dumb, fast, surprisingly hard to beat; overlap is the load-bearing trick (duplicated storage is the cheap price for never severing a thought). Always measure in *tokens*, not characters — your `tokentools` habit.
- **Recursive / separator-aware** — the sane default in practice: try to split on paragraph breaks first, then sentences, then words, only forcing mid-sentence cuts as last resort. Respects the document's own thought-boundaries; this is what "RecursiveCharacterTextSplitter" in every framework actually does — now you know its soul.
- **Semantic chunking** — cut where *meaning shifts*: embed sentences, walk the document, and when consecutive-sentence similarity drops below a threshold, that's a topic boundary — cut there. Elegant, costs embedding calls at ingestion, shines on flowing prose without clean structure; overkill for well-structured docs.
- **Structure/hierarchy-aware (hierarchical splitters)** — exploit the document's skeleton: markdown headers, code functions/classes, HTML sections, legal clause numbering. Chunk = one section, and — the technique that pays forever — **prepend the heading path as context**: a chunk that begins "Domain 03 > Cluster: Fundamentals > chunking:" carries its location in its own text, so both the embedding and the reader know where it came from. For *your* corpus — markdown notes with headers and wikilinks — this is obviously the right family, and Ch 15's ingestion build will implement exactly it.
- **Parent-child (small-to-big)** — the tension, dissolved by refusing to choose: embed *small* chunks (precise search) but store a pointer to the *parent* section, and at query time retrieve by the small chunk while handing the model the big parent. Best of both, at the cost of bookkeeping. Remember this exists; it's the answer to a whole class of "my retrieval is precise but my answers lack context" complaints.

**Craft rules that survive every strategy:** never sever atomic units (a table row from its header, a code block mid-function, a Q from its A); attach **metadata** to every chunk at birth — source file, section, dates, tags — retrieval filters need it later (Ch 12) and it's nearly free now, expensive to retrofit; and eyeball twenty random chunks before embedding anything — thirty seconds of reading catches the mid-sentence massacres that no metric will explain politely.

## Why It Matters
Where this appears in real systems and jobs: slicing documents, sliding window strategies, semantic chunking, and hierarchical document splitters.

## Hands-On
Chunk one real document three ways — use one of your own long brain notes or your PROJECT_TRUTH doc: (a) fixed 300 tokens no overlap, (b) fixed 300 with 75 overlap, (c) header-aware with heading-path prepending (a ~20-line script: split on `##`, prepend the path). Print 5 random chunks from each and grade them by hand against one test: *"if this chunk alone were retrieved, could it answer a question about its content?"* Find the specific chunk in (a) where a sentence is severed mid-thought and its meaning died — then find that same sentence alive in (b). Write the three-way verdict in your note, and keep the header-aware script: it's the seed of Chapter 15's pipeline.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the small-vs-large tension and what each extreme starves.
2. Why is overlap load-bearing in the baseline? What exact failure does it prevent?
3. Recite the strategy ladder with each rung's one-line soul and its natural corpus.
4. What is parent-child chunking dissolving, and what does it cost?
5. Which strategy fits your own brain's notes, and name the two craft rules your Ch 15 pipeline must honor.


---

## Wikilinks
[[tokens]]
[[embeddings-hands-on]]
[[metadata-filters]]
[[ingestion-pipelines]]
[[rag-failure-modes]]

## Status log
- Started: 2026-07-21
- Finished: null