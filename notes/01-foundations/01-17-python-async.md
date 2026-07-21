---
id: python-async
title: "Async/Await"
domain: foundations
ring: 1
cluster: "The Engineer's Floor"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["python-classes-modules", "python-craft-professional", "context-windows"]
tags: [foundations]
---

## ELI5
A waiter takes table 1's order, walks it to the kitchen — and then just *stands there staring at the oven* until the food is done, while tables 2–8 starve. Absurd, yet that's synchronous code: when you call an LLM API (2–30 seconds!), sync code freezes the entire program to wait. **Async** is the sane waiter: fire the order, serve other tables, come back when the kitchen bell rings. AI apps are *made of* long waits — that's why every serious AI codebase is async.

## The Real Explanation
**The one distinction that matters:** CPU-bound work (crunching numbers — your code is busy) vs **IO-bound** work (waiting on network/disk — your code is *idle*). LLM calls, embedding calls, DB queries, web fetches: all IO-bound. Async is the tool for IO-bound concurrency: one thread, many paused-mid-wait tasks, an **event loop** juggling them.
```python
import asyncio

async def call_llm(prompt: str) -> str:      # async def → a coroutine
    await asyncio.sleep(2)                    # stand-in for a real API call
    return f"answer to: {prompt}"

async def main():
    answers = await asyncio.gather(           # run all three CONCURRENTLY
        call_llm("q1"), call_llm("q2"), call_llm("q3")
    )                                         # 2 seconds total, not 6
    print(answers)

asyncio.run(main())
```
Decoder ring: `async def` marks a function pausable; `await` means "pause me here, event loop — go run someone else, resume me when this finishes"; `asyncio.gather` = "start all of these, give me all results"; `asyncio.run` starts the loop. The two laws: you can only `await` inside `async def`, and calling a coroutine without `await` does *nothing* (you get an unrun coroutine object — the #1 beginner bug, watch for the `RuntimeWarning: coroutine was never awaited`). The #2 bug: putting a *blocking* call (like `time.sleep` or the sync `requests` library) inside async code — it freezes the whole event loop, every table starves again; use async-native libraries (`httpx`, `aiohttp`) or `asyncio.to_thread` for stubborn sync code. Real-world guardrail: hitting an API with 500 concurrent calls triggers rate limits, so production code bounds concurrency with `asyncio.Semaphore` — fire in controlled batches.

**Why this chapter is load-bearing for your whole brain:** batch-embedding thousands of RAG chunks, multi-agent fan-out, streaming tokens to a UI, FastAPI endpoints (`async def` handlers), and your own agent-lab's async MCP bridge — one of its two "greatest hurdles" — are all this exact pattern. You are learning the hurdle's vocabulary now, calmly, before rebuilding it by hand.

## Why It Matters
Where this appears in real systems and jobs: why AI apps need it; hands-on.

## Hands-On
Write `race.py`: the fake `call_llm` above with a random 1–3s sleep. Run 5 calls sequentially (a plain loop with `await` one-by-one) and time it; then the same 5 via `gather` and time it. Print both durations. Then add a `Semaphore(2)` wrapper and watch 5 calls complete in ~2-call waves. Break it on purpose: call `call_llm("x")` without `await`, observe the warning, fix it. The timing printout is your artifact — it *proves* concurrency happened.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. IO-bound vs CPU-bound — define both and say which one async helps and why.
2. Narrate exactly what happens at an `await`, mentioning the event loop.
3. Sequential loop vs `gather` over 5 two-second calls: total time each, and why?
4. Name the two classic async bugs and the symptom of each.
5. Why must AI applications specifically be async? Name three concrete cases from your future domains.


---

## Wikilinks
[[python-classes-modules]]
[[python-craft-professional]]
[[context-windows]]

## Status log
- Started: 2026-07-21
- Finished: null
