## ELI5
A 400-page contract, a codebase, a year of support tickets — and a question about it. You have three moves: **stuff** it all into the giant context window; **retrieve** only relevant pieces per question; or **summarize** it down in stages. Every "chat with your documents" product on Earth is one of these three, or a hybrid. Knowing which to reach for — and what each silently costs — is a daily architect decision, and interviewers adore it because it has no one right answer, only tradeoffs reasoned well.

## The Real Explanation
**Move 1 — Stuffing.** Everything in context; ask directly. *For it:* zero infrastructure, zero retrieval risk — the model sees *all* of it, so cross-document connections ("compare clause 4 with appendix C") come free; today's 128k–1M windows genuinely fit small corpora. *Against it:* Vol 01 Ch 8's twin ghosts — cost (you pay for every token *every question*; 500k tokens × 20 questions = 10M input tokens billed) and *lost-in-the-middle* (attention quality sags mid-context; stuffed ≠ attended). Latency grows too (prefill time scales with input). *Mitigation that changes the math:* prompt caching (Ch 10) — stable-prefix the document once, pay ~10% on re-sends; for a doc questioned repeatedly in one session, stuffing + caching is shockingly viable. *Verdict:* small corpus, many cross-cutting questions, session-shaped usage → stuff.

**Move 2 — Retrieval.** Index once (chunks + embeddings, Vol 01 Ch 5); per question, fetch top-k relevant pieces into context. *For it:* per-question cost is tiny and *flat* regardless of corpus size — the only move that scales to gigabytes; focused context also dodges lost-in-the-middle. *Against it:* real infrastructure (chunking, embedding, vector store, and a new failure surface — retrieval can *miss*, and the model can't use what wasn't fetched: "garbage retrieved, garbage grounded"); cross-document synthesis questions suffer when relevant pieces don't co-retrieve. *Verdict:* large/growing corpus, many users, pointed questions → retrieve. This move is so central it owns your entire next ring — Domain 03 — so here, just place it on the map.

**Move 3 — Summarizing.** Compress in stages: chunk → summarize each → summarize the summaries (map-reduce shape); or *refine* — running summary updated chunk by chunk. *For it:* handles corpora beyond any window; produces a durable artifact (the summary itself has value — think "brief me on this deal room"); it's also *exactly* how chat memory works (old turns compressed to a running summary — Domain 06 preview, and your Chapter 17 build meets a baby version). *Against it:* **lossy by design** — the detail your question needed may be the detail compression discarded, and hierarchical summaries can compound small distortions; slow and costs LLM calls up front. *Verdict:* the task *is* synthesis/overview, or the corpus dwarfs everything → summarize.

**The architect's decision table** — commit the axes, not answers: corpus size vs window; question type (pointed lookup → retrieval; global synthesis → stuffing if it fits, else summarize); query volume (one-off → stuff; thousands/day → retrieval's flat cost wins); freshness (corpus changes hourly → retrieval with re-indexing beats re-stuffing); budget. And the pro answer to memorize because it's usually correct: **hybrids** — retrieve *then* stuff generously (top-50 chunks, not top-5, into a big window); summarize *then* retrieve over summaries + drill into originals; stuff the contract but retrieve the case law. The three moves are ingredients, not rivals.

## Why It Matters
Where this appears in real systems and jobs: stuffing vs retrieval vs summarizing.

## Hands-On
No build — a decision drill, on paper, timed like an interview. Four scenarios, and for each: chosen strategy (or hybrid), the two axes that decided it, cost sketch (rough token math — your `tokentools` prices), and the failure mode you're accepting. (a) Startup lawyer, one 300-page contract, ~30 questions over two days. (b) Support bot over 200k historical tickets, 5k queries/day. (c) "Brief the CEO on these 40 candidate resumes" — one deliverable. (d) Chat over your own Vizier brain notes — currently ~small, growing weekly for years. Write all four into the note; (d)'s answer is literally your Domain 03 capstone build being designed early — mark it.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the three moves and each one's one-line superpower and one-line curse.
2. Why doesn't a 1M window kill retrieval? Two independent reasons.
3. How does prompt caching change stuffing's economics — for which usage shape?
4. What is lossy about summarization *by design*, and which question types does it betray?
5. Give one hybrid pattern and the scenario where it's the obviously right call.


---

## Wikilinks
[[context-windows]]
[[rate-limits-caching]]
[[embeddings-intuition]]
[[hallucination]]

## Status log
- Started: 2026-07-21
- Finished: null