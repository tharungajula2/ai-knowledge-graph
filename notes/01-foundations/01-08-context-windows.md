---
id: context-windows
title: "Context Windows"
domain: foundations
ring: 1
cluster: "How AI Works"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["tokens", "attention-transformers", "hallucination", "build-token-cost-calculator"]
tags: [foundations]
---

## ELI5
An LLM is a genius with a whiteboard. Everything it can consider right now — your instructions, the conversation so far, documents you pasted, its own answer as it writes — must fit on that one whiteboard. The whiteboard is the **context window**, it's measured in tokens, and when it's full, something must be erased. The model has no other memory. None. Everything that looks like memory in AI products is engineering built *around* this whiteboard.

## The Real Explanation
**What counts against it.** Everything: the system prompt, every user and assistant turn so far, retrieved documents, tool definitions and tool results, and the tokens of the answer being generated. Typical sizes today range from ~128k tokens to 1M+ on frontier models (~a long novel to several novels). Sounds huge; real agent sessions with tool results and codebases devour it shockingly fast.

**The statelessness bombshell.** The API is stateless: the model retains *nothing* between calls. A "conversation" is an illusion your application maintains by re-sending the entire history with every single message. Message 50 of a chat re-sends messages 1–49. Two consequences you'll engineer around forever: (1) cost grows with conversation length — you pay for the whole history every turn (mitigated by *prompt caching*, which discounts re-sent identical prefixes); (2) when history exceeds the window, your app must decide what to drop or summarize — the model won't decide for you, it will just error or lose the tail.

**Long context ≠ solved memory.** Two gotchas. **Quadratic cost** (Chapter 6): attention over 1M tokens is expensive and slow, so long-context calls cost real money and latency. **Lost in the middle:** models empirically recall the beginning and end of a huge context better than the middle — dumping 900k tokens of documents in does not mean 900k tokens of *attention-quality*. This is precisely why retrieval (Domain 03) exists: instead of the whole library on the whiteboard, fetch the 3 relevant pages. And it's why Domain 06 (memory) exists: summarize, store outside, re-inject selectively.

## Why It Matters
Where this appears in real systems and jobs: the model's short-term memory and what fits.

## Hands-On
Do context-window accounting for a real scenario, with Chapter 4's rules of thumb: a customer-support bot with a 2,000-token system prompt, a user on message 30 (average 80 tokens/message both sides), plus 3 retrieved docs of 1,500 tokens each. Total so far? How many more turns until you blow a 32k window? Now propose two engineering fixes and note which future domain each one belongs to (retrieval → 03, summarization/memory → 06).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. List five things that all share the same context window.
2. "The model remembers our chat." Correct this sentence with the stateless truth, mechanically.
3. Why does turn 50 cost far more than turn 2, and what feature softens this?
4. What is "lost in the middle," and what does it imply about dump-everything prompting?
5. Explain in two sentences why context limits are the *reason* RAG and memory systems exist.


---

## Wikilinks
[[tokens]]
[[attention-transformers]]
[[hallucination]]
[[build-token-cost-calculator]]

## Status log
- Started: 2026-07-21
- Finished: null
