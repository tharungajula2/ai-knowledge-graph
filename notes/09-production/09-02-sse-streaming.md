---
id: sse-streaming
title: "SSE & Streaming"
domain: production
ring: 9
cluster: "The Backend Craft"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["streaming-responses", "build-fastapi-backend", "python-async", "build-command-center"]
tags: [production]
---

## ELI5
You built token streaming in the terminal (Vol 02 Ch 8) — but how do tokens get from a *server* to a *browser* in real time? The node summary: **how tokens travel from server to screen.** Server-Sent Events (SSE) is the web technology that makes the "typewriter effect" of ChatGPT possible over HTTP — a one-way channel from server to client that streams data as it's generated. This chapter is the wire-level understanding of what your Ch 1 streaming endpoint actually does.

## The Real Explanation
**The problem SSE solves.** Normal HTTP is request→response→done: the client asks, the server answers completely, the connection closes. But LLM generation is *incremental* (Vol 01 Ch 3 — token by token) and *slow* (Vol 02 Ch 8 — waiting for the whole response feels broken). You need the server to send *partial* data *as it's produced*, over a connection that *stays open*. Three technologies can: *polling* (client repeatedly asks "any more?" — wasteful, laggy), *WebSockets* (full bidirectional channel — powerful but heavier, overkill for one-way token streaming), and *SSE* (a lightweight, one-way, server→client stream over plain HTTP — the right fit for LLM tokens: the server pushes, the client receives, no complexity you don't need).

**How SSE works — the mechanism.** The server responds with `Content-Type: text/event-stream` and *keeps the connection open*, writing events as they occur in a simple text format: `data: {token}\n\n` per event (each event a chunk of the response). The browser's `EventSource` API (or a fetch-stream reader) receives each event as it arrives and appends it to the UI — the typewriter effect (Vol 02 Ch 8's TTFT payoff, now on screen). It's *plain HTTP* (works through proxies, firewalls, no special protocol — an advantage over WebSockets), *auto-reconnecting* (the browser reconnects if the connection drops — resilience built in), and *one-way* (server→client only — which is all token streaming needs; the client's request already went via a normal POST).

**The server side — async generators (your Ch 1 endpoint, explained).** In FastAPI, an SSE endpoint returns a `StreamingResponse` wrapping an *async generator* (Vol 01 Ch 17's async, now generating): the generator `yield`s formatted SSE events as your LLM streams tokens (Vol 02 Ch 8's gateway streaming, piped through). `async for token in llm_stream: yield f"data: {token}\n\n"` — the tokens flow from the provider, through your server, to the browser, live. The key insight: your server is a *pipe* — it receives the provider's stream and re-emits it to the client, adding your logic (auth, logging, guardrails Vol 08 Ch 11) in the middle without breaking the flow.

**The production realities (streaming is harder than it looks).** *Buffering* (proxies/load balancers may buffer the stream, defeating it — you disable buffering for SSE routes; a classic "why isn't my stream streaming?" bug). *Connection management* (open connections consume server resources — Ch 28's scaling; too many concurrent streams exhaust the server). *Mid-stream errors* (the LLM fails at token 200 — Vol 02 Ch 8's reassembly problem, now over the network: you send an error event and the client handles it). *Client disconnect* (the user closes the tab mid-stream — the server should detect it and stop generating, or it wastes tokens generating for nobody — Vol 04 Ch 17's cost, wasted). *Structured data* (Vol 02 Ch 8 — half-streamed JSON doesn't parse; stream prose, buffer structured payloads). Handling these is the difference between a demo stream and a production one.

## Why It Matters
Where this appears in real systems and jobs: how tokens travel from server to screen.

## Hands-On
Understand and harden your streaming (concept node, concrete): (1) Trace one token's journey end to end: provider generates it → your gateway yields it → your FastAPI async generator formats it as an SSE event → the browser's EventSource receives it → the UI appends it. Draw every hop. (2) On your Ch 1 endpoint, hit the classic bugs: introduce a buffering proxy (or simulate) and watch the stream break, then disable buffering and watch it work; simulate a client disconnect and confirm your server stops generating (add the detection). (3) Handle a mid-stream error gracefully (send an error event, client displays it). The token-journey diagram + the buffering fix + the disconnect handling = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why can't normal request/response HTTP stream LLM tokens, and how does SSE solve it?
2. Compare SSE to polling and WebSockets — why is SSE the right fit for token streaming?
3. Describe the SSE mechanism — the content-type, the event format, the open connection.
4. How does an async generator make a FastAPI endpoint stream, and why is the server a "pipe"?
5. Name three production realities of streaming and the bug each causes if unhandled.


---

## Wikilinks
[[streaming-responses]]
[[build-fastapi-backend]]
[[python-async]]
[[build-command-center]]

## Status log
- Started: 2026-07-21
- Finished: null
