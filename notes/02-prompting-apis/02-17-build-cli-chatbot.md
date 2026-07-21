---
id: build-cli-chatbot
title: "Build: CLI Chatbot"
domain: prompting-apis
ring: 2
cluster: "First Ships"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-gateway", "streaming-responses", "context-windows", "long-context-strategies", "build-token-cost-calculator"]
tags: [prompting-apis]
---

## ELI5
Every chapter so far produced a *component*. This build produces a *product shape* — the most famous one in AI: a chatbot. In your terminal, streaming, with a persona and working memory, built on your own gateway. When you finish, the magic trick behind every chat product you've ever used will be fully demystified, because you'll have performed it yourself: **there is no conversation — only a list you keep re-sending.**

## The Real Explanation
A terminal app: `python -m vizchat`, you type, it answers, until `/quit`.

**1. The memory loop — the heart.** One list, three moves:
```python
messages = [{"role": "system", "content": PERSONA}]
while True:
    user_in = input("\nyou > ")
    if handle_command(user_in): continue          # /quit /clear /usage /save
    messages.append({"role": "user", "content": user_in})
    reply = gateway.complete(messages, stream=True)    # YOUR gateway (Ch 11)
    messages.append({"role": "assistant", "content": reply.text})
```
Append user turn → send *everything* → append assistant turn. That's a chatbot. All of it. Chapter 1's statelessness experiment, solved by hand — and now you *feel* why turn 40 costs what your Vol 01 calculator predicted: the list grows, and you re-send the list.

**2. Streaming.** Ch 8's iterator, printed token by token with `flush=True` — the bot must *feel* alive. (Reassembly matters here: the streamed chunks must be joined and appended to `messages`, or the bot forgets its own last answer — a classic bug; write the test.)

**3. A persona.** A real system prompt exercising Ch 2 and Ch 3: give it a name, a voice, a scope, a format rule. Make it yours — a study-buddy for the Vizier journey is the obvious candidate ("You are VIZ, a patient senior engineer; explain with Indian-daily-life analogies; keep answers under 150 words unless asked to go deep"). Watching *your* persona hold across 20 turns is Ch 2's persistence claim, verified personally.

**4. In-session memory management — the M-node's real meat.** The list grows without bound; the window (Vol 01, Ch 8) does not. Implement a **token budget**: before each send, count the message list with your `tokentools`; while over budget (say 4k for the exercise — artificially low *so you actually hit it* in one session), do sliding-window trimming — drop oldest turns, **never the system prompt** (drop it and watch the persona dissolve mid-chat — do this once on purpose; it's the most instructive bug in the build). Stretch goal, and the bridge to Domain 06: instead of dropping old turns, *summarize* them — one LLM call compressing dropped turns into a paragraph prepended as context (Ch 15's Move 3, running live inside your own product). Print a small `[trimmed N turns, ~M tokens]` notice when it happens — visible mechanics teach.

**5. Commands & meter.** `/quit`, `/clear` (reset to system prompt), `/save` (dump transcript to JSON — Ch 15 of Vol 01's file round-trip), and `/usage` — per-session tokens and cost from your gateway's ledger, printed on demand and at exit. Cost-consciousness in the product's UI: the engineer's signature.

**6. Tests.** The memory logic is pure functions — perfect pytest targets (Vol 01, Ch 21): trimming never removes the system prompt; trimming actually gets under budget; streamed reply is correctly reassembled and appended; `/clear` resets properly. The chatbot itself is interactive; its *organs* are testable — learning to structure code so the testable parts separate from the interactive shell is itself a professional lesson.

## Why It Matters
Where this appears in real systems and jobs: terminal chatbot with in-session memory, streaming, a persona.

## Hands-On
Build it. Then run one honest 20+ turn conversation with your persona: reference something from turn 2 at turn 15 (memory works), blow past your artificial token budget (watch trimming fire), check `/usage`, `/save` the transcript, and put transcript + cost figure in the note. Break-it drill: comment out the assistant-append line and observe the bot amnesia its own answers — then explain in one sentence *why* that exact bug produced that exact behavior. Feature branch → tests green → merge → tag `vizchat-v0.1`.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the three-move memory loop and state which single line makes it "a conversation."
2. Why must the system prompt survive every trim? Describe what you saw when it didn't.
3. Sliding-window vs summarization trimming: cost, quality, and what each loses.
4. Where do your gateway, tokentools, and streaming skills each plug in — one sentence per.
5. Your bot at turn 30 is slower and pricier than turn 3 — explain mechanically, and name the Ch 10 feature that softens it.


---

## Wikilinks
[[build-gateway]]
[[streaming-responses]]
[[context-windows]]
[[long-context-strategies]]
[[build-token-cost-calculator]]

## Status log
- Started: 2026-07-21
- Finished: null
