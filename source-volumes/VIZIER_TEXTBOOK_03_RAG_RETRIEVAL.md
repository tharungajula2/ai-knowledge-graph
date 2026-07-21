# THE VIZIER TEXTBOOK — VOLUME 03: RAG & RETRIEVAL

### Ring `rag-retrieval` · 22 nodes · Ground models in real knowledge: embeddings, vector search, citations

> **How to use this volume.** Same contract: one chapter = one node, read → Hands-On → Prove It from memory → Feynman note → light. This volume assumes Volume 01 (especially embeddings-as-geometry, hallucination, classical ML metrics) and Volume 02 (especially structured output, the gateway, golden sets). Your gateway from Volume 02 makes every LLM call in this volume; your `tokentools` prices every experiment. The floor keeps paying rent.

> **What "god mode" means for this domain.** After Volume 03: you can take any pile of documents and turn it into a system that answers questions *from those documents, with citations* — and, crucially, you can *measure* whether it's actually working instead of hoping. You'll know why retrieval fails, how to fix each failure mode by name, and when fancy techniques earn their complexity. The final arc is pure Vizier: RAG over your own brain's notes — the system you're building, studying itself. This is the single most in-demand applied-AI skill in enterprise hiring, and by the end of this ring you'll have built every layer of it by hand.

> **The one-sentence thesis of the whole ring** (from Vol 01, Ch 10 — carry it in): *stop asking the weights to be the database.* Everything in this volume is that sentence, engineered.

---

# PART I — RETRIEVAL FUNDAMENTALS
*5 chapters. The core pipeline, built once, honestly: why → vectors → chunks → the database → the first working RAG.*

---

## Chapter 1 — Why RAG Exists
**Node:** `why-rag` · concept · S

### The Feynman opener
Two exams. **Closed-book:** you answer from memory — fast, fluent, and where memory is thin you *improvise confidently* (sound familiar?). **Open-book:** you find the right page first, then answer *from the page* — slower, but checkable, and when the book doesn't cover it you can honestly say so. A bare LLM is a closed-book savant. **RAG — Retrieval-Augmented Generation — is handing it the open book:** find relevant passages first, put them in the context window, instruct "answer from these." The entire domain is the engineering of *finding the right page.*

### The real thing
**The three diseases RAG treats — be precise about them, because interviews will be.** (1) **Hallucination on thin knowledge** (Vol 01, Ch 10): the weights hold internet-frequent facts solidly and everything else as vibes; your company's refund policy, your codebase, your notes — the model has literally never seen them, but will still generate policy-shaped text on request. (2) **Staleness**: training ended at a cutoff; the world didn't. Weights can't learn tomorrow's price list. (3) **No provenance**: even a *correct* closed-book answer can't point at its source, and enterprise, legal, medical, and support use-cases don't just prefer citations — they're unshippable without them. Notice what all three share: they're not model-quality problems. A better model shrinks none of them fundamentally. They're *architecture* problems — the knowledge is in the wrong place.

**The RAG move, precisely.** Two phases. *Offline — ingestion*: take the knowledge (docs, notes, tickets), split it into chunks, embed each chunk (Vol 01, Ch 5 — meaning as coordinates), store text + vector in a store built for nearest-neighbor search. *Online — query time*: embed the user's question, retrieve the top-k nearest chunks, build a prompt — skeleton-style (Vol 02, Ch 3): system rules + retrieved chunks delimited as untrusted data + the question + "answer only from the provided context; say 'not found' if absent; cite which chunk supports each claim" — and generate. The generation task transforms: from *recall from weights* (vibes) to *read and synthesize from context* (a task models are dramatically better at). That transformation is the whole magic, and you witnessed it personally in Vol 01 Ch 10's hands-on. 

**Why RAG beats the alternatives for knowledge — the decision you'll defend in every interview.** *Vs fine-tuning* (Vol 01, Ch 7's map): fine-tuning shapes *behavior* — tone, format, domain voice — but is a terrible knowledge store: expensive per update (retrain to add a document?), no provenance, and doesn't reliably stop hallucination (the model learns your style of being wrong). RAG updates by *re-indexing one file* — seconds, not GPU-days — and every answer carries receipts. The mature answer: fine-tune for behavior, RAG for knowledge, and they compose. *Vs long-context stuffing* (Vol 02, Ch 15 — you've already done this drill): stuffing wins for small, session-shaped corpora; retrieval's flat per-query cost and focused context win at scale. RAG is Move 2, industrialized. 

**The honest cost — say it before anyone asks.** RAG adds an entire new failure surface: if retrieval misses, the model answers from a wrong or empty page — *grounded in garbage is still garbage*. The system is now only as good as its worst layer: chunking, embedding, search, prompt. That's not a reason to avoid RAG; it's the reason this ring has 22 nodes instead of 3, and why measurement (Ch 16, 18) is non-negotiable.

### Hands-On
Run the closed-book/open-book experiment *on your own knowledge*, end to end, no infrastructure — this is Vol 01 Ch 10's hands-on, upgraded with intent: pick 5 questions about your agent-lab's architecture (things you know, the model can't). Round 1, closed-book: ask your gateway directly; score the confident fiction. Round 2, open-book by hand: paste the relevant section of your PROJECT_TRUTH doc into the prompt with the grounding instructions above; score again. Round 3, sabotage: paste a *wrong* section (about a different component) and watch what happens — that's a retrieval miss, simulated, and its failure shape (fluent, plausible, wrong or evasive) is the enemy this whole volume trains you to catch. Three transcripts → the note.

### Prove It
1. Name the three diseases, and say why they are architecture problems, not model-quality problems.
2. Walk the two phases of RAG from memory — every step, offline then online.
3. What transformation happens to the generation task, and why are models better at the second task?
4. Make the RAG-vs-fine-tuning case in four sentences, ending with the compose answer.
5. What new failure surface does RAG buy, and what discipline does that make mandatory?

**Wikilinks for your note:** [[hallucination]] · [[embeddings-intuition]] · [[long-context-strategies]] · [[training-pipeline]]

---

## Chapter 2 — Embeddings Hands-on
**Node:** `embeddings-hands-on` · build · S

### The Feynman opener
Volume 01, Chapter 5 gave you the map-of-meaning as *intuition* — pins on a board, distance as similarity. Today the intuition becomes numbers in your terminal: you will embed real sentences, compute cosine similarity **by hand** (the node summary's exact demand), watch semantic neighbors emerge from arithmetic, and — most importantly — find the places where the geometry *surprises* you. Trust built by verification, not by faith.

### The real thing
**Getting vectors.** Two routes, use both this chapter: an embedding API through provider SDKs (Gemini offers embedding models on the free tier — your zero-cost reps continue), and a *local* model via the `sentence-transformers` library (`all-MiniLM-L6-v2` is the classic starter: small, fast, runs on your laptop, 384 dimensions). Local matters beyond cost: it's how you'll embed thousands of chunks in Ch 15 without rate-limit pain (Vol 02, Ch 10), and it removes the network from your experiments. Note what comes back: a plain list of floats. `len(vector)` is the dimension. That's all an embedding physically is.

**Cosine similarity by hand — the ritual.** The formula: cos(A,B) = (A·B) / (|A|·|B|) — dot product over the product of lengths. In code, once, with no library doing the thinking:
```python
import math
def cosine(a: list[float], b: list[float]) -> float:
    dot   = sum(x*y for x, y in zip(a, b))
    len_a = math.sqrt(sum(x*x for x in a))
    len_b = math.sqrt(sum(x*x for x in b))
    return dot / (len_a * len_b)
```
What it *means*: direction-agreement between two arrows from the origin — 1.0 = same direction (same meaning-direction), near 0 = unrelated. Why cosine and not plain distance: it ignores vector *length* (which can vary with text length and model quirks) and measures only *orientation* — meaning lives in direction. Two practical notes to bank now: many embedding models ship vectors pre-normalized to length 1, and then cosine similarity *equals* the raw dot product (cheaper — one multiply-add per dimension; this is why vector DBs often talk about "inner product"); and absolute similarity numbers are **model-relative** — 0.7 on one model ≠ 0.7 on another; only *rankings and contrasts within one model* mean anything. Never hardcode a "0.8 = related" threshold from folklore; derive thresholds from your own data (a golden-set instinct — Vol 02, Ch 16).

**The asymmetry that shapes real systems.** Questions and answers are *different kinds of text* — "What time is check-in?" and "Guests may access rooms from 2 PM" share meaning but not form. Good retrieval embeddings are trained on question↔passage pairs so these land close anyway; some models go further and want a task prefix or instruction ("query: ..." vs "passage: ...") to embed each side appropriately. Read your model's card; using a query-style embedding for passages (or ignoring required prefixes) is a silent quality killer that no error message will ever report.

### Hands-On (the artifact)
Build `similarity_lab.py`: embed ~15 sentences you write — clusters by design (3 about cricket, 3 about cooking, 3 about Python errors, 3 paraphrases of one idea in different words, and 3 curveballs: a Hinglish sentence, a sarcastic sentence, "My laptop won't turn on" + "computer fails to boot"). Compute the full 15×15 cosine matrix with *your own* function; print it as a heat-grid (text is fine). Verify: clusters light up, paraphrases score high despite zero word-overlap, the laptop pair confirms Vol 01 Ch 5's promise. Then hunt one *surprise* — a pair scored higher or lower than your intuition — and write two sentences on it (sarcasm and negation are classic embedding blind spots; finding one teaches you more than ten confirmations). Finally: sanity-check `cosine(v, v) == 1.0` in a pytest, plus a test that your function matches `numpy` dot-product on normalized vectors. Green + matrix + surprise = lit.

### Prove It
1. Write the cosine formula from memory and say what each part contributes.
2. Why direction rather than distance? What does length-normalization buy computationally?
3. Why are absolute similarity scores model-relative, and what practice does that forbid?
4. Explain the query↔passage asymmetry and the silent failure it causes.
5. What was your surprise pair, and what does it warn you about for retrieval quality?

**Wikilinks for your note:** [[embeddings-intuition]] · [[why-rag]] · [[vector-databases]] · [[prompt-quality]]

---

## Chapter 3 — Chunking
**Node:** `chunking` · concept · S

### The Feynman opener
You can't embed a 200-page book as one vector — one pin can't hold two hundred pages of meaning; the embedding averages into mush. You can't embed every sentence alone either — "It increased by 40%" means nothing without the sentence before it. **Chunking** is deciding where to cut documents so each piece is (a) small enough to have *one* clear meaning, (b) big enough to *carry its own context*, and (c) shaped so that when retrieved, it actually answers questions. It looks like a preprocessing detail. It is, in practice, the highest-leverage quality dial in most RAG systems — bad chunks poison everything downstream, and no reranker can resurrect a fact that got severed in half.

### The real thing
**The tension, named.** Small chunks → precise retrieval (the vector means one thing) but starved generation (the model receives fragments missing their context). Large chunks → rich generation context but blurry retrieval (multi-topic chunks average their meanings; Vol 01 Ch 5's geometry — a pin between two neighborhoods is in neither) plus wasted window (Vol 01, Ch 8). Every strategy below is a different resolution of this one tension. There is no universal best; there is best *for a corpus and question style* — and (Ch 16 foreshadow) the only way to know is to measure.

**The strategy ladder, per your node's summary:**
- **Fixed-size sliding window** — the baseline: cut every N tokens (say 500) with **overlap** (say 50–100) so sentences straddling a boundary survive in at least one chunk whole. Dumb, fast, surprisingly hard to beat; overlap is the load-bearing trick (duplicated storage is the cheap price for never severing a thought). Always measure in *tokens*, not characters — your `tokentools` habit.
- **Recursive / separator-aware** — the sane default in practice: try to split on paragraph breaks first, then sentences, then words, only forcing mid-sentence cuts as last resort. Respects the document's own thought-boundaries; this is what "RecursiveCharacterTextSplitter" in every framework actually does — now you know its soul.
- **Semantic chunking** — cut where *meaning shifts*: embed sentences, walk the document, and when consecutive-sentence similarity drops below a threshold, that's a topic boundary — cut there. Elegant, costs embedding calls at ingestion, shines on flowing prose without clean structure; overkill for well-structured docs.
- **Structure/hierarchy-aware (hierarchical splitters)** — exploit the document's skeleton: markdown headers, code functions/classes, HTML sections, legal clause numbering. Chunk = one section, and — the technique that pays forever — **prepend the heading path as context**: a chunk that begins "Domain 03 > Cluster: Fundamentals > chunking:" carries its location in its own text, so both the embedding and the reader know where it came from. For *your* corpus — markdown notes with headers and wikilinks — this is obviously the right family, and Ch 15's ingestion build will implement exactly it.
- **Parent-child (small-to-big)** — the tension, dissolved by refusing to choose: embed *small* chunks (precise search) but store a pointer to the *parent* section, and at query time retrieve by the small chunk while handing the model the big parent. Best of both, at the cost of bookkeeping. Remember this exists; it's the answer to a whole class of "my retrieval is precise but my answers lack context" complaints.

**Craft rules that survive every strategy:** never sever atomic units (a table row from its header, a code block mid-function, a Q from its A); attach **metadata** to every chunk at birth — source file, section, dates, tags — retrieval filters need it later (Ch 12) and it's nearly free now, expensive to retrofit; and eyeball twenty random chunks before embedding anything — thirty seconds of reading catches the mid-sentence massacres that no metric will explain politely.

### Hands-On
Chunk one real document three ways — use one of your own long brain notes or your PROJECT_TRUTH doc: (a) fixed 300 tokens no overlap, (b) fixed 300 with 75 overlap, (c) header-aware with heading-path prepending (a ~20-line script: split on `##`, prepend the path). Print 5 random chunks from each and grade them by hand against one test: *"if this chunk alone were retrieved, could it answer a question about its content?"* Find the specific chunk in (a) where a sentence is severed mid-thought and its meaning died — then find that same sentence alive in (b). Write the three-way verdict in your note, and keep the header-aware script: it's the seed of Chapter 15's pipeline.

### Prove It
1. State the small-vs-large tension and what each extreme starves.
2. Why is overlap load-bearing in the baseline? What exact failure does it prevent?
3. Recite the strategy ladder with each rung's one-line soul and its natural corpus.
4. What is parent-child chunking dissolving, and what does it cost?
5. Which strategy fits your own brain's notes, and name the two craft rules your Ch 15 pipeline must honor.

**Wikilinks for your note:** [[tokens]] · [[embeddings-hands-on]] · [[metadata-filters]] · [[ingestion-pipelines]] · [[rag-failure-modes]]

---

## Chapter 4 — Vector Databases
**Node:** `vector-databases` · concept · M

### The Feynman opener
Finding the nearest vectors among a thousand is a for-loop. Among fifty million, a for-loop is a coffee break per query. Vector databases exist to answer one question — *"which stored vectors are closest to this one?"* — in milliseconds at any scale, and they all pay for that speed with the same currency: **a little bit of perfection**. The node summary names the three machines to open up — pgvector, HNSW, IVF — and by the end of this chapter, none of them will be magic.

### The real thing
**Exact vs approximate — the founding tradeoff.** Brute force (compare query to *every* vector) is **exact**: the true top-k, guaranteed, at O(N) cost per query. Fine to ~100k vectors, dead at millions. Everything beyond brute force is **ANN — approximate nearest neighbor**: clever data structures that check only a tiny fraction of vectors and *usually* find the true neighbors. The honesty metric is **recall@k** — of the true k nearest, what fraction did the index return? 0.95 recall = 5% of the time a true neighbor was skipped. Speed↔recall is a *dial*, not a fact of nature — every index below exposes knobs that trade one for the other, and Ch 8's benchmark build will have you turning them with your own hands.

**Machine 1 — IVF (inverted file index): the postal system.** Ingestion: cluster all vectors into, say, 1,000 neighborhoods (k-means finds the centroids); each vector files into its nearest centroid's bucket. Query: compare the query to the 1,000 centroids only, pick the nearest few neighborhoods (`nprobe` — the dial), and brute-force *inside just those buckets*. You searched ~1% of the data. The failure mode is geometric and intuitive: a true neighbor sitting just across a neighborhood border gets missed when `nprobe` is low — raise `nprobe`, recall climbs, speed falls. Needs periodic retraining as data drifts (centroids go stale). Simple, memory-light, honest.

**Machine 2 — HNSW (hierarchical navigable small world): the highway system.** A graph, not buckets: every vector is a node linked to its near neighbors, arranged in *layers* — top layers sparse with long-range "highway" links, bottom layer dense with local streets. Query: enter at the top, greedily hop toward the query (each hop: move to whichever neighbor is closest to the target), drop down a layer, repeat — like flying city-to-city, then driving neighborhood streets. Logarithmic-ish hops instead of linear scans; this is the reigning default in most modern vector stores. Dials: `M` (links per node — more = better graph, more memory) and `ef_search` (how wide the greedy search beam is — the recall↔speed dial you'll tune in Ch 8). Costs: the graph lives in RAM (the memory-hungry option) and inserts are pricier (wiring a new node into the graph) — a classic "fast reads, slower writes" trade.

**Machine 3 — pgvector: the "you already have a database" answer.** Not a new engine — an extension adding a `vector` column type to Postgres, plus distance operators and both index types above (IVFFlat and HNSW). One `CREATE EXTENSION vector;` and your boring, beloved relational DB does nearest-neighbor:
```sql
CREATE TABLE chunks (
  id bigserial PRIMARY KEY,
  content text,
  source  text,
  tags    text[],
  embedding vector(384)
);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);

SELECT content, source, 1 - (embedding <=> $query) AS similarity
FROM chunks
WHERE 'agents' = ANY(tags)                -- metadata filter, in the SAME query (Ch 12!)
ORDER BY embedding <=> $query             -- <=> is cosine distance
LIMIT 5;
```
Why engineers love it: vectors live *next to* your relational data — one database, real transactions, SQL joins, and metadata filtering in the same query plan (that WHERE clause is Chapter 12's entire topic, available for free). Why it's not always the answer: at very large scale (hundreds of millions of vectors, extreme QPS), dedicated engines with distributed architectures pull ahead. The landscape in one breath: **pgvector** (SQL-native, pragmatic default for most products), **FAISS-style libraries** (raw index in your process — no server at all; maximum control, you own persistence), **embedded stores like Chroma** (developer-friendly local default), **client-server/managed engines** (Qdrant, Weaviate, Milvus, Pinecone — scale, ops features, money). Ch 8 benchmarks three of these families with your own corpus; until then, the axes matter more than the brand names.

**One quiet superpower to bank:** a vector DB stores *any* embeddings — text today, but images, audio, user-behavior vectors tomorrow. The machine is "nearest neighbor at scale"; text search is merely its most famous customer. (And semantic caching — Ch 20 — is this same machine pointed at *queries* instead of documents.)

### Hands-On
No infrastructure yet (Ch 5 builds; Ch 8 benchmarks) — today is mechanism-on-paper, Feynman-style: (1) draw IVF — 12 dots in 3 clusters, a query point, shade the searched bucket, and *place a true neighbor just across the border* to illustrate the recall miss; annotate where `nprobe` lives. (2) Draw HNSW — 3 layers, highways on top, streets below, and trace a query's greedy path with arrows. (3) Write the pgvector schema for *your brain's chunks* (columns you'll actually need: content, source path, domain tag, wikilinks array, embedding) — this exact schema gets built for real in Ch 15. (4) Fill a 4×4 comparison table from memory: {IVF, HNSW, brute} × {how it searches, the dial, the cost, when it wins}. Photos + schema + table = the note.

### Prove It
1. Define recall@k and explain why every ANN index is a dial, not a verdict.
2. Explain IVF's mechanism and its geometric failure mode; name the dial.
3. Explain HNSW's layered greedy search with the highway metaphor; name both dials and the RAM cost.
4. Make the case for pgvector in three sentences, and the case against it in one.
5. What makes the WHERE-clause-plus-vector-search combination special, and which chapter cashes it in?

**Wikilinks for your note:** [[embeddings-hands-on]] · [[chunking]] · [[build-vector-db-benchmark]] · [[metadata-filters]] · [[classical-ml-fundamentals]]

---

## Chapter 5 — Build: First RAG Pipeline
**Node:** `build-first-rag` · build · M

### The Feynman opener
Four chapters of parts on the workbench: the why, the vectors, the chunks, the store. Today they become a machine — **ingest → embed → store → retrieve → answer**, the five verbs of the node summary, wired end to end with your own hands and *no framework*. When LangChain-style abstractions appear later in your journey, they'll be conveniences over a machine you've personally assembled — never magic. This is the ring's first working RAG, and the honest baseline every later chapter improves.

### The real thing — the spec
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

### Hands-On
Build it — suggested order: ingest+chunk (Ch 3's script grows up) → embed+store with the local model → retrieve (your cosine, a sort, top-k) → the grounded prompt via your gateway → `--show-work` → the ten-question inspection session, transcribed honestly into the note with each query labeled {hit | near-miss | vocab-miss | correct-refusal} → tests green → tag `rag-v0.1`. Estimated one honest day. Keep the ten labeled queries safe: they are the embryo of Ch 16's golden set and Ch 18's eval build — your measurement story starts with this exact list.

### Prove It
1. Recite the five verbs and each one's input → output.
2. Justify every clause of the grounded prompt — four clauses, four reasons, four chapter citations.
3. Why brute force *now* and indexes *later*? What does the primitive store let you feel?
4. Describe one near-miss from your inspection session and diagnose it with Ch 3's vocabulary.
5. State the operational habit this build installs, and why answer-reading alone can't debug RAG.

**Wikilinks for your note:** [[why-rag]] · [[chunking]] · [[embeddings-hands-on]] · [[build-gateway]] · [[rag-failure-modes]]

---

# PART II — RETRIEVAL, SERIOUSLY
*11 chapters. The baseline works; now make it good — old keyword magic, hybrid fusion, benchmarks, rerankers, citations, the failure taxonomy, filters, query surgery, multi-hop, the industrial pipeline, and the beginning of measurement.*

---

## Chapter 6 — Keyword & Full-Text Search
**Node:** `keyword-fulltext-search` · concept · S

### The Feynman opener
Plot twist for a volume about vectors: the search technology from *before* embeddings — matching literal words, scored cleverly — still beats semantic search outright on a huge class of queries, and every serious RAG system ships both. The node calls it old magic that still wins. Time to learn why the old magic works, because Chapter 7 fuses it with the new.

### The real thing
**Where vectors go blind.** Embeddings compress meaning — and compression discards *exact identity*. Search your brain for `HNSW` or `ef_search`, an error string like `ECONNREFUSED`, a version number, an invoice ID, a person's name: semantic search retrieves things *about the same topic* while missing the chunk containing *the literal token* — because in meaning-space, `ef_search` and `nprobe` are neighbors, which is precisely wrong when you asked for one of them. Exact identifiers, jargon, codes, names: keyword territory, forever. (Flip side: keyword search is the one that's blind to "laptop won't turn on" ↔ "computer fails to boot." Two blindnesses, perfectly complementary — hold that thought for one chapter.)

**BM25 — the reigning king of keyword scoring, demystified.** Three intuitions stacked (each one a Vol 01, Ch 13 echo — this is TF-IDF's direct descendant, alive and winning):
1. *Term frequency, saturating*: a chunk mentioning your query word 3 times beats one mentioning it once — but 50 mentions isn't ~17× better than 3; BM25's TF term flattens out (diminishing returns), which is what made it robust where raw counting was spammable.
2. *Inverse document frequency*: rare words carry the query. In a corpus about your brain, `the` matches everything (worth ~nothing); `checkpointer` matches three chunks (worth gold). Score weight ∝ rarity across the corpus.
3. *Length normalization*: a 2,000-word chunk gets more word-lottery tickets by sheer size; BM25 penalizes length so a tight 100-word chunk with your terms beats a rambling giant that mentions them in passing.
Score = sum over query terms of (saturating TF × IDF × length-norm). That's the whole king. Decades old, brutally fast (inverted index: word → list of chunks containing it — the same structure as a book's index page), zero GPU, zero embedding model, and *interpretable* — you can always see exactly why a chunk matched, a debugging luxury vectors never grant.

**Full-text search in practice — the plumbing names.** Postgres ships it natively: `tsvector` (a processed column: text → stemmed, stop-worded, indexed lexemes — "running", "runs", "ran" all become `run`) + `tsquery` (the parsed query) + a GIN index for speed, with `ts_rank` scoring. Which means — pgvector chapter callback — **one Postgres can serve both search modalities on the same table**: a `tsvector` column beside your `vector(384)` column, keyword and semantic queries against the same chunks. That co-location is exactly what makes Chapter 7's hybrid build clean, and it's a real architectural argument in pgvector's favor that you can now articulate. (Elsewhere in the landscape: Elasticsearch/OpenSearch built empires on this; SQLite has FTS5; every one is BM25-or-cousin under the hood.)

**Stemming's sharp edge:** the same normalization that unifies run/running/ran can mangle jargon and code tokens (`embedding` → `embed` is fine; but stemmers can butcher identifiers like `ef_search`, and stop-word lists can eat meaningful short tokens). For technical corpora — yours — configure keyword search to preserve code-flavored tokens, or search both raw and stemmed. A tiny config detail with outsized retrieval consequences; you'll set it deliberately in Ch 7's build.

### Hands-On
A rigged duel, on your Ch 5 corpus, no new infrastructure (a ~30-line BM25 is a fine exercise, or use the `rank_bm25` library against your chunks): write 8 queries — 4 rigged for keywords (exact jargon from your notes: `checkpointer`, an error string, a node id like `build-gateway`, a tool name), 4 rigged for semantics (paraphrases using none of your notes' vocabulary: "how does the agent ask permission before acting?"). Run all 8 through *both* your Ch 5 vector retrieval and BM25; record which system wins each, side by side. Expected shape: a clean 4–4 split along exactly the lines this chapter drew — verify against reality, note any upset honestly. That 8-row table is Chapter 7's opening argument, written by your own corpus.

### Prove It
1. Name three query types where keyword search structurally beats semantic, and explain the compression argument for why.
2. Recite BM25's three stacked intuitions and what abuse each one defends against.
3. What is an inverted index, and what interpretability luxury does keyword search grant?
4. What are `tsvector`/`tsquery`/GIN, and why does their co-location with pgvector matter architecturally?
5. Where does stemming bite technical corpora, and what will you configure differently for your brain?

**Wikilinks for your note:** [[nlp-transformer-lineage]] · [[vector-databases]] · [[build-hybrid-search]] · [[embeddings-hands-on]]

---

## Chapter 7 — Build: Hybrid Search & RRF
**Node:** `build-hybrid-search` · build · M

### The Feynman opener
Two scouts searched your library: one hears *meaning*, one sees *exact words*. Each returned a ranked list; each is blind where the other is sharp. The naive merge — compare their scores — fails immediately: cosine's 0.83 and BM25's 12.4 live on incommensurable scales; averaging them is adding rupees to kilometers. The elegant fix, and this build's namesake: **ignore scores entirely, fuse the *rankings*.** Reciprocal Rank Fusion — a formula small enough to memorize in ten seconds and strong enough to run inside serious production search engines.

### The real thing
**RRF, whole and entire.** For each document, sum over every ranked list it appears in:
**RRF(d) = Σ 1/(rank_in_list + k)**, with k ≈ 60 by convention.
Rank 1 in one list contributes 1/61; rank 5 contributes 1/65; absent contributes 0. Sort by total; done. Why it works, three properties worth internalizing: (1) *scale-free* — only positions matter, so any two (or five) retrieval systems can fuse without score-normalization gymnastics; (2) *consensus-rewarding* — a document ranked #3 by both scouts typically beats one ranked #1 by a single scout and invisible to the other, which is exactly the behavior you want when each scout has blind spots; (3) *the k constant is a diplomacy dial* — it flattens the difference between adjacent ranks (1/61 vs 1/62 is tiny), preventing any single list's #1 from steamrolling the consensus; smaller k = trust top ranks harder, larger k = flatter, more democratic. Convention says 60; your build will test that convention instead of inheriting it.

**The build — the spec, per the node summary.** Upgrade your Ch 5 pipeline's `retrieve` into a three-path engine:
1. **Semantic path**: your existing cosine top-20 (deliberately deep — fusion wants long lists to find consensus in; you'll truncate *after* fusing).
2. **Keyword path**: BM25 top-20 over the same chunks (Ch 6's duel code, promoted to production; apply your stemming-vs-jargon decision here, deliberately, in a comment that explains it).
3. **Fusion**: `rrf_fuse(lists: list[list[ChunkId]], k: int = 60) -> list[Scored]` — pure function, no I/O, dead simple, *perfectly testable*.
Then `retrieve(query, mode="hybrid" | "semantic" | "keyword")` — keeping all three modes callable is the point: every future debugging session and Ch 8's benchmark will want to ask "which path found this / missed this?" A retrieval system you can't decompose is a retrieval system you can't debug.

**Verification — against test queries, as the node demands.** Your Ch 6 duel table is the seed: those 8 rigged queries, plus 4 new *mixed* queries (jargon + paraphrase in one question: "how does the checkpointer thing let agents survive crashes?" — queries where *neither* scout alone suffices and hybrid should shine). For each of the 12: run all three modes, record rank-of-the-correct-chunk under each. Success criteria, stated before running (golden-set discipline, Vol 02 Ch 16): hybrid's correct-chunk rank ≤ the better single mode on ≥10 of 12, and strictly better than *both* on the mixed queries. Then turn the diplomacy dial: rerun at k=10 and k=200, watch rankings shift, write two sentences on what k trades. Pytest the pure function hard: known toy lists → hand-computed RRF scores; consensus-beats-single-champion case; absent-document handling; k monotonicity.

**Two honest footnotes for the note.** Hybrid isn't free: two searches per query (though both are fast and parallelizable — `asyncio.gather`, Vol 01 Ch 17, if the paths ever grow network calls). And fusion quality is capped by candidate quality — RRF re-orders what the scouts brought; it cannot summon a chunk neither found. Fixing *that* requires better queries (Ch 13) or a second-pass judge (Ch 9) — the ladder continues.

### Hands-On
The spec is the hands-on: BM25 path → pure `rrf_fuse` with tests-first (feel how pleasant testing a pure function is — Vol 01 Ch 21's philosophy vindicated) → three-mode retrieve → the 12-query verification table with success criteria written down beforehand → the k experiment → `--show-work` upgraded to display *both paths' ranks plus fused rank* per chunk (the inspection window grows with the system — permanent habit) → tag `rag-v0.2`. The 12×3 table and the k-sentences go in the note.

### Prove It
1. Why is score-averaging across retrievers broken, and what does RRF use instead?
2. Write the RRF formula from memory and walk one document's score through two lists.
3. Name the three properties, and explain the diplomacy dial's tradeoff with your k-experiment evidence.
4. What can fusion never do, and which two future chapters address that ceiling?
5. Why keep all three modes callable forever?

**Wikilinks for your note:** [[keyword-fulltext-search]] · [[build-first-rag]] · [[reranking]] · [[prompt-quality]]

---

## Chapter 8 — Build: Vector Database Benchmark
**Node:** `build-vector-db-benchmark` · build · M

### The Feynman opener
Chapter 4 taught the machines on paper; vendors' blog posts all claim theirs is fastest. Time for the only opinion that matters: **your corpus, your queries, your stopwatch.** This build compares pgvector, a FAISS-style local index, and an embedded Chroma-style store on recall@k and latency — and its real product isn't the winner's name; it's *the harness itself*, a reusable instrument, and the experience of watching the speed↔recall dial move under your own fingers. This is Vol 01 Ch 12's "measure honestly" doctrine, aimed at infrastructure.

### The real thing — the spec
**Corpus & ground truth.** Your chunks are too few for indexes to sweat, so synthesize scale: your real chunks plus generated filler to ~50k–100k vectors (embed sentences from any large public text, or generate variations — the *distribution* matters less than the volume). Then the keystone: **ground truth = brute force.** For 100 test queries (mix your real 12 from Ch 7 with sampled synthetics), compute the *true* top-10 by exhaustive cosine — slow, exact, run once, cached to disk. Every index is scored against this truth. Recall@10 = |index's top-10 ∩ true top-10| / 10, averaged over queries. (Notice the quiet lesson: you can only measure approximation because you kept an exact method alive — Ch 5's "primitive on purpose" store just became your measuring stick.)

**The contenders, one interface.** Vol 01 Ch 16 discipline — a base class so the harness never cares who it's timing:
```python
class VectorIndex(ABC):
    def build(self, vectors, ids): ...
    def search(self, query_vec, k) -> list[id]: ...
```
Implement three: **PgVectorIndex** (Postgres + pgvector in Docker — your first real Docker use; one `docker run` with the pgvector image, connection via `psycopg`; test HNSW, and IVFFlat if time permits), **FaissStyleIndex** (the `faiss` library in-process: `IndexFlatIP` for exact, `IndexHNSWFlat` for ANN — no server, pure library), **ChromaStyleIndex** (embedded Chroma: `pip install chromadb`, persistent local store, developer-experience contender). Plus **BruteForce** as the reference implementation of the same interface.

**What to measure — and how to time honestly.** Per contender: build time (ingestion cost — it differs wildly and matters for re-index-often corpora), then per-query latency as **p50 and p95, never mean** (one GC pause poisons a mean; p95 is what your slowest users feel — this vocabulary is production-domain currency, bank it now), recall@10 against ground truth, and RAM footprint (rough: process RSS before/after build). Timing hygiene: warm up each index with 20 throwaway queries first (cold caches lie), then time the 100. **Then the chapter's soul — turn the dial**: for HNSW (in both FAISS and pgvector), sweep `ef_search` across ~{16, 64, 256}; watch recall climb toward 1.0 as p95 latency climbs with it. Plot or table recall-vs-latency per setting. That curve — capability as a *frontier you choose a point on*, not a spec you read — is the single deepest thing this build teaches, and it generalizes to every engineering tradeoff in your career.

**The report — comparative performance, per the node.** `benchmark_report.md`, generated by the harness (tables from dicts — Vol 01 Ch 15 plumbing): environment notes (hardware matters; say what you ran on), corpus size, per-contender {build time, p50, p95, recall@10, RAM}, the ef_search sweep table, and a *recommendation paragraph with reasoning* — which store for your brain at 1k chunks today, and would the answer change at 10M? (Spoiler shape you should be able to predict from Ch 4 before running: at small scale everything is fast and the answer is developer ergonomics + the pgvector co-location argument; the interesting divergences appear at scale and under the dial. Verify against reality; report surprises honestly.)

**Tests:** the harness itself gets pytest — BruteForce recall must equal 1.0 exactly (if not, your ground truth or your recall math is broken — a self-checking instrument); interface compliance per contender; recall math on a tiny hand-computed case.

### Hands-On
The spec is the hands-on: ground truth first → interface + BruteForce (self-check green) → FAISS (easiest) → Chroma → pgvector-in-Docker (budget half the build's time here; the Docker+psycopg friction *is* curriculum — your production domain will thank you) → measurements → the sweep → the report. Tag `rag-bench-v0.1`. The report and the recall-vs-latency curve go in the note — and the recommendation paragraph is interview gold verbatim: "I benchmarked three vector stores on my own corpus" is a sentence almost no candidate can say.

### Prove It
1. Why must ground truth be brute force, and what does BruteForce-recall-equals-1.0 verify about your instrument?
2. Define recall@10 precisely and compute it for: index returns {1,2,3,4,5,6,7,8,9,11}, truth is {1..10}.
3. Why p95 over mean? Whose experience does each number describe?
4. Describe your ef_search sweep results and state the frontier lesson in one sentence.
5. Your recommendation and reasoning — for today's brain, and for 10M chunks. Defend both.

**Wikilinks for your note:** [[vector-databases]] · [[embeddings-hands-on]] · [[classical-ml-fundamentals]] · [[build-hybrid-search]]

---

## Chapter 9 — Reranking
**Node:** `reranking` · concept · S

### The Feynman opener
Hiring: you don't deep-interview all 500 applicants — you skim resumes to a shortlist of 20, *then* interview those carefully. Retrieval so far has been resume-skimming: fast, cheap, over the whole corpus, and only roughly right. **Reranking is the interview**: a second, slower, smarter model that takes the shortlist and re-orders it properly. The node summary calls it the second pass that fixes retrieval quality — and the reason it can fix what the first pass can't is an architectural distinction worth owning cold.

### The real thing
**Bi-encoder vs cross-encoder — the distinction that explains everything.** Your retrieval embeddings are a **bi-encoder**: query and document embedded *separately* (documents at ingestion, query at question time — they never meet), compared only afterward by cosine. That separation is precisely what makes million-scale search possible (documents pre-computed once) — and precisely what caps quality: each side is compressed to a single vector *with no knowledge of the other*; nuance about *this query against this document* is unrepresentable. A **cross-encoder** feeds query and document *together* into one transformer — full attention between every query token and every document token (Vol 01 Ch 6, earning its keep again) — and outputs one relevance score. It can see that the document mentions your exact identifier, answers the question's specific angle rather than its general topic, or merely name-drops the subject in passing. Dramatically better judgments — at a cost that forbids first-pass use: it must run *per query-document pair*, so scoring a million documents means a million transformer passes. Hence the two-stage architecture the whole industry converged on: **bi-encoder (or hybrid, Ch 7) casts a wide cheap net over everything → cross-encoder deep-reads the top 20–50 → final top-k goes to the LLM.** Recall first, precision second — and notice those are exactly Vol 01 Ch 12's words: stage one is engineered for high recall (don't miss the answer), stage two for precision (rank it first).

**Where rerankers earn their latency.** They fix: *near-miss ordering* (right chunk retrieved at rank 7, and rank 7 doesn't fit your top-4 prompt — the reranker promotes it; recall from Ch 5's inspection that "retrieved but badly ranked" was a whole failure category); *topical-but-useless* results (mentions your subject, answers nothing — cross-attention detects the difference); *fusion ties* (RRF consensus produces close calls; the interview breaks them with actual reading). They cannot fix: **what the net never caught** — reranking is re-ordering, and Ch 7's ceiling theorem applies with full force: no interview saves a candidate who never applied. Widen the net (retrieve 50 to rerank, not 10), fix queries (Ch 13), or fix chunks (Ch 3) for that. Practical menu, axes not brands: local open cross-encoders via `sentence-transformers` (`CrossEncoder` class — free, private, milliseconds-per-pair on CPU for small models), hosted reranker APIs (stronger, per-call cost), and LLM-as-reranker (prompt your gateway: "score each passage's relevance 0–10" — flexible, slowest, priciest; fine for experiments, rarely first choice in production; and note it's Vol 02 Ch 16's LLM-as-judge wearing a retrieval hat, biases included).

**The knobs:** how many to rerank (20–50 is the sweet spot — deep enough to catch near-misses, shallow enough to stay fast; your Ch 8 latency instincts price this exactly: N cross-encoder passes added to p95), and whether to rerank at all — for keyword-exact queries where BM25's top-1 is definitionally correct, an interview adds latency and nothing else. Retrieval quality is a ladder you climb *as far as the query needs*: hybrid → +rerank → +query-rewriting (Ch 13) — each rung paid for by evidence (Ch 16), never by fashion.

### Hands-On
No new build node — a surgical experiment inside your existing pipeline (~20 lines): load a small `CrossEncoder` model, add `retrieve(..., rerank=True)` that fetches hybrid top-20 and re-orders via cross-encoder before truncating to 4. Rerun your 12-query table from Ch 7 as a fourth column: rank-of-correct-chunk under {semantic, keyword, hybrid, hybrid+rerank}. Find one query where reranking *promoted a rank-5+ chunk into the top-4* — read that chunk and its displaced rival side by side, and write two sentences on what the cross-encoder saw that cosine couldn't. Time the rerank overhead per query and record it next to the quality gain. Table column + the two sentences + the ms figure = the note.

### Prove It
1. Bi-encoder vs cross-encoder: what does each see, and what does the separation buy and cost?
2. Why can't cross-encoders be the first pass? Show the arithmetic shape of the objection.
3. Map recall and precision onto the two stages, citing Vol 01 Ch 12.
4. Three failure types reranking fixes, one it structurally cannot, and the remedy ladder for that one.
5. When would you *disable* reranking, and what evidence standard governs the whole ladder?

**Wikilinks for your note:** [[build-hybrid-search]] · [[attention-transformers]] · [[classical-ml-fundamentals]] · [[query-rewriting-hyde]]

---

## Chapter 10 — Citations & Grounding
**Node:** `citations-grounding` · build · S

### The Feynman opener
Two support bots give the same correct answer. One says it. The other says it *and points at the policy document, section 4.2*. Only the second is shippable to an enterprise — because only the second lets a human *verify without trusting*. The node summary is the whole philosophy: **every answer points at its source.** Your Ch 5 prompt already asked for bracket-citations; this build makes citations *structural, validated, and honest* — the difference between decoration and evidence.

### The real thing — the spec
**Citations as structure, not prose.** Asking for "[3]" in text was rung 1 (Vol 02 Ch 6's ladder — you know where this goes). The build: structured output with per-claim attribution.
```python
class Claim(BaseModel):
    text: str
    chunk_ids: list[int]                  # which retrieved chunks support THIS claim

class GroundedAnswer(BaseModel):
    claims: list[Claim]
    not_in_notes: bool = False            # honest-failure, promoted to a FIELD
```
Prompt: chunks delimited with visible ids and heading-paths (Ch 5's format), instruction "decompose your answer into claims; for each claim list the ids of chunks that support it; a claim with no supporting chunk must not appear." Schema-enforced via your gateway (Vol 02 Ch 6/11). The decomposition into claims isn't cosmetic — it's what makes the next part possible.

**The validation layer — where citations become trustworthy.** Model-emitted citations are model output, and the boundary law (Vol 02, Ch 6) applies: *untrusted until validated*. Three checks, escalating in strictness: (1) **referential integrity** — every cited id ∈ the ids actually retrieved this call (a hallucinated citation `[17]` when you provided 4 chunks is instantly catchable garbage — catch it, trigger the repair loop); (2) **existence** — every claim has ≥1 citation, or the answer is rejected/repaired (this is the "must not appear" rule, enforced rather than hoped); (3) **support spot-check** — the hard one, previewed here and industrialized in Ch 16: does the cited chunk *actually contain* support for the claim? A cheap heuristic now (claim keywords ∩ chunk text — crude, catches the worst offenders); the real machinery (faithfulness scoring) is two chapters away and this field structure is exactly what it will consume. Design note worth writing down: **you structured the output *so that* verification became mechanical.** That's a deep pattern — schemas aren't just parsing convenience; they're what makes downstream *checking* possible at all.

**Rendering — the human contract.** Terminal output: each claim followed by its sources as `[source.md > heading-path]` (the heading-path metadata from Ch 3, cashing in — a citation naming the *section* is verifiable in seconds; one naming just a file is homework). A `--sources` flag prints each cited chunk's full text beneath the answer: verification-without-trust, delivered. And the honest-refusal path renders proudly, not apologetically: `NOT IN NOTES — no relevant content found for this question` is a *feature* — in enterprise RAG, a system that visibly declines beats one that quietly invents, every single time, and you should be able to argue that in an interview with this build as evidence.

**Tests:** referential-integrity catch (feed a mocked model-response citing id 99 → repair loop fires); uncited-claim rejection; `not_in_notes=True` produces zero claims; rendering includes heading-paths; and the end-to-end sanity: a question whose answer you know spans two chunks yields claims citing both.

### Hands-On
Build it into the pipeline (this replaces Ch 5's prose-bracket approach): schema → prompt → validation layer with repair → rendering + `--sources` → tests green → then the session that makes it real: 8 questions about your own notes, and for each, *actually click through* — read every cited chunk and grade every citation {supports | partially | doesn't}. Count the honest tally. If you find a "doesn't" (you likely will), celebrate it in the note: you've just caught, with your own instrument, the exact failure class that Ch 16's faithfulness metric measures at scale — your validation heuristic and your eyes did it first. Tag `rag-v0.3`.

### Prove It
1. Why claims-with-ids instead of prose brackets? Name what the structure *enables*, not just what it tidies.
2. Recite the three validation checks in order of strictness and what each catches.
3. State the deep design pattern about schemas and verification in one sentence.
4. Why does the heading-path make citations verifiable, and which chapter's metadata habit paid for it?
5. Make the enterprise argument for visible refusal over quiet invention.

**Wikilinks for your note:** [[build-first-rag]] · [[structured-output]] · [[chunking]] · [[rag-evals-intro]] · [[hallucination]]

---

## Chapter 11 — RAG Failure Modes
**Node:** `rag-failure-modes` · concept · S

### The Feynman opener
Your RAG answered wrong. Where do you even look? A RAG system is a chain of six-plus stages, any of which can silently fail while every other stage works perfectly — and the final answer looks identical in all cases: fluent, confident, wrong. This chapter is the **diagnostic taxonomy**: every named failure, its symptom, its stage, its fix. You've already *met* half of these in your own inspection windows; today they get names, and debugging RAG stops being archaeology and becomes differential diagnosis.

### The real thing — the taxonomy, stage by stage
**Ingestion failures — poisoned at birth.** *Bad parsing*: PDFs mangling tables into token soup, headers merged into body text, code blocks shattered — garbage entered the index looking like content; no downstream stage can un-mangle it. Symptom: retrieved chunks that are visibly broken text. Fix: parse-stage QA — eyeball chunks at ingestion (Ch 3's thirty-second rule), format-aware parsers. *Stale index* (the node names it): the document changed; the index didn't. Symptom: answers correct *for last month* — uniquely insidious because nothing looks wrong; the citation checks out against the old chunk. Fix: re-indexing as a *process* — on-change triggers or scheduled sweeps, index versioning/timestamps in metadata so staleness is at least *visible* (Ch 15 implements exactly this; and note the disease is Vol 01 Ch 10's staleness, reborn one layer up — RAG cured weight-staleness and created index-staleness; every cure breeds its own disease at the new layer).

**Retrieval failures — the right page never arrived.** *Vocabulary miss*: query words ≠ corpus words; semantic search papers over some of this gap, but jargon-vs-layman phrasing still sinks queries (your Ch 5 session met this; Ch 13 is its dedicated medicine). *Bad chunks* (the node names it): the fact exists but was severed mid-thought or buried in a multi-topic chunk whose averaged embedding matches nothing well — Ch 3's tension, materialized. Symptom: retrieval returns the right *document's* wrong *pieces*. Fix: re-chunk (overlap, structure-aware, parent-child). *Ranked-out*: retrieved at rank 7, prompt takes top-4 — present, then discarded. Fix: Ch 9's reranker, or widen k. *Filter misfire* (preview): a metadata filter (Ch 12) excludes the very partition holding the answer. Symptom: great answers without the filter, NOT-IN-NOTES with it.

**Generation failures — right page, wrong reading.** *Lost-in-the-middle* (the node names it; Vol 01 Ch 8 predicted it): the answer sat in chunk 6 of 12 stuffed chunks — retrieval succeeded, *attention* failed. Symptom: the inspection window shows the fact plainly present in context, and the answer ignores it. Fixes: fewer/better chunks (rerank then truncate hard), order-by-relevance with best chunks first and last, and resist the "just stuff more" reflex — more context is not more attention. *Unfaithful generation*: the model answers from its weights *despite* the provided context, or blends context with confabulation — grounding instructions reduce this; only measurement (Ch 16) catches it reliably; your Ch 10 citation-validation already catches its crudest form. *Refusal miscalibration*: over-refusal (context was sufficient; model said NOT-IN-NOTES anyway — usually a too-strict prompt) and under-refusal (context insufficient; model winged it — the worse sin, per Ch 10's enterprise argument).

**The diagnostic protocol — the chapter's takeaway, order matters:** (1) *Look at the chunks first* (Ch 5's habit — this single step splits the tree: fact present in retrieved context, or absent?). (2) Absent → walk upstream: is it in the *index* at all (search the raw store directly)? In the index but not retrieved → which path missed it, semantic or keyword (Ch 7's decomposable modes, cashing in)? Not in the index → ingestion/staleness. (3) Present → walk downstream: ranked where? Cited? Faithfully used? Each branch terminates in a named failure with a named fix. Debugging RAG is this tree, walked calmly. Write it once on paper and it's yours forever.

### Hands-On
Build your failure bestiary — *induce* five failures deliberately in your own pipeline, one per family, and document each with {symptom transcript, diagnosis path you walked, fix applied or named}: (1) edit a source note and *don't* re-ingest → ask about the changed content → catch the stale answer citing the old chunk; (2) re-chunk one note at 100 tokens no overlap → find a severed-fact retrieval; (3) ask a question in deliberately layman phrasing about your most jargon-heavy note → vocabulary miss; (4) stuff k=12 unranked chunks with the answer planted mid-pack → hunt for lost-in-the-middle (it may take a few tries — its intermittency is itself the lesson); (5) soften your grounding prompt to a mere suggestion → catch one unfaithful blend. Five specimens, pinned and labeled, in the note. You will never fear a RAG bug again — you've bred them all in captivity.

### Prove It
1. Reproduce the taxonomy from memory: three stages, ~nine named failures.
2. Why is stale-index uniquely insidious, and what's the every-cure-breeds-its-disease observation?
3. Distinguish vocabulary-miss, bad-chunks, and ranked-out by their inspection-window signatures.
4. What is lost-in-the-middle's exact signature, and why is "stuff more context" the wrong reflex?
5. Walk the diagnostic protocol for: "answer is wrong, chunks look right." Then for: "NOT-IN-NOTES on a question you know is covered."

**Wikilinks for your note:** [[build-first-rag]] · [[chunking]] · [[context-windows]] · [[reranking]] · [[rag-evals-intro]] · [[ingestion-pipelines]]

---

## Chapter 12 — Metadata & Filters
**Node:** `metadata-filters` · build · S

### The Feynman opener
"What did I write about checkpointers *in the agents domain* *after June*?" Half that question is meaning (checkpointers) — and half is **structure**: a domain tag and a date. Vector similarity cannot see structure; a filter cannot see meaning. Real retrieval, per the node summary, is both at once: **retrieval with structure** — semantic search *inside* a structurally-defined slice of the corpus. Small build, disproportionate power, and one sharp trap.

### The real thing — the spec
**Metadata at birth, cashed in now.** Ch 3's craft rule — attach metadata when chunking — was the deposit; this is the withdrawal. Extend your `Chunk` model: `source: str, domain: str, doc_type: str, created: date, tags: list[str], heading_path: str`. For your corpus, `domain` maps beautifully to your brain's ten rings (a chunk from an agents note carries `domain="agents"`) — your curriculum's structure becomes your retrieval's structure, which is exactly the kind of alignment that makes systems feel inevitable.

**Pre-filter vs post-filter — the design decision.** *Post-filter*: retrieve top-k by similarity over everything, then discard non-matching. Broken in an obvious-once-you-see-it way: retrieve top-10, filter to `domain="agents"`, and if 9 of 10 came from other domains you're left holding one chunk — or zero. The filter starved the retrieval. *Pre-filter*: restrict the search space *first*, then rank top-k within the slice — always yields k results if the slice has k chunks, and it's what real engines do. In your brute-force store, trivial (filter the list, then cosine); in pgvector, it's Ch 4's promised WHERE-clause-plus-ORDER-BY in one query plan; dedicated engines expose filter parameters that do the same. (Deep footnote worth one sentence in your note: pre-filtering *inside ANN indexes* is genuinely hard — a filtered-out HNSW node still sits on the graph path — and engines handle it with varying grace; another axis your Ch 8 harness could measure someday.)

**The API.** `retrieve(query, filters: Filters | None)` where `Filters` is a small Pydantic model (equality, `IN`-lists, date ranges, tag-contains). Compose with everything already built: filters apply to *both* hybrid paths (semantic and BM25 — a keyword search also respects the slice), then RRF, then rerank. The stack stays decomposable.

**The trap — filter misfire, and the mitigation.** Ch 11 previewed it: a wrong or over-tight filter silently excludes the answer's partition, and the symptom (NOT-IN-NOTES) looks identical to genuine absence. Two mitigations, both cheap: **visibility** — `--show-work` prints the active filters and the *size of the filtered slice* ("searching 37 of 412 chunks where domain=agents") so an over-tight filter is seen, not suspected; **fallback honesty** — when a filtered search returns nothing, automatically re-run unfiltered and report *"nothing in [agents]; found this elsewhere:"* — never let structure make the system dumber than no structure. Write that sentence down; it's a design principle with a long life.

**The horizon (one paragraph, no build):** who *sets* the filters? Today: you, explicitly — correct for a CLI. In products, an LLM can parse "what did I note about RAG last month?" into `{domain:"rag-retrieval", created_after:...}` — structured output (Vol 02, Ch 6) aimed at query parsing; it's called self-query retrieval, it's Ch 13's query-surgery theme arriving early, and it's how filters reach users who'll never write one.

### Hands-On (the artifact)
Build it: extend `Chunk` + re-ingest with domain/date metadata → `Filters` model → pre-filtering in both paths → slice-size visibility → empty-slice fallback → tests (pre-vs-post: construct the 9-of-10-wrong-domain scenario and assert pre-filter returns k while post-filter starves; fallback fires on empty slice; date-range boundaries). Then the payoff session: five structured questions against your own brain — "checkpointers, agents domain only", "anything about testing, foundations domain, this month" — and one deliberate misfire: filter to a wrong domain, watch the fallback save the answer, screenshot it. Tag `rag-v0.4`.

### Prove It
1. Why can't similarity see structure, and why can't structure see meaning? One example each.
2. Demonstrate post-filter starvation with the 9-of-10 arithmetic, and state what pre-filter guarantees.
3. Where does pre-filtering live in pgvector, and why is filtered-ANN genuinely hard?
4. Recite the two filter-misfire mitigations and the design principle behind the fallback.
5. What is self-query retrieval, and which two prior chapters does it compose?

**Wikilinks for your note:** [[chunking]] · [[vector-databases]] · [[build-hybrid-search]] · [[rag-failure-modes]] · [[structured-output]]

---

## Chapter 13 — Query Rewriting & HyDE
**Node:** `query-rewriting-hyde` · concept · S

### The Feynman opener
Every chapter so far improved the *library* — better chunks, better indexes, better ranking. This one improves the *question*. Users ask vague, jargon-mismatched, pronoun-riddled, multi-part questions, and retrieval is only as good as the query vector it starts from — garbage question, garbage neighbors. The node summary says it exactly: **fixing bad questions before retrieval.** The medicine cabinet has four bottles, and one of them — HyDE — is delightfully counterintuitive: *fix the question by hallucinating the answer.*

### The real thing — the four medicines
**1. Query expansion / rewriting.** One LLM call (your gateway, cheap model, temperature ~0.7 for variety) turns the user's phrasing into 2–3 *alternate phrasings*: layman → jargon, jargon → layman, synonyms swapped. Run retrieval for all variants, fuse with — of course — **RRF** (Ch 7's pure function, reused verbatim on multi-query lists; this exact combo ships in frameworks as "multi-query retrieval," and you already own both halves). Directly treats Ch 11's vocabulary-miss: *some* phrasing will speak the corpus's dialect. Cost: one cheap LLM call + parallel searches (`asyncio.gather` — Vol 01 Ch 17, again).

**2. Conversational rewriting (the follow-up fixer).** In chat, the killer isn't vocabulary — it's *context-dependence*: "what about its memory?" is unsearchable; *its* lives three turns back. The fix: before retrieval, an LLM call sees recent history + the new message and emits a **standalone query** ("what is the memory architecture of the LangGraph checkpointer?"). Mechanical, unglamorous, and the single highest-value query fix in any conversational RAG — your Ch 17 chat-with-brain build makes this mandatory equipment, and note the pattern's shape: it's Vol 02 Ch 17's history-management thinking, pointed at retrieval.

**3. Query decomposition.** "Compare how domain 03 and domain 06 handle staleness" is *two* retrievals wearing one question's clothes — no single query vector lands on both partitions well. Decompose (LLM call, structured output: `list[str]` of sub-queries), retrieve per sub-query, pool the chunks, answer over the union. This is the gentle slope that leads to Ch 14 (multi-hop) — decomposition handles questions whose parts are *independent*; multi-hop handles parts that *depend on each other's answers*. Draw that line now; next chapter walks across it.

**4. HyDE — Hypothetical Document Embeddings.** The counterintuitive star. Problem: Ch 2's asymmetry — questions and answers are different *kinds* of text, and even question-trained embedders feel the gap. HyDE's move: ask an LLM to **write a fake answer** to the query — a plausible, hallucinated-freely paragraph in the *style of the corpus* — then **embed the fake answer instead of the question** and retrieve with that. Why it works is the beautiful part: the hallucination's *facts* may be garbage, but its *form* — vocabulary, register, sentence shapes — matches real answer-documents, so it lands in the right *neighborhood* of meaning-space (Vol 01, Ch 5's geometry: you're throwing a decoy shaped like the target). The retrieved chunks are real; the fake answer is discarded; generation proceeds grounded as always. **Hallucination, weaponized for good — used only where being wrong is safe** (locating a neighborhood) and never where truth matters (the final answer). That sentence is the whole trick and a genuinely great interview moment. Costs: an extra LLM call of latency; and HyDE can *underperform* plain retrieval when queries are already corpus-dialect (the decoy adds noise) — which is why the ladder's rule returns: adopt by evidence, not fashion.

**The economics of the whole cabinet.** Every medicine here spends an LLM call (~cheap, ~200–500ms) to improve retrieval. When to spend: expansion/HyDE for vocabulary-mismatched or exploratory queries; conversational rewriting *always* in chat; decomposition when compound structure is detected (an LLM router can detect it — structured output, again). When not: keyword-exact queries (Ch 6's territory — an identifier lookup needs no poetry). A production pattern to bank: route queries by type, spend surgery only where the golden set proves it pays (Ch 16 — three chapters running, the evidence drum beats).

### Hands-On
Two experiments, ~30 lines total on your pipeline. **(A) Multi-query**: take your 3 worst vocabulary-miss queries (Ch 5/Ch 11 sessions — you have them labeled), generate 3 variants each via gateway, retrieve-all + RRF-fuse, record rank-of-correct-chunk before/after. **(B) HyDE**: same 3 queries — generate a fake answer, embed it, retrieve; compare against both plain and multi-query. Build the 3×3 result table {plain, multi-query, HyDE} and read the fake answers side by side with the real retrieved chunks — *see* the form-matches-despite-wrong-facts effect with your own eyes (or catch its failure, equally instructive). Table + one paragraph on which medicine your brain's corpus responds to = the note.

### Prove It
1. Name the four medicines and the specific disease each treats.
2. Why does multi-query end in RRF, and what does that reuse say about pure functions?
3. Explain HyDE's mechanism via the decoy metaphor, and state exactly where hallucination is safe vs forbidden.
4. Draw the decomposition/multi-hop boundary line.
5. Which queries deserve no surgery at all, and what governs adoption of any of this?

**Wikilinks for your note:** [[embeddings-hands-on]] · [[build-hybrid-search]] · [[rag-failure-modes]] · [[hallucination]] · [[multi-hop-retrieval]]

---

## Chapter 14 — Multi-hop Retrieval
**Node:** `multi-hop-retrieval` · concept · S

### The Feynman opener
"Which build node produced the tool my supervisor routes to for scheduling?" No chunk in your brain answers that — because the answer lives in **two** chunks connected by a fact: first find *which tool the supervisor routes to for scheduling* (hop one), *then* search for *which build produced that tool* (hop two — a query you could not have written until hop one answered). The node summary: **questions that need two lookups.** Single-shot retrieval — everything you've built — structurally cannot do this, no matter how good the ranking gets. The fix isn't a better search; it's search *in a loop*.

### The real thing
**Why single-shot fails, precisely.** The query vector for the compound question is an average of both sub-questions' meanings (Ch 3's multi-topic blur, now on the query side) — it lands *between* the two relevant neighborhoods and retrieves neither well. Worse: hop two's query *contains information that doesn't exist yet* — it needs hop one's answer as input. No amount of expansion (Ch 13) fixes that; expansion rephrases what you know, it cannot inject what you've not yet learned. This is the dependency line drawn last chapter, now formal: **decomposition = independent sub-queries, parallel; multi-hop = dependent sub-queries, sequential, each hop's query built from the last hop's answer.**

**The mechanism — retrieve-read-retrieve.** The loop: (1) LLM examines the question → emits the first resolvable sub-query (structured output — Vol 02, Ch 6); (2) retrieve; (3) LLM reads the hits → extracts the bridging fact ("the supervisor routes scheduling to the Scheduler subgraph") → either emits the *next* sub-query (now writable: "which build node created the Scheduler subgraph?") or declares readiness; (4) loop until answerable or hop-budget exhausted; (5) generate the final answer over the *accumulated* evidence from all hops, cited per Ch 10 (each claim traceable to its hop's chunks — provenance across hops is where citations earn double). Now name what you just read, because you've seen this exact shape before: **an LLM deciding an action, acting, reading the result, deciding again — Vol 02 Ch 7's agent loop, with retrieval as the only tool.** Multi-hop RAG is the bridge between your RAG ring and your agents ring; Domain 04's research agent is this loop with more tools and more ambition. The rings connect here — feel the click.

**The costs and the guards (agent-loop diseases, previewed).** Each hop = ≥2 LLM calls + a retrieval → latency and money stack linearly per hop; set a **hop budget** (2–3 covers nearly all real questions). **Error propagation** is the sharp one: a wrong bridging fact at hop one poisons every later hop — the compounding-error disease Vol 02 Ch 5 warned about in reasoning chains, now with retrieval interleaved; the guard is grounding discipline *per hop* (each bridging fact must cite its chunk — Ch 10 machinery, applied mid-loop, not just at the end) plus honest per-hop refusal (a NOT-IN-NOTES at hop one should stop the loop, not send it hallucinating into hop two). **When not to loop:** most questions are single-hop, and running the loop on them wastes two LLM calls to conclude "one hop sufficed" — so production systems *route*: a cheap classifier call (or heuristics: comparative phrasing, chained possessives, "the X of the Y that Z") decides single-shot vs multi-hop. Routing-by-query-type is now a three-chapter drumbeat (Ch 9, 13, 14) — it's how retrieval ladders stay affordable.

**The horizon, one honest paragraph.** Multi-hop over a *pile of chunks* re-derives connections at query time, every time. When the connections themselves are the corpus's soul — entities and relationships, like a brain full of wikilinks — there's a structure that pre-computes them: a knowledge *graph*, walked rather than searched. That's Ch 19 (GraphRAG), and your wikilinked notes are almost comically well-shaped for it. Two chapters of patience.

### Hands-On
Paper + one manual run — no build (the automated version *is* Domain 04 material; today is mechanism-mastery): (1) Write 5 genuinely multi-hop questions about your own brain (the test: hop two's query is unwritable without hop one's answer — verify each against this test, and discard pretenders that are merely compound). (2) Pick two and run the loop *by hand*: you play the orchestrator, your pipeline plays the retrieval tool — write hop one's sub-query, run it, extract the bridging fact *with its citation*, write hop two's now-possible query, run it, compose the final cited answer. Transcribe both runs fully. (3) Sabotage drill: re-run one with a deliberately wrong bridging fact and watch hop two retrieve confident irrelevance — error propagation, witnessed personally, one paragraph in the note. (4) Write the routing heuristic you'd use to detect multi-hop questions, as three concrete textual signals.

### Prove It
1. Why does single-shot fail structurally? Two independent reasons — the averaged vector and the missing information.
2. State the decomposition/multi-hop line in one sentence using "dependency."
3. Walk the retrieve-read-retrieve loop from memory, and name what it is in Vol 02's vocabulary.
4. Name the three diseases and their guards, and connect error propagation to its Vol 02 ancestor.
5. What does GraphRAG pre-compute that multi-hop re-derives, and why is your corpus special for it?

**Wikilinks for your note:** [[query-rewriting-hyde]] · [[tool-calling]] · [[citations-grounding]] · [[graphrag-preview]] · [[reasoning-prompts]]

---

## Chapter 15 — Build: Ingestion Pipeline & Seeder
**Node:** `ingestion-pipelines` · build · M

### The Feynman opener
Everything so far ingested a handful of files with a script you ran by hand and trusted on faith. Production RAG lives or dies at ingestion — Ch 11 taught you that poisoned-at-birth failures are unfixable downstream — and *your* production corpus is the brain itself: hundreds of markdown notes, growing weekly for years. This build, per the node summary: **parse markdown notes → clean semantic chunks → embeddings → seed pgvector — verified with chunk-length assertions.** The pipeline you build today is the one your brain will actually run on; treat it like the permanent infrastructure it is.

### The real thing — the spec
**Stage 1 — Parse (markdown-aware, wikilink-aware).** Walk the notes directory; per file, parse *structure*: frontmatter/metadata if present, header tree, code blocks (atomic — never split, per Ch 3's craft rules), and — the corpus's soul — **[[wikilinks]]**: extract every one into the chunk's metadata (`links_to: list[str]`). You're not using them for retrieval yet; you're *preserving the graph* at ingestion so Ch 19 (GraphRAG) inherits a corpus that already knows its own edges. Ingestion decisions echo for rings — this one is deliberate foresight.

**Stage 2 — Chunk (clean and semantic, as the node demands).** Ch 3's header-aware strategy, industrialized: split on the header tree, prepend the full heading-path, respect atomic units, apply a token-budget ceiling per chunk (oversized sections get recursive sub-splitting with overlap), and *drop* junk (empty sections, pure-link stubs below a floor). "Clean" is enforced, not hoped — see verification.

**Stage 3 — Embed (batched, resumable).** Local model (Ch 2), batched properly — and here's where a real pipeline diverges from a script: **content-hash idempotency.** Per chunk, compute `hash(content)`; store it; on re-runs, *skip unchanged chunks* — re-embedding 400 untouched notes because one changed is amateur hour. This single design choice makes the pipeline safely re-runnable forever, turns "sync my brain" into a cheap incremental operation, and is the direct cure for Ch 11's stale-index disease: re-run often *because* re-running is nearly free. (Deleted/renamed notes: chunks whose source file vanished get purged — staleness works in both directions.)

**Stage 4 — Seed pgvector.** The Ch 4 schema, real at last: Docker Postgres + pgvector (your Ch 8 muscle memory), the `chunks` table with content, source, heading_path, domain, links_to, content_hash, created/updated timestamps, `vector(384)` — plus the `tsvector` column for the keyword path (Ch 6's co-location argument, cashed in: one table, both modalities) and an HNSW index. Batched upserts keyed on (source, chunk-index) — the pipeline *updates*, never blindly duplicates. Repoint your retrieval layer from the JSON store to Postgres behind the same `retrieve()` interface — if Chs 5–13's machinery runs unchanged on the new store, your abstraction was honest; that seamless swap is itself a verification.

**Stage 5 — Verify (the node's own criterion: chunk-length assertions, and friends).** A `verify()` stage that *fails the pipeline loudly* on violation — pipeline QA as code, not eyeballs: every chunk within [min_tokens, max_tokens] (the literal chunk-length assertion — catches both severed fragments and unsplit giants); no chunk begins mid-sentence (heuristic: first char uppercase-or-code); every chunk carries source + heading_path + domain; code blocks intact (backtick parity); wikilink extraction count matches a regex recount; DB row count == chunk count; and a **spot-check retrieval smoke test** — three known query→chunk pairs must hit at rank ≤3, or the seed is declared bad. Plus the report: per-run summary printed and logged — files seen, chunks new/updated/skipped/purged, token stats, timing. Observability at ingestion (the ledger habit from Vol 02 Ch 11, applied to a pipeline).

**Tests** (beyond the built-in verify): parser on a fixture note with nasty structure (nested headers, code containing `##`, wikilinks inside headers); idempotency (run twice → second run reports all-skipped, DB row count unchanged — *the* test that proves the hash design); the purge path; oversized-section sub-splitting respects overlap.

### Hands-On
Build it as a real CLI: `python -m brainseed sync --notes ./brain --verify`. Then the inaugural full seed of your actual brain notes → read the report → run the smoke test → then the ritual that proves the design: edit one note, `sync` again, and watch the report say "1 file changed, 3 chunks updated, 400 skipped, 0.8s." That line is the build's trophy — screenshot it into the note. Repoint retrieval to Postgres, rerun your Ch 7 twelve-query table one more time as a regression check (the numbers should hold or improve; investigate any drop — real pipelines earn trust through regression, not vibes). Tag `rag-v0.5`. This pipeline now runs for the rest of your journey — you have just built the brain's digestive system.

### Prove It
1. Why must wikilinks be captured at ingestion, and which chapter inherits them?
2. Explain content-hash idempotency: the mechanism, the cost it kills, and the Ch 11 disease it cures.
3. What does the seamless store-swap verify about your architecture?
4. Recite five verify-stage assertions and what specific birth-defect each catches.
5. Why is "pipeline QA as code that fails loudly" superior to eyeballing chunks — and where did eyeballing still appear in this volume, legitimately?

**Wikilinks for your note:** [[chunking]] · [[vector-databases]] · [[keyword-fulltext-search]] · [[rag-failure-modes]] · [[build-chat-with-my-brain]]

---

## Chapter 16 — RAG Evals Intro
**Node:** `rag-evals-intro` · concept · S

### The Feynman opener
For fifteen chapters you've judged your RAG by reading answers and nodding — informed nodding, inspection-window nodding, but nodding. The node summary names the upgrade: **faithfulness & context recall — measuring groundedness.** A RAG system has two distinct organs, each failing independently (Ch 11 proved it); therefore it needs two distinct thermometers. This chapter installs the measurement mindset and its core metrics; Ch 18 builds the machine.

### The real thing
**The two-organ principle — measure retrieval and generation separately.** An end-to-end "was the answer good?" score is diagnostic mush: a bad answer with great retrieval is a generation problem; a bad answer with bad retrieval says nothing about generation at all. Every serious RAG eval decomposes along exactly the pipeline's joints — the same joints your diagnostic tree (Ch 11) walks. Measurement mirrors architecture; this is not a coincidence, it's the point.

**The retrieval thermometers.** **Context recall** (the node's named metric): of the chunks *needed* to answer this question, what fraction did retrieval actually fetch? — Vol 01 Ch 12's recall, wearing RAG clothes, and the single most important retrieval number: a miss here caps everything downstream (the model cannot use what never arrived — the ceiling theorem, now quantified). **Context precision** rides alongside: of the fetched chunks, what fraction was actually relevant? — low precision means a noisy prompt, wasted window (Vol 01, Ch 8), and lost-in-the-middle risk (Ch 11). Both need ground truth: *which chunks are the right ones per question* — which is why golden sets for RAG must label expected chunks, not just expected answers. Your Ch 8 benchmark measured recall@k against *geometric* truth (nearest vectors); context recall measures against *semantic* truth (chunks a human says are needed) — same word, different referee, and confusing them is a classic interview trap you're now immune to.

**The generation thermometers.** **Faithfulness** (the node's other named metric): decompose the answer into claims — your Ch 10 schema did this *structurally, in advance* — and per claim ask: is it supported by the retrieved context? Faithfulness = supported claims / total claims. It measures precisely the crime of answering-from-weights-despite-context (Ch 11's unfaithful generation), and it's *the* groundedness number: a RAG with 0.7 faithfulness is inventing 30% of what it says *while holding the correct pages*. **Answer relevance** rides alongside: faithful-but-evasive is also failure ("the context discusses checkpointers" is 100% faithful and 0% useful) — does the answer actually address the question? Note the elegant duality worth a line in your note: faithfulness is answer↔context; relevance is answer↔question; context recall/precision are context↔question. Three arrows, four metrics, whole system covered.

**Who judges? The honest hierarchy.** Claim-support judgments at scale need a judge, and the options are Vol 02 Ch 16's tiers, inherited whole: programmatic checks where possible (your Ch 10 citation-validation is a crude faithfulness floor already running); humans for gold-standard labels (slow, small n, calibration source); **LLM-as-judge** for scale — per claim, "does this context support this claim? yes/no/partial" — with the same iron caveat: calibrate against human labels on a sample *before* trusting it, watch its known biases (verbosity-favoring, confidence-favoring), and never sole-judge anything that matters. Frameworks (RAGAS and kin) package these exact metrics; you'll build them by hand in Ch 18 first — the pattern of this entire curriculum — so the frameworks become conveniences, not oracles.

**What the numbers are *for*.** Not dashboards — *decisions*. The ladder-adoption rule this volume has repeated since Ch 9 finally gets its instrument: does reranking earn its latency? → context precision before/after. Did HyDE help *your* corpus? → context recall on the vocabulary-miss slice. Is the new chunking better? → both retrieval metrics, same golden set, one change at a time (Vol 02 Ch 16's loop, verbatim). And the regression ritual, now for pipelines: every Ch 11-style failure you ever diagnose becomes a golden-set row, forever. Numbers turn the retrieval ladder from fashion into engineering.

### Hands-On
Hand-run the full eval once — no code, maximum understanding (Ch 18 automates what you do today): take 5 questions from your labeled Ch 5/Ch 7 sessions. Per question: (a) *you* label the needed chunks (search the store directly; this is ground-truth authorship — feel how much judgment it takes, that feeling is why golden sets are precious); (b) run the pipeline, compute context recall & precision by hand against your labels; (c) decompose the answer's claims (your Ch 10 output makes this trivial — read them off), judge each claim's support yourself, compute faithfulness; (d) score answer relevance 1–5, gut but written. Produce the 5×4 metric table, then the diagnosis paragraph: which organ is your pipeline's weaker one, on this tiny-but-honest sample? That verdict — retrieval-bound or generation-bound — decides where your Ch 17 build spends its polish. Table + verdict = the note.

### Prove It
1. State the two-organ principle and why end-to-end scores are diagnostic mush.
2. Define all four metrics as arrows between {question, context, answer}.
3. Context recall vs Ch 8's recall@k — same word, different referee: explain the trap.
4. Why is faithfulness *the* groundedness number, and which Ch 10 structure made it computable?
5. Name three ladder decisions from this volume and the exact metric that adjudicates each.

**Wikilinks for your note:** [[classical-ml-fundamentals]] · [[citations-grounding]] · [[rag-failure-modes]] · [[prompt-quality]] · [[evaluate-brain-chat]]

---

# PART III — RAG ON MY OWN BRAIN
*6 chapters. The meta arc: the system answers questions about itself, gets measured honestly, glimpses its graph-shaped future — and the ring closes.*

---

## Chapter 17 — Build: Chat With My Brain
**Node:** `build-chat-with-my-brain` · build · L

### The Feynman opener
The node summary says it best: *meta and glorious.* Every component this volume built — the pipeline, the hybrid engine, the reranker, the citations, the filters, the query surgery — assembles into one product: **a conversational interface to your own accumulated knowledge.** You will ask your brain questions and it will answer *from your notes, citing them, filtered by domain.* The system you're building to learn AI now answers questions about learning AI. The snake eats its tail; the demo sells itself in interviews forever.

### The real thing — the spec
**The chassis:** Vol 02 Ch 17's CLI chatbot — persona, streaming, memory loop, token-budget trimming, `/usage` — forked and rewired: the gateway call is replaced by the full RAG stack over your Postgres-seeded brain (Ch 15). Every turn: conversational rewrite → retrieve → generate grounded → render cited.

**The retrieval turn, composed (the whole volume in one function):**
1. **Conversational rewriting** (Ch 13's medicine #2, mandatory): history + new message → standalone query via a cheap gateway call. Without this, every follow-up dies; with it, "and how do I test that?" just works. Show the rewritten query in `--show-work` — debugging starts at the query now, not the chunks.
2. **Optional filter parsing** (Ch 12's horizon, made real): a structured-output call maps "in the agents domain" / "from this month" → `Filters`; slice-size visibility and empty-slice fallback ship as built.
3. **Hybrid retrieve → rerank** (Ch 7 + Ch 9): top-20 fused, cross-encoder to top-5. Wired through the *same* decomposable `retrieve()` — every mode still callable for debugging.
4. **Grounded generation with structural citations** (Ch 10): claims + chunk_ids, validated, repaired, rendered as `[source.md > heading-path]`, `--sources` on demand, NOT-IN-NOTES proud and honest.
5. **The answer enters chat history** — and here's the L-node's subtle design problem, worth real thought: retrieved chunks are *per-turn scaffolding*, not conversation — append full chunks to history and three turns will devour your token budget (Vol 01, Ch 8 arithmetic). Ship the sane default: history keeps the user's message and the *answer text only*; chunks are re-retrieved fresh each turn (the rewriter makes follow-ups retrievable, so this works). Document the tradeoff you're accepting: an answer referencing "the chunk above" loses its referent — note it, live with it, revisit in Domain 06 (this exact tension is a memory-architecture problem, and naming-it-now is the setup).

**Commands for a brain:** `/domains` (list rings with chunk counts — the corpus introduces itself), `/filter agents` (session-sticky filter), `/sources` (last answer's chunks in full), `/sync` (invoke the Ch 15 pipeline in-place — edit a note mid-conversation, sync, ask again, watch the answer update: *the freshest demo move you own*), `/usage` (gateway ledger: this conversation's cost).

**Engineering standards — L-node means no shortcuts:** every component behind interfaces, config in one place (models, k values, budgets — you *will* tune), the full pytest suite green across the composed stack (the component tests from Chs 5–15 all still run — composition must not break them; plus new integration tests: rewrite→retrieve→cite end-to-end on fixture notes), and the ledger tracking per-turn cost — a RAG turn is now ~4 LLM calls (rewrite, filter-parse, generate, judge-nothing-yet) plus retrieval; *know* what your brain costs per question (`tokentools`, forever).

### Hands-On
Assemble it (est. 2–3 honest days) — then the inaugural session, transcribed into the note: 15 real questions across at least 4 domains, including 3 follow-ups (rewriter test), 2 filtered queries, 1 deliberate out-of-corpus question (honest refusal test), and 1 live-sync demo (edit → `/sync` → re-ask). Label every turn with the Ch 11 taxonomy where anything wobbles — those labels are Ch 18's golden-set seeds, and *that* is why the transcription matters. Tag `brain-chat-v1.0`. Then record a 90-second screen capture of the sync demo and the citations — capstone ammunition, and honestly, portfolio ammunition.

### Prove It
1. Trace one follow-up question through all five stages, naming the chapter behind each.
2. Defend the chunks-are-scaffolding decision with token arithmetic, and state the tradeoff accepted and its future domain.
3. Why must component tests survive composition, and what does a green composed suite certify?
4. What is your per-turn cost and its breakdown by call?
5. Why is `/sync` mid-conversation the sharpest demo move — which ring-1 disease does it visibly cure?

**Wikilinks for your note:** [[build-cli-chatbot]] · [[ingestion-pipelines]] · [[query-rewriting-hyde]] · [[citations-grounding]] · [[metadata-filters]] · [[reranking]]

---

## Chapter 18 — Build: Evaluate It
**Node:** `evaluate-brain-chat` · build · M

### The Feynman opener
The brain-chat works — you've watched it work. Now prove it, with numbers, the way Ch 16 taught: **a mini golden set, faithfulness scored** (the node summary, verbatim). This build turns last chapter's product into a *measured* product — and hands you the instrument that will referee every future change to it. From here forward, "I improved the brain-chat" is a claim with a before/after table attached, or it's weather.

### The real thing — the spec
**The golden set — 20 rows, authored with care (the build's real labor).** Sources: your labeled inspection sessions (Chs 5, 7, 17 — the whole volume has been quietly composing this set; now you see why every hands-on said *keep the labels*). Composition, deliberately spread (Vol 02 Ch 16's coverage logic): ~8 straightforward single-hop across ≥4 domains, 3 vocabulary-mismatched (Ch 13's customers), 2 filter-dependent, 2 conversational follow-up pairs (the rewriter gets evaluated too — eval the *system*, not just the happy path), 3 out-of-corpus (expected: honest refusal — refusal calibration is a measured behavior, per Ch 11), 2 multi-hop-flavored (expect these to score poorly today — *baselines are allowed to have known weaknesses; unmeasured weaknesses are the sin*). Per row: question, expected-relevant chunk ids (you label them — ground-truth authorship, Ch 16's hard-won feeling), expected-answer notes or refusal flag, and history for the follow-up rows. Version the file in the repo beside the code it judges.

**The harness — `python -m braineval run`.** Per row: execute the full stack (rewrite → retrieve → generate), then compute: **context recall & precision** (retrieved ids vs your labels — pure set arithmetic, pure functions, pytest-perfect); **faithfulness** — per claim in the structured answer (Ch 10's schema, cashing in exactly as promised), an LLM-as-judge call via your gateway: *"Context: [cited chunks]. Claim: [text]. Does the context support the claim? SUPPORTED / PARTIAL / UNSUPPORTED, one line of reasoning."* — structured output, temperature 0, cheap model; faithfulness = supported/total; **refusal correctness** on the out-of-corpus rows (refused when it should = pass; answered = fail, and flag *what* it invented); **answer relevance** — judge call, 1–5 rubric. Output: per-row table + aggregate scores + per-slice breakdowns (the vocabulary-miss slice scored separately — slices localize weakness; aggregates hide it) → `eval_report.md`, timestamped, committed. Cost note in the report: an eval run is ~20×(stack + judge) calls — price it with the ledger; knowing what measurement costs is part of measurement.

**Calibrate the judge — the step that separates rigor from theater (Ch 16's iron caveat, enacted).** Before trusting any aggregate: take 15 claim-judgments from the first run, judge them *yourself* blind (cover the model's verdicts), compute agreement. ≥80% → trust with eyes open; below → tighten the judge prompt (few-shot examples of SUPPORTED vs PARTIAL — Vol 02 Ch 4, aimed at judging) and re-calibrate. Record the agreement number *in the report* — an eval that reports its own reliability is an eval an interviewer believes.

**Then: close one loop, whole.** Run the baseline → read the slice breakdowns → pick the *worst slice* → apply this volume's targeted fix (vocabulary slice weak → enable multi-query/HyDE for it; precision weak → rerank harder or k down; faithfulness weak → tighten the grounding prompt) → **change one thing** → re-run → before/after table. Whatever the numbers say — improvement, regression, nothing — you have now run the complete engineering loop this curriculum has been building toward since Vol 02 Ch 16: *measure, change once, re-measure, decide by evidence.* That loop, not any single score, is the artifact.

### Hands-On
Author the set (budget half the build here — labeling is the work) → harness → calibration → baseline run → the one-change loop → both reports committed. Tests: metric arithmetic on hand-computed fixtures; judge-output parsing; refusal-scoring both directions. Tag `brain-eval-v1.0`. In the note: the baseline table, the calibration number, the before/after table, and one honest paragraph: what your brain-chat is actually good at, weak at, and what you chose *not* to fix yet and why. That paragraph is Ch 20's capstone post, half-written.

### Prove It
1. Defend the golden set's composition — why each slice exists and what each measures.
2. Why must expected *chunks* be labeled, not just expected answers? Which metrics die without them?
3. Walk the faithfulness computation end to end, naming the Ch 10 structure it consumes.
4. What does judge calibration protect against, and why does reporting the agreement number matter?
5. Describe your one-change loop: slice, hypothesis, fix, numbers, decision. Defend the decision.

**Wikilinks for your note:** [[rag-evals-intro]] · [[build-chat-with-my-brain]] · [[citations-grounding]] · [[prompt-quality]] · [[classical-ml-fundamentals]]

---

## Chapter 19 — GraphRAG Preview
**Node:** `graphrag-preview` · concept · S

### The Feynman opener
Your RAG treats the brain as a *pile* — chunks in a bag, fished out by similarity. But your brain isn't a pile; it's a **web**: notes wikilinked to notes, concepts belonging to domains, builds depending on concepts. The node summary names the shift: *when knowledge is a graph, not a pile* — and names the machinery: community summaries, entity linking, hierarchical relationship indexing. This is a preview node — mechanism and judgment today, implementation when the frontier-shaped future arrives — but for *your* corpus it's more than a preview: your ingestion pipeline has been saving wikilinks since Ch 15 precisely for this chapter's someday.

### The real thing
**What vector RAG structurally cannot answer.** Two question families expose the pile's limits. *Global questions*: "what are the main themes across my agents notes?" — no chunk contains the themes; the answer is a property of the *whole collection*, and retrieving top-k of anything misses it by construction (top-k of what? the question matches everything weakly and nothing well). *Relational questions*: "how does the checkpointer relate to the human-approval gate?" — the answer lives in *connections between* notes; Ch 14's multi-hop can walk 2–3 connections at query time, expensively, per query — but it re-derives the web every time, and deep or broad traversals explode. The diagnosis in one sentence: **similarity search finds things *like* the query; it cannot find things *related to each other*.**

**The GraphRAG move — pre-compute the web.** Three stages, mapping exactly to the node's three named techniques:
1. **Entity linking / graph extraction** (ingestion-time): an LLM pass over chunks extracts entities ("checkpointer", "supervisor", "HITL gate") and typed relationships ("supervisor *routes to* Scheduler", "gate *protects* saves") → a knowledge graph of nodes and edges beside the vector index. Entity *linking* is the hard half: "the gate", "HITL approval", "human-in-the-loop check" must resolve to *one* node or the graph fragments into synonyms — and notice: **your wikilinks already did this by hand.** `[[hitl-interrupts]]` is a human-curated, pre-disambiguated edge. Your corpus was born linked; most corpora must have their graph *guessed* by an LLM (error-prone, expensive); yours has it *declared*. This is the "almost comically well-shaped" claim from Ch 14, now cashed out.
2. **Community detection + summaries**: graph algorithms cluster densely-connected regions into *communities* (your domains will emerge as natural communities — plus surprises: cross-domain clusters like "everything touching Pydantic" that no folder structure knows about). Then an LLM writes a **summary per community** — and stores it. *This* is the answer to global questions: "main themes across agents notes?" retrieves the agents-community summary — pre-computed synthesis, fished out like any chunk. The pile could never; the graph does it at ingestion, once.
3. **Hierarchical relationship indexing**: communities nest (sub-communities within domains; a root summary above all), giving query-time a *resolution dial* — global questions read high-level summaries, specific questions drop to entities and raw chunks, relational questions *walk edges* (the pre-computed multi-hop: "checkpointer → persists → state ← reads ← gate" is a path lookup, not a retrieval loop). Query routing decides the entry level — the routing drumbeat (Chs 9, 13, 14) plays its fourth verse.

**The honest costs — why this is a preview, not this ring's build.** Ingestion cost explodes: LLM extraction over every chunk + community summarization ≈ orders of magnitude more calls than embedding (your ledger instincts should wince — good). *Graph staleness* is nastier than index staleness: one edited note can re-wire edges and invalidate community summaries up the hierarchy (Ch 15's idempotency thinking, but transitive — a genuinely hard cache-invalidation problem). Extraction quality bounds everything (garbage edges → confident garbage walks — poisoned-at-birth, graph edition). And the adoption rule this volume has drilled: most corpora, most questions, plain hybrid RAG wins on cost-adjusted quality; GraphRAG earns its complexity when global/relational questions are *the workload*, not the exception. For your brain — a corpus that *is* a graph, queried by someone who thinks in connections — the case is unusually strong, which is exactly why the curriculum plants the seed here and schedules the build for later, when the frontier node regenerates against the field as-it-is (Rule 7 thinking, applied to technique choice).

### Hands-On
Paper preview, three exercises: (1) *Extract by reading*: take three of your linked notes; hand-draw their entity-relationship graph — nodes, typed edges — using wikilinks as ground truth plus relationships you know but never linked (those gaps are what LLM extraction would add — and where it would err; mark which edges feel guessable vs fragile). (2) *Community intuition*: sketch your brain's likely community structure — the ten domains, then predict two *cross-domain* communities (Pydantic-everywhere? evaluation-everywhere?); write the one-paragraph community summary for one of them yourself — feel what the LLM would be asked to produce. (3) *The routing table*: six questions about your brain — two global, two relational, two specific — and per question: which resolution level answers it, and what plain-RAG would have done instead (fail, multi-hop expensively, or tie). Photos + table = the note; the note itself gets wikilinked richly — it's future ground truth.

### Prove It
1. Name the two question families the pile cannot answer, and the one-sentence diagnosis.
2. Map the three stages to the node's three named techniques, from memory.
3. Why is entity linking the hard half, and why is your corpus exceptional here?
4. What answers global questions in GraphRAG, and *when* is that answer computed?
5. State the adoption judgment: the costs, the workload that justifies them, and your honest verdict for the brain.

**Wikilinks for your note:** [[multi-hop-retrieval]] · [[ingestion-pipelines]] · [[rag-failure-modes]] · [[model-landscape]] · [[semantic-caching]]

---

## Chapter 20 — Semantic Caching
**Node:** `semantic-caching` · concept · S

### The Feynman opener
Volume 02, Chapter 10 left a rung of the caching ladder deliberately empty: exact-match caching answers *identical* questions for free, but "what's the refund policy?" and "how do refunds work?" — different strings, same question — miss it entirely. You lacked the tool then. You are now sixteen chapters deep into that tool. **Semantic caching = the caching ladder's top rung, built from this ring's machinery: cache lookups by embedding similarity.** The node summary: answering repeat questions for free. The gateway TODO you left in Vol 02 Ch 11 comes due today.

### The real thing
**The mechanism — vector search pointed at yourself.** Store: past `(query, response)` pairs, query embedded. Lookup: embed the incoming query, nearest-neighbor against cached queries; similarity above threshold τ → serve the cached response, zero LLM calls, near-zero latency; below → miss, generate, cache the new pair. Recognize every part: an embedding model (Ch 2), a vector store (Ch 4 — the same pgvector can host a `semantic_cache` table), nearest-neighbor with a threshold. The only new idea is *what's being searched*: not documents — **your own past conversations**. (Ch 4's quiet superpower — "the machine is nearest-neighbor; text search is merely its most famous customer" — this is customer number two.)

**τ — the whole game, and it's precision/recall again.** Too low (loose): "refund policy?" matches "referral policy?" → **false hit** — a *wrong answer served confidently from cache*, the worst failure in caching (worse than any miss; the user got stale-wrong for free). Too high (tight): only near-identical strings match → the cache degenerates toward exact-match; all cost, no savings. This is Vol 01 Ch 12's tradeoff wearing cache clothes — false hits are precision failures, missed savings are recall failures — and the threshold is set the way this volume sets every dial: **empirically, on labeled pairs** (Ch 2 warned you never to trust folklore thresholds; here's the highest-stakes instance). Build a small paraphrase-pair set (true-duplicates and near-miss traps — "refund/referral", negations, entity swaps: "gateway retry logic" vs "gateway fallback logic"), sweep τ, pick the point where false-hit rate is acceptably near zero — *precision-first, always*, because a false hit is served silently while a miss merely costs a normal call.

**Invalidation — three clocks, not one.** Exact-match caching had TTL and prompt-version busts (Vol 02, Ch 10). Semantic caching over a *RAG* system adds the sharp one: **the corpus clock.** A cached answer about checkpointers is stale the moment the checkpointer note changes — even though the *query* space didn't move. The clean design: cached entries carry the source chunk-ids they were built from (your Ch 10 citations, cashing in *again* — structure enabling verification enabling invalidation); the Ch 15 sync pipeline, on updating chunks, purges cache entries citing them. Follow the dependency chain and admire it: citations → invalidation-by-provenance → a cache that heals itself on `/sync`. Systems built from honest parts compose like this; that's the meta-lesson.

**Where it lives, and where it doesn't.** Placement: in the gateway (Vol 02 Ch 11's architecture anticipated it — the marked TODO), checked *before* the whole RAG stack (a hit skips rewrite, retrieval, rerank, generation — the full ~4-call, multi-hundred-ms turn → ~10ms). What to cache: the final answer (and its citations, for rendering and invalidation). What *not* to cache — the judgment half: personalized or filter-dependent answers (same words + different active filters = different correct answers — the filter state must join the cache key or those queries must bypass), time-sensitive queries, and anything under a session where the *conversational rewrite* differs (cache on the *rewritten standalone* query, never the raw follow-up — "what about its memory?" must not collide across conversations about different "its"). That last rule is subtle, load-bearing, and exactly the kind of thing that separates a cache that works from a cache that lies.

### Hands-On
Design document + threshold experiment (concept node — the full build lands when the gateway TODO is closed, and this doc will be its spec): (1) write the one-page design — schema for `semantic_cache` (query, query_embedding, answer, cited_chunk_ids, filters_fingerprint, created), lookup flow diagram showing placement before the RAG stack, the three invalidation clocks, the rewrite-first rule; (2) run the τ experiment for real (~30 lines with Ch 2's lab): author 15 paraphrase pairs — 8 true duplicates, 7 traps (near-miss vocabulary, one negation, one entity swap, one filter-dependent twin) — embed, score, and find *your* corpus's τ: the highest threshold catching ≥6 of 8 true pairs with zero trap hits. Report the number and the pair that nearly fooled it; (3) estimate the payoff with your ledger: at your Ch 17 per-turn cost and a guessed 20% repeat-rate, monthly savings in rupees — small today, and the *shape* of the argument is the production-domain skill. Doc + τ + estimate = the note.

### Prove It
1. Describe the mechanism and name what's being vector-searched — why is this Ch 4's "customer number two"?
2. Map false hits and missed savings onto precision and recall, and defend precision-first with the silent-failure argument.
3. Recite the three invalidation clocks, and walk the citations→provenance→self-healing dependency chain.
4. Why cache on the rewritten query, never the raw follow-up? Construct the collision that rule prevents.
5. Name three query classes that must bypass or key-extend the cache, and why each.

**Wikilinks for your note:** [[rate-limits-caching]] · [[embeddings-hands-on]] · [[citations-grounding]] · [[ingestion-pipelines]] · [[build-gateway]]

---

## Chapter 21 — Synthesis: The Retrieval Story
**Node:** `synthesis-rag` · synthesis · S

### The Feynman opener
Volume 01's synthesis explained the machine; Volume 02's explained the call. This one explains **the open book** — the full pipeline, one diagram, per the node summary: every stage from a markdown note being saved to a cited answer streaming out, with the failure modes and the metrics annotated in place. When you can draw this cold and narrate it in ninety seconds, you don't "know some RAG" — you own the most-hired-for architecture in applied AI, from ingestion verbs to eval arithmetic.

### The real thing — the through-line (learn the spine, tell it your way)
A note is saved. The **ingestion pipeline** wakes [15]: markdown parsed structure-aware, wikilinks preserved, **chunked** along its own headers with heading-paths prepended and atomic units intact [3], content-hashed so only the changed survive re-embedding [15], **embedded** into meaning-coordinates [2], and seeded into **one Postgres** holding vectors, tsvectors, and metadata side by side [4, 6] — verified by assertions that fail loudly, because poisoned-at-birth is unfixable downstream [11, 15]. A question arrives, conversational and lazy; **query surgery** fixes it first — rewritten standalone against chat history, expanded or decoyed via HyDE when vocabulary mismatches, decomposed when compound, routed to a **multi-hop loop** when its second half depends on its first half's answer [13, 14]. **Filters** carve the structural slice — domain, date — pre-filter, never post, with slice-size visible and empty-slice fallback honest [12]. Two scouts search the slice: **semantic** nearest-neighbor through an ANN index whose speed↔recall dial you have personally turned [4, 8], and **BM25** keyword matching that still wins on jargon and identifiers [6]; their rankings — never their scores — fuse by **RRF** [7], and a **cross-encoder reranker** deep-reads the shortlist, promoting near-misses that cosine's separation could never see [9]. The survivors enter a **grounded prompt** — delimited as data, strict-context, refusal-permitted — and generation returns not prose but **claims with chunk-id citations**, validated for referential integrity, repaired or rejected, rendered with heading-paths a human can verify in seconds [5, 10]. The whole turn was first checked against a **semantic cache** — past answers, vector-searched, threshold tuned precision-first, invalidated by the provenance its own citations recorded [20]. And whether any of it *works* is never vibes: **context recall and precision** thermometer the retrieval organ, **faithfulness and relevance** the generation organ, judged by a calibrated judge against a golden set whose rows are your own diagnosed failures, and every change to any stage answers to the before/after table [16, 18]. Where the pile's shape fails — global themes, relational webs — the **graph** waits: entities your wikilinks already declared, communities summarized at ingestion, hierarchy walked instead of searched [19].

### Hands-On (the artifact — this IS the node)
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every stage present, correctly ordered, failure-modes named where they live. **(b)** The napkin — *the node summary's literal demand*: one diagram, two lanes (ingestion lane: save→parse→chunk→hash→embed→seed→verify; query lane: rewrite→filter→hybrid→RRF→rerank→ground→cite→validate→render), the cache as a bypass valve at the query lane's mouth, the eval thermometers clipped to their organs, the graph sketched as the horizon box. Red-arrow the four failure families onto their stages [11]. Photograph into the note. **(c)** The 90-second spoken version — and know its audience: this is *the* answer to "design a system that answers questions over our company's documents," the single most common applied-AI interview question in existence. Record, critique, re-record. Any stage you glossed: reopen its chapter before lighting.

### Prove It
1. Deliver the 90-second version cold.
2. Trace one query that hits: cache miss → rewrite → filter → hybrid → rerank promotes rank 6 → cited answer → cache store. Name every mechanism and its chapter.
3. Place all four eval metrics on the diagram as arrows — which organ, which direction.
4. For each failure family [11], point to its stage on your napkin and name its named fix.
5. Draw the napkin from memory.

**Wikilinks for your note:** every Domain 03 node — this is the ring's hub note.

---

## Chapter 22 — 🏁 Capstone: Retrieval
**Node:** `capstone-rag` · capstone · M

### The Feynman opener
Ring 3 closes with the strongest hand yet: not just knowledge, not just a shipped toy — **a measured system over your own knowledge, with an eval report to prove it.** The node's frame is ready-made and true: *"I gave AI an open book."* The capstone's job, as always: package it publicly, then steer the graph — and this time, the replan checkpoint has real teeth, because Domain 04 is where your agent-lab's frozen soul starts coming back to life.

### The real thing — three deliverables

**1. The mega-note.** Domain 03's hub: the through-line narration (your words), the napkin photo, links to all 22 node notes, and the *numbers that make this ring different* — the Ch 8 benchmark's recall-vs-latency curve, the Ch 18 baseline table with its calibration score, the before/after table from your one-change loop, the τ from Ch 20, and per-turn cost from the ledger. Plus the honest reflection: hardest node, biggest surprise, the failure specimen from Ch 11's bestiary you're proudest of having bred. The template holds; the evidence deepens.

**2. The public post — "I gave AI an open book."** The arc writes itself, and for the first time it's backed by *measurements*: models hallucinate because weights aren't databases [Vol 01] → so I built the open book: my own notes, chunked, embedded, hybrid-searched, reranked, cited [this ring] → and I refused to trust it on vibes: golden set, faithfulness scoring, calibrated judge, before/after evidence [16, 18]. Include: the napkin cleaned up, the 90-second demo capture from Ch 17 (the `/sync` move and a cited answer — *show* the receipts), two real numbers (context recall and faithfulness — numbers signal engineer; adjectives signal tourist), the ledger line ("my brain answers questions for ₹X a turn"), and the journey frame (node 66 of 228 · ring 3 of 10 · the map is public). This is the M4 halfway-story muscle's third rep — and note for the mission: "RAG with evals" is the highest-frequency phrase in the AI-engineering job descriptions you're targeting; this post *is* the JD keyword list, demonstrated.

**3. The replan checkpoint — with teeth this time.** Rule 6 ritual: review Domain 04's ghost nodes with ring-3 eyes. Real questions this ring has earned: does `build-research-agent` need re-scoping now that you know retrieval's true cost structure (its web-search tool will need everything Ch 13–14 taught)? Should a semantic-cache *build* node materialize in the production domain now that Ch 20's design doc exists — or does the gateway TODO suffice? Did the Ch 18 eval reveal a weakness worth a dedicated node (multi-hop scored poorly by design — does Domain 04's loop machinery cover it, or does a node need deepening)? Three verdicts — proceed / amend / deepen — written reasons, changelog, commit, tag `domain-03-lit`. Milestone check: M4 (half-lit brain) is now within sight-line — count your lit nodes against the 50% threshold and note the distance in the changelog. Screenshot three glowing rings.

### Hands-On
Assemble deliverable 1 → cut and post deliverable 2 (the demo capture does the heavy lifting — let it) → run deliverable 3 honestly → light the node → screenshot. Then the pause ritual — an evening minimum, and this time with a specific savor: before Domain 04 begins resurrecting the agent-lab piece by piece, re-read your own frozen agent code *one time* with ring-3 eyes. The supervisor, the gate, the scanner. Count how many of its design choices you can now *name* — that count is the distance you've traveled, measured in your own past self's code.

### Prove It
1. All five Prove-It questions from this volume's Chapter 1, answered again from memory — the ritual, the distance.
2. The 90-second synthesis, delivered to camera for the capstone post.
3. Which two numbers went in your post, and defend the claim that numbers beat adjectives in public proof-of-work.
4. One concrete amendment you considered for Domain 04, and the written reason for your verdict.
5. From your agent-lab re-read: name three design choices you can now name that were opaque when you froze it. 

**Wikilinks for your note:** [[synthesis-rag]] · [[evaluate-brain-chat]] · [[build-chat-with-my-brain]] · every Domain 03 node.

---

# CLOSING — WHAT YOU NOW STAND ON

Ring 3 lit means: you can turn any pile of documents into a grounded, cited, *measured* question-answering system — and debug it by differential diagnosis, tune it by evidence, and price it to the rupee. The most-demanded applied-AI skill in the industry is now something you've built layer by layer with your own hands, over the most meaningful corpus you own.

Domain 04 — Agents — begins with `what-makes-an-agent`, and you've already touched the live wire twice: tool-calling was the mechanic [Vol 02, Ch 7], multi-hop was the loop [Ch 14]. Now the loop gets state, memory, patterns, a supervisor — and piece by piece, the frozen agent-lab wakes up to find its builder finally speaks its language.

The past is locked. The future evolves. **Volume 04 awaits.**
