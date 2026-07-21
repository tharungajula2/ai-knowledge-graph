## ELI5
Three researchers investigating three independent leads finish in the time of one — *if* the leads are truly independent. The node summary is two ideas in tension: **fan-out/fan-in; what's safe to parallelize.** Parallelism is the multi-agent superpower for latency (Ch 1's reason 3), and it's a minefield of subtle bugs the moment tasks touch each other. This chapter is the discipline of knowing which is which.

## The Real Explanation
**Fan-out / fan-in — the pattern.** *Fan-out*: the orchestrator splits work into N independent subtasks and dispatches them *concurrently* — not sequentially. *Fan-in*: it waits for all (or enough) to complete and *aggregates* the results. The machinery you already own: `asyncio.gather` (Vol 01 Ch 17 — this was always the destination) runs the N agent calls concurrently; LangGraph expresses fan-out as multiple edges from one node and fan-in as multiple edges *into* one node, with **reducers** (Vol 04 Ch 5) defining how the parallel branches' state-writes merge — which is precisely why reducers exist and why Ch 4's race demo mattered. The wall-clock win is real: N independent 10-second agents finish in ~10 seconds fanned-out, ~10N sequentially.

**The safety question — the chapter's core. What's safe to parallelize?** The single criterion: **independence**. Two subtasks are safe to run in parallel iff neither needs the other's output and neither's *effects* interfere with the other's. Break that into the checklist:
- *Data independence*: subtask B doesn't need A's result (if it does, that's a *dependency* → sequential, or multi-hop, Vol 04 Ch 14 — you cannot parallelize a chain). This is Vol 04 Ch 8's decomposition (independent) vs multi-hop (dependent) distinction, now with a concurrency consequence.
- *Effect independence*: A and B don't write the same state slot (race — Ch 4) or the same external resource (two agents editing one file, calling one rate-limited API, both incrementing a counter). Read-only parallelism is almost always safe; write parallelism needs reducers (for state) or coordination (for the world).
- *Order independence*: the result must not depend on which finishes first (if it does, you have a hidden race even with reducers).

**The honest costs and limits (Ch 1's parallelism footnote, expanded).** *Cost doesn't drop* — you pay for all N agents' tokens regardless of concurrency; parallelism trades money-neutral for latency (know which problem you're solving). *Rate limits bite harder* — N concurrent agents = N× the request rate, straight into Vol 02 Ch 10's 429s; bound concurrency with `asyncio.Semaphore` (Vol 01 Ch 17 — the tool was always there) or provider limits will bound it for you, rudely. *Aggregation is the hard part* — fan-in must combine partial, possibly-conflicting, differently-shaped results (Ch 2's integration challenge, now with N results arriving at once): dedup overlapping findings, reconcile disagreements (a preview of Ch 6's consensus), handle partial failure (3 of 5 agents succeeded — do you proceed with 3, retry 2, or fail? — an explicit policy, not an accident). *Partial failure is normal* — with N concurrent calls, *someone* fails; `gather(return_exceptions=True)` and a degradation policy (Vol 04 Ch 17's honest-partial-return) is mandatory, not optional.

**When to reach — and the anti-pattern.** Reach: genuinely independent subtasks where latency matters (multi-source research, evaluating N candidates, processing a batch). Don't: dependent chains (impossible), tasks where aggregation cost exceeds the latency saved (Ch 7's math — parallelizing three 2-second tasks to save 4 seconds while spending a 6-second aggregation call is a loss), or premature parallelism on a system you haven't gotten *correct* sequentially first (correctness before concurrency — the oldest law in the book; a parallel bug is ten times harder to reproduce, Vol 04 Ch 16's zoo at concurrency difficulty).

## Why It Matters
Where this appears in real systems and jobs: fan-out/fan-in; what's safe to parallelize.

## Hands-On
Build a real fan-out/fan-in on your research agent (~40 lines): (1) Take a question with genuinely independent sub-queries (Vol 04 Ch 8's decomposition produces these) and run the sub-researches two ways — sequential (a loop) and parallel (`gather` with a `Semaphore`) — measure wall-clock and total cost for both. Confirm the thesis: latency drops, cost doesn't. (2) Break it on purpose — parallelize two subtasks that *aren't* independent (B needs A's finding) and watch B hallucinate or fail the missing dependency; that failure is the independence criterion, taught by violation. (3) Aggregation drill — your fan-in gets three findings with one overlap and one disagreement; implement dedup + a disagreement-flag, and a partial-failure policy for when one agent errors (`return_exceptions=True`). The two timings + the dependency-violation specimen + the aggregation policy = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Draw fan-out/fan-in and name the exact machinery (asyncio + LangGraph) for each half.
2. State the independence criterion's three sub-checks with an example of violating each.
3. Why does cost stay flat while latency drops, and what tool bounds the rate-limit hazard?
4. Name the four aggregation challenges of fan-in, and why partial failure is normal not exceptional.
5. Give the anti-pattern and the "correctness before concurrency" law's reasoning.


---

## Wikilinks
[[python-async]]
[[shared-state-patterns]]
[[langgraph-state]]
[[debate-consensus]]
[[token-economics-of-teams]]

## Status log
- Started: 2026-07-21
- Finished: null