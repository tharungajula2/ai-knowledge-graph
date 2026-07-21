---
id: synthesis-apis
title: "Synthesis: The API Layer"
domain: prompting-apis
ring: 2
cluster: "First Ships"
type: synthesis
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: []
tags: [prompting-apis]
---

## ELI5
Volume 01's synthesis explained the machine. This one explains the *call* — the full journey of one request through everything you now own, start to finish, no hand-waving. When you can narrate this path cold, you don't "know some prompting"; you understand the API layer the way a plumber understands pipes: every joint, every valve, every place it leaks.

## The Real Explanation
A user's question enters your application. Code fills a **prompt template** — ROLE and standing rules already living in the **system prompt**, per-request data delimited in the user message [Ch 2, 3], worked **examples** riding along to pin the pattern [Ch 4], perhaps a "think step by step" scaffold if the task reasons [Ch 5]. The **gateway** [Ch 11] takes over: checks the **cache** (exact-match today, semantic tomorrow) [Ch 10]; on miss, acquires a **semaphore** slot, picks the primary provider, and fires the HTTPS POST — key from the environment, never the code [Ch 1]. The provider tokenizes, the model attends, and tokens begin flowing back as a **stream** [Ch 8] — or the response carries a **tool-call request** instead, which your code executes and feeds back, looping [Ch 7]. If the wire hiccups — 429, 503, timeout — **backoff with jitter** retries what's retryable; a dead provider triggers the **fallback chain**, and the caller never knows [Ch 9, 11]. The reply, if structured, must survive the **schema bouncer** — validate, self-repair, or fail loudly [Ch 6] — because everything crossing the model boundary is untrusted, including against **injection** riding in the data [Ch 12]. Images came in as just another content part [Ch 13]; voice was two converters bracketing this same path [Ch 14]; documents too big for the window chose stuffing, retrieval, or summarization before any of this began [Ch 15]. The **ledger** logs tokens, latency, cost, cache-hit [Ch 11]; the conversation list grows and gets **trimmed against its token budget** [Ch 17]; and whether any of this *actually works well* is a question answered only by the **golden set**, never by vibes [Ch 16].

## Why It Matters
Where this appears in real systems and jobs: the whole call path, explained start to finish.

## Hands-On
Three renditions, same protocol as Vol 01: **(a)** The narration, written, ≤700 words, your words, every chapter's component present and correctly ordered. **(b)** The napkin: one diagram of the full call path — app → template → gateway (cache/semaphore/fallback) → provider → stream/tool-loop → validator → ledger — with the failure paths (429, injection, validation-fail) drawn as red arrows. Photograph into the note. **(c)** The 90-second spoken version — and this one has a live audience waiting: it is *precisely* the answer to the interview question "walk me through what happens when a user sends a message to an AI product." Record it, listen once, fix the weakest sentence, record again. Any chapter you glossed: reopen before lighting.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 90-second version cold.
2. Trace a request that hits: cache miss → primary 429 twice → succeeds → malformed JSON → repaired. Name every mechanism that fired, in order.
3. Where are the *three* untrusted-input boundaries in the path, and what guards each?
4. Which two components exist purely so the caller never notices failure? 
5. Draw the napkin from memory.


---

## Wikilinks
[[synthesis-apis]]

## Status log
- Started: 2026-07-21
- Finished: null
