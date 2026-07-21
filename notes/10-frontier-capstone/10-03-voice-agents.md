---
id: voice-agents
title: "Voice Agents"
domain: frontier-capstone
ring: 10
cluster: "The Moving Edge (baseline guesses — expect replans)"
type: concept
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["streaming-responses", "small-distilled-models", "cost-latency-budgets", "build-proposal-gate", "voice-landscape"]
tags: [frontier-capstone]
---

## ELI5
Text chat forgives you half a second of thinking. A phone call does not. Say something, and if the other side is silent for two seconds, the conversation is *dead* — humans feel the gap in their bones. Voice agents are your entire stack — model, tools, loop — forced through the needle of human conversational rhythm: **the reply must begin in well under a second.** Every architecture decision in this chapter descends from that single brutal budget.

## The Real Explanation
**The two architectures — the permanent split.** (1) **The cascade**: speech-to-text → LLM → text-to-speech. Three components, each swappable, each observable (you can log the transcript — Vol 07 tracing loves this), each adding latency. It's the modular, debuggable, cheaper path — and the sum of three latencies fights the budget. (2) **Speech-native / realtime models**: one model consumes audio and emits audio, streaming both ways over a persistent connection. Lower floor latency, natural prosody, can be interrupted mid-word — but a blacker box, harder to eval, harder to guard (where do you run the Vol 08 scanner on a live audio stream?). The trade-off is permanent even as the products churn: **modularity and control vs latency and naturalness.**

**The latency budget — engineer it like Vol 04 Ch 17.** Decompose: capture + speech-recognition + LLM time-to-first-token + speech-synthesis onset + network. Your levers are old friends wearing headsets: *streaming everywhere* (Vol 02 Ch 8 — TTFT is the metric that rules voice; synthesis starts on the first sentence, not the last), *small fast models* (Chapter 2 — a voice turn rarely needs a philosopher), *speculative/partial processing* (start reasoning on the interim transcript). Then the problems text never had: **endpointing** (when has the human *finished* talking? — cut in early and you interrupt; wait and you're laggy), **barge-in** (human interrupts the agent → kill synthesis instantly, treat it as a new observation in the loop), and **tool calls mid-call** (a 3-second lookup is an eternity of dead air — mask it with acknowledgment speech: "let me check that…" — a UX trick that is really latency engineering).

**Agent loop, unchanged underneath.** Strip the audio away and it's still reason→act→observe→repeat (Vol 04 Ch 1). The gate still guards writes (a voice agent booking appointments needs Vol 08's proposal gate *more*, not less — no visual confirmation screen exists). Evals extend, not restart: transcript-level evals you already own, plus audio-only dimensions (interruption rate, endpointing errors, perceived latency).

## Why It Matters
Where this appears in real systems and jobs: realtime speech loops; latency budgets.

## Hands-On
Build the *skeleton* to feel the budget (no polish required): mic capture → hosted speech-to-text → your gateway (small fast model, streaming) → hosted text-to-speech, playing the first sentence as soon as it's ready. Measure the full mouth-to-ear loop with honest timestamps at each stage. Then write the two-architecture comparison table for *your* VIZIER: if v2 grew a voice mode, which architecture, and where would the gate and the scanner live? That design paragraph is the artifact; the skeleton is the evidence.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the latency budget decomposition and name the single biggest lever from your own measurements.
2. Cascade vs speech-native: the permanent trade-off in two sentences.
3. What are endpointing and barge-in, and why does barge-in map cleanly onto the agent loop's "observe"?
4. Why does voice make the HITL gate *more* necessary, and where exactly would you put it?
5. Why is TTFT the king metric of voice? Connect it to Vol 02 Ch 8 streaming.


---

## Wikilinks
[[streaming-responses]]
[[small-distilled-models]]
[[cost-latency-budgets]]
[[build-proposal-gate]]
[[voice-landscape]]

## Status log
- Started: 2026-07-21
- Finished: null
