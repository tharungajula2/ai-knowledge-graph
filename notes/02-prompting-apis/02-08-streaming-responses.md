---
id: streaming-responses
title: "Streaming"
domain: prompting-apis
ring: 2
cluster: "Engineering the Call"
type: build
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["python-async", "what-is-a-language-model", "build-cli-chatbot", "structured-output"]
tags: [prompting-apis]
---

## ELI5
Generation is token-by-token (Vol 01, Ch 3) — so why wait for the whole answer before showing anything? A 40-second silence feels broken; the same 40 seconds watching words flow feels alive. **Streaming** ships each token the moment it's born. Every chat product you've ever admired does this; today your terminal does it too.

## The Real Explanation
**What changes on the wire.** Non-streaming: one request → one complete JSON response. Streaming: one request → a held-open HTTP connection delivering a *sequence of small events* (the underlying web standard is SSE — server-sent events), each carrying a token-chunk; a final event carries the finish reason and usage. SDKs wrap this as an iterator:
```python
stream = client.models.generate_content_stream(model="gemini-2.5-flash", contents=prompt)
full = []
for chunk in stream:
    print(chunk.text, end="", flush=True)   # flush! — or the terminal buffers your magic
    full.append(chunk.text)
answer = "".join(full)                       # you own reassembly now
```
**The two latency numbers, forever distinct in your vocabulary:** **TTFT** (time to first token — how fast it *feels*) vs **total generation time** (how fast it *is*). Streaming doesn't speed generation at all; it collapses *perceived* latency from total-time down to TTFT. Users forgive long answers that start instantly; they abandon short answers that stall. This distinction runs your dashboards in the production domain.

**What you inherit by streaming (the honest costs):** *reassembly* — you accumulate chunks if you need the full text afterward (for logs, for the next conversation turn); *mid-stream errors* — connections can die at token 500 of 800, so decide per-product: retry from scratch, show partial with a warning, or resume; *structure friction* — token-streams of half-finished JSON don't parse (Ch 6's parsers want complete objects), so real apps stream prose to the eye but buffer structured payloads to completion — or stream *display* text while a separate non-streamed call produces the JSON; *tool-call interplay* — in agent turns (Ch 7), the stream may deliver a tool-call part instead of prose; your loop must notice mid-stream. In async apps (Vol 01, Ch 17), the same iterator is `async for` — and that's precisely how a FastAPI endpoint will one day relay tokens to a browser.

## Why It Matters
Where this appears in real systems and jobs: tokens flowing into the terminal, live.

## Hands-On
Build `stream_demo.py`, three acts: (1) same long prompt ("explain all ten domains of an AI curriculum in detail") run non-streaming then streaming, with `time.perf_counter()` measuring TTFT and total for both — print a tidy comparison table (expect: identical-ish totals, wildly different TTFT); (2) reassembly — accumulate the stream, assert the joined text is non-empty, save it; (3) a typewriter upgrade — print with a tiny `time.sleep(0.01)` per chunk for the classic terminal effect. Paste your timing table into the note; those two numbers are the chapter.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What actually travels over the wire in streaming vs non-streaming?
2. TTFT vs total time — define both; which does streaming improve, and which does it not touch?
3. Why does structured output resist streaming, and what are the two production workarounds?
4. What three burdens does the client inherit when it opts into streaming?
5. Where does async streaming show up in your future stack?


---

## Wikilinks
[[python-async]]
[[what-is-a-language-model]]
[[build-cli-chatbot]]
[[structured-output]]

## Status log
- Started: 2026-07-21
- Finished: null
