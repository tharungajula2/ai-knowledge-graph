---
id: retrieval-and-decay
title: "Retrieval & Decay"
domain: memory-knowledge
ring: 6
cluster: "Agent Memory"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["embeddings-hands-on", "memory-extraction", "compaction-summarization", "privacy-in-memory", "reranking"]
tags: [memory-knowledge]
---

## ELI5
You've extracted memories (Ch 3); now the two questions that make a store *useful* instead of merely *full*: which memories surface when, and which ones fade away. The node summary names all three levers: **importance, recency, forgetting on purpose.** Pure similarity search (Vol 03) is not enough for memory — the *right* memory to surface isn't just the most *similar* one; it's the most *relevant-now*, weighing what matters, what's recent, and what's proven useful. And forgetting isn't a failure of memory; it's a feature — the thing that keeps a store sharp.

## The Real Explanation
**Why similarity alone fails for memory.** Document-RAG ranks by semantic similarity and stops (Vol 03). But memories have properties documents don't: some are *more important* than others (your career goal > a passing comment), some are *more recent* (last week's decision > last year's, when they conflict), some have *proven useful* (a memory retrieved and confirmed helpful before). A memory-retrieval score that ignores these surfaces the similar-but-trivial over the crucial-but-differently-worded. The canonical fix — the memory-scoring formula worth knowing (popularized by generative-agents research):
**score = α·similarity + β·importance + γ·recency (+ δ·usage)** — a weighted blend, tuned to your system.
- *Similarity*: Vol 03's cosine — is this memory *about* what's being discussed?
- *Importance*: a stored salience score (assigned at extraction — "how significant is this?" — an LLM judgment, Ch 3's confidence's cousin), so crucial memories outrank trivia even at equal similarity.
- *Recency*: newer memories weighted up — usually a *decay function* of age (see below), so fresh context beats stale.
- *Usage* (optional): memories that have been retrieved-and-helped before get boosted — the store learns which memories earn their keep (a feedback loop; careful, it can entrench).

**Recency as decay — forgetting built into scoring.** Recency is typically an *exponential decay*: a memory's recency weight = e^(−λ·age), so influence fades smoothly with time (λ tunes the half-life). This is *soft* forgetting — old memories don't vanish, they just lose pull unless something (importance, repeated relevance) keeps them alive. It mirrors human memory beautifully: the unimportant-and-old fades; the important-or-recently-relevant stays vivid. And it solves a real problem — without recency decay, a store full of years of memories retrieves ancient irrelevancies with the same force as yesterday's crucial fact.

**Forgetting on purpose — the hard-forgetting spectrum.** Soft decay (above) is one end; the spectrum runs to true deletion:
- *Decay* (soft): influence fades, memory remains. Reversible if it becomes relevant again.
- *Archival*: move cold memories to slow/cheap storage, out of the hot retrieval path but recoverable. Keeps the working store fast.
- *Compaction* (Ch 6): merge many specific memories into one general one ("liked burgers on Tue, pizza on Fri, tacos on Sat" → "enjoys fast food") — forgetting *detail* while keeping *essence*.
- *Hard deletion*: gone. Required for privacy (Ch 8 — a "forget me" request, GDPR's right-to-erasure), for corrections (a false memory, Ch 3), and for hygiene (genuinely obsolete facts). The design imperative: **a memory store must support deletion by design** — retrofitting "forget this specific thing" onto a system that assumed permanence (especially once memories are embedded, summarized, and entangled — Ch 6) is a nightmare Ch 8 will make you feel.

**The design synthesis — why forgetting is a feature.** An agent that remembers *everything* forever is not smarter; it's slower (retrieval over a bloated store), noisier (trivia crowds signal — the precision problem), more expensive (storage and search costs grow), and a privacy liability (every retained fact is a potential leak). Deliberate forgetting — decay, archival, compaction, deletion — is what keeps memory *sharp, fast, relevant, and safe*. The best memory systems forget *well*, and forgetting-well is a design skill, not an oversight. Say it plainly: **the goal is not maximal recall; it's optimal relevance** — and that requires letting go.

## Why It Matters
Where this appears in real systems and jobs: importance, recency, forgetting on purpose.

## Hands-On
Build the scoring, feel the decay (~40 lines on your Ch 1 store): (1) Implement the memory-scoring formula — add importance (LLM-assigned at extraction) and an exponential recency-decay term to your Vol 03 retrieval, over your memory tables. Take a set of memories with varied importance and age, and a query; show how pure-similarity ranking vs blended ranking surface *different* top memories — the specific memory that similarity buried and importance/recency rescued is the lesson. (2) Tune the decay: vary λ and watch old-vs-new balance shift; find the half-life that feels right for your use and write why. (3) Design the forgetting policy: for your store, write the one-paragraph policy — what decays, what archives, what compacts, what hard-deletes, and the trigger for each. The ranking comparison + the λ experiment + the forgetting policy = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does similarity-alone fail for memory retrieval? Name the three (or four) scoring factors and what each contributes.
2. Explain recency as exponential decay, what λ tunes, and why it's *soft* forgetting.
3. Recite the forgetting spectrum from decay to deletion, with each one's purpose.
4. Why must deletion be designed in, not retrofitted — and which later chapter makes you feel this?
5. Defend "the goal is optimal relevance, not maximal recall" — the four costs of remembering everything.


---

## Wikilinks
[[embeddings-hands-on]]
[[memory-extraction]]
[[compaction-summarization]]
[[privacy-in-memory]]
[[reranking]]

## Status log
- Started: 2026-07-21
- Finished: null
