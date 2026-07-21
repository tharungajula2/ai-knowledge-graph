## ELI5
For fifteen chapters you've judged your RAG by reading answers and nodding — informed nodding, inspection-window nodding, but nodding. The node summary names the upgrade: **faithfulness & context recall — measuring groundedness.** A RAG system has two distinct organs, each failing independently (Ch 11 proved it); therefore it needs two distinct thermometers. This chapter installs the measurement mindset and its core metrics; Ch 18 builds the machine.

## The Real Explanation
**The two-organ principle — measure retrieval and generation separately.** An end-to-end "was the answer good?" score is diagnostic mush: a bad answer with great retrieval is a generation problem; a bad answer with bad retrieval says nothing about generation at all. Every serious RAG eval decomposes along exactly the pipeline's joints — the same joints your diagnostic tree (Ch 11) walks. Measurement mirrors architecture; this is not a coincidence, it's the point.

**The retrieval thermometers.** **Context recall** (the node's named metric): of the chunks *needed* to answer this question, what fraction did retrieval actually fetch? — Vol 01 Ch 12's recall, wearing RAG clothes, and the single most important retrieval number: a miss here caps everything downstream (the model cannot use what never arrived — the ceiling theorem, now quantified). **Context precision** rides alongside: of the fetched chunks, what fraction was actually relevant? — low precision means a noisy prompt, wasted window (Vol 01, Ch 8), and lost-in-the-middle risk (Ch 11). Both need ground truth: *which chunks are the right ones per question* — which is why golden sets for RAG must label expected chunks, not just expected answers. Your Ch 8 benchmark measured recall@k against *geometric* truth (nearest vectors); context recall measures against *semantic* truth (chunks a human says are needed) — same word, different referee, and confusing them is a classic interview trap you're now immune to.

**The generation thermometers.** **Faithfulness** (the node's other named metric): decompose the answer into claims — your Ch 10 schema did this *structurally, in advance* — and per claim ask: is it supported by the retrieved context? Faithfulness = supported claims / total claims. It measures precisely the crime of answering-from-weights-despite-context (Ch 11's unfaithful generation), and it's *the* groundedness number: a RAG with 0.7 faithfulness is inventing 30% of what it says *while holding the correct pages*. **Answer relevance** rides alongside: faithful-but-evasive is also failure ("the context discusses checkpointers" is 100% faithful and 0% useful) — does the answer actually address the question? Note the elegant duality worth a line in your note: faithfulness is answer↔context; relevance is answer↔question; context recall/precision are context↔question. Three arrows, four metrics, whole system covered.

**Who judges? The honest hierarchy.** Claim-support judgments at scale need a judge, and the options are Vol 02 Ch 16's tiers, inherited whole: programmatic checks where possible (your Ch 10 citation-validation is a crude faithfulness floor already running); humans for gold-standard labels (slow, small n, calibration source); **LLM-as-judge** for scale — per claim, "does this context support this claim? yes/no/partial" — with the same iron caveat: calibrate against human labels on a sample *before* trusting it, watch its known biases (verbosity-favoring, confidence-favoring), and never sole-judge anything that matters. Frameworks (RAGAS and kin) package these exact metrics; you'll build them by hand in Ch 18 first — the pattern of this entire curriculum — so the frameworks become conveniences, not oracles.

**What the numbers are *for*.** Not dashboards — *decisions*. The ladder-adoption rule this volume has repeated since Ch 9 finally gets its instrument: does reranking earn its latency? → context precision before/after. Did HyDE help *your* corpus? → context recall on the vocabulary-miss slice. Is the new chunking better? → both retrieval metrics, same golden set, one change at a time (Vol 02 Ch 16's loop, verbatim). And the regression ritual, now for pipelines: every Ch 11-style failure you ever diagnose becomes a golden-set row, forever. Numbers turn the retrieval ladder from fashion into engineering.

## Why It Matters
Where this appears in real systems and jobs: faithfulness & context recall — measuring groundedness.

## Hands-On
Hand-run the full eval once — no code, maximum understanding (Ch 18 automates what you do today): take 5 questions from your labeled Ch 5/Ch 7 sessions. Per question: (a) *you* label the needed chunks (search the store directly; this is ground-truth authorship — feel how much judgment it takes, that feeling is why golden sets are precious); (b) run the pipeline, compute context recall & precision by hand against your labels; (c) decompose the answer's claims (your Ch 10 output makes this trivial — read them off), judge each claim's support yourself, compute faithfulness; (d) score answer relevance 1–5, gut but written. Produce the 5×4 metric table, then the diagnosis paragraph: which organ is your pipeline's weaker one, on this tiny-but-honest sample? That verdict — retrieval-bound or generation-bound — decides where your Ch 17 build spends its polish. Table + verdict = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the two-organ principle and why end-to-end scores are diagnostic mush.
2. Define all four metrics as arrows between {question, context, answer}.
3. Context recall vs Ch 8's recall@k — same word, different referee: explain the trap.
4. Why is faithfulness *the* groundedness number, and which Ch 10 structure made it computable?
5. Name three ladder decisions from this volume and the exact metric that adjudicates each.


---

# PART III — RAG ON MY OWN BRAIN
*6 chapters. The meta arc: the system answers questions about itself, gets measured honestly, glimpses its graph-shaped future — and the ring closes.*

---

## Wikilinks
[[classical-ml-fundamentals]]
[[citations-grounding]]
[[rag-failure-modes]]
[[prompt-quality]]
[[evaluate-brain-chat]]

## Status log
- Started: 2026-07-21
- Finished: null