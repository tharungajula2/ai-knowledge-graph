## ELI5
Every chapter so far improved the *library* — better chunks, better indexes, better ranking. This one improves the *question*. Users ask vague, jargon-mismatched, pronoun-riddled, multi-part questions, and retrieval is only as good as the query vector it starts from — garbage question, garbage neighbors. The node summary says it exactly: **fixing bad questions before retrieval.** The medicine cabinet has four bottles, and one of them — HyDE — is delightfully counterintuitive: *fix the question by hallucinating the answer.*

## The Real Explanation
**1. Query expansion / rewriting.** One LLM call (your gateway, cheap model, temperature ~0.7 for variety) turns the user's phrasing into 2–3 *alternate phrasings*: layman → jargon, jargon → layman, synonyms swapped. Run retrieval for all variants, fuse with — of course — **RRF** (Ch 7's pure function, reused verbatim on multi-query lists; this exact combo ships in frameworks as "multi-query retrieval," and you already own both halves). Directly treats Ch 11's vocabulary-miss: *some* phrasing will speak the corpus's dialect. Cost: one cheap LLM call + parallel searches (`asyncio.gather` — Vol 01 Ch 17, again).

**2. Conversational rewriting (the follow-up fixer).** In chat, the killer isn't vocabulary — it's *context-dependence*: "what about its memory?" is unsearchable; *its* lives three turns back. The fix: before retrieval, an LLM call sees recent history + the new message and emits a **standalone query** ("what is the memory architecture of the LangGraph checkpointer?"). Mechanical, unglamorous, and the single highest-value query fix in any conversational RAG — your Ch 17 chat-with-brain build makes this mandatory equipment, and note the pattern's shape: it's Vol 02 Ch 17's history-management thinking, pointed at retrieval.

**3. Query decomposition.** "Compare how domain 03 and domain 06 handle staleness" is *two* retrievals wearing one question's clothes — no single query vector lands on both partitions well. Decompose (LLM call, structured output: `list[str]` of sub-queries), retrieve per sub-query, pool the chunks, answer over the union. This is the gentle slope that leads to Ch 14 (multi-hop) — decomposition handles questions whose parts are *independent*; multi-hop handles parts that *depend on each other's answers*. Draw that line now; next chapter walks across it.

**4. HyDE — Hypothetical Document Embeddings.** The counterintuitive star. Problem: Ch 2's asymmetry — questions and answers are different *kinds* of text, and even question-trained embedders feel the gap. HyDE's move: ask an LLM to **write a fake answer** to the query — a plausible, hallucinated-freely paragraph in the *style of the corpus* — then **embed the fake answer instead of the question** and retrieve with that. Why it works is the beautiful part: the hallucination's *facts* may be garbage, but its *form* — vocabulary, register, sentence shapes — matches real answer-documents, so it lands in the right *neighborhood* of meaning-space (Vol 01, Ch 5's geometry: you're throwing a decoy shaped like the target). The retrieved chunks are real; the fake answer is discarded; generation proceeds grounded as always. **Hallucination, weaponized for good — used only where being wrong is safe** (locating a neighborhood) and never where truth matters (the final answer). That sentence is the whole trick and a genuinely great interview moment. Costs: an extra LLM call of latency; and HyDE can *underperform* plain retrieval when queries are already corpus-dialect (the decoy adds noise) — which is why the ladder's rule returns: adopt by evidence, not fashion.

**The economics of the whole cabinet.** Every medicine here spends an LLM call (~cheap, ~200–500ms) to improve retrieval. When to spend: expansion/HyDE for vocabulary-mismatched or exploratory queries; conversational rewriting *always* in chat; decomposition when compound structure is detected (an LLM router can detect it — structured output, again). When not: keyword-exact queries (Ch 6's territory — an identifier lookup needs no poetry). A production pattern to bank: route queries by type, spend surgery only where the golden set proves it pays (Ch 16 — three chapters running, the evidence drum beats).

## Why It Matters
Where this appears in real systems and jobs: fixing bad questions before retrieval.

## Hands-On
Two experiments, ~30 lines total on your pipeline. **(A) Multi-query**: take your 3 worst vocabulary-miss queries (Ch 5/Ch 11 sessions — you have them labeled), generate 3 variants each via gateway, retrieve-all + RRF-fuse, record rank-of-correct-chunk before/after. **(B) HyDE**: same 3 queries — generate a fake answer, embed it, retrieve; compare against both plain and multi-query. Build the 3×3 result table {plain, multi-query, HyDE} and read the fake answers side by side with the real retrieved chunks — *see* the form-matches-despite-wrong-facts effect with your own eyes (or catch its failure, equally instructive). Table + one paragraph on which medicine your brain's corpus responds to = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four medicines and the specific disease each treats.
2. Why does multi-query end in RRF, and what does that reuse say about pure functions?
3. Explain HyDE's mechanism via the decoy metaphor, and state exactly where hallucination is safe vs forbidden.
4. Draw the decomposition/multi-hop boundary line.
5. Which queries deserve no surgery at all, and what governs adoption of any of this?


---

## Wikilinks
[[embeddings-hands-on]]
[[build-hybrid-search]]
[[rag-failure-modes]]
[[hallucination]]
[[multi-hop-retrieval]]

## Status log
- Started: 2026-07-21
- Finished: null