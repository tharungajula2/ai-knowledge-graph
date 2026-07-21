---
id: tokens
title: "Tokens"
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
wikilinks: ["what-is-a-language-model", "context-windows", "build-token-cost-calculator", "embeddings-intuition"]
tags: [foundations]
---

## ELI5
Models don't read letters and don't read words. They read **tokens** — Lego bricks of text, somewhere between a letter and a word. "unbelievable" might be three bricks: `un` + `believ` + `able`. Every price you pay, every context limit you hit, and several famous model failures are all about these bricks.

## The Real Explanation
**Why not letters or words?** Letters make sequences brutally long (every extra position costs compute). A dictionary of whole words explodes into millions of entries and dies on typos and new words. The compromise: **subword tokenization** (the common algorithm family is BPE — byte-pair encoding). Build a vocabulary of ~50k–200k frequent *chunks*: common words stay whole (`the`, ` house`), rare words split into pieces (`electro` + `magnet` + `ism`), and anything — any typo, any emoji — is representable from small pieces. Note the leading spaces: ` house` (with space) and `house` are different tokens.

**The rules of thumb you'll use weekly.** In English, 1 token ≈ 4 characters ≈ ¾ of a word; 1,000 tokens ≈ 750 words. Code tokenizes less efficiently (lots of symbols and whitespace); non-English languages can cost 2–4× more tokens for the same meaning — a real cost and latency issue for multilingual products.

**Why tokens explain famous failures.** "How many r's in strawberry?" — the model may see `straw` + `berry` as two opaque bricks; it never sees letters, so counting letters is like asking you how many atoms are in a chair. Same root cause for weakness at reversing strings, rhyming precisely, and arithmetic on long numbers (digits get chunked inconsistently: `1234` might be one token, `12345` might be `123` + `45`).

**Why an engineer cares.** (1) **Money** — APIs bill per token, in and out. (2) **Limits** — the context window (Chapter 8) is measured in tokens. (3) **Latency** — output is generated token-by-token, so long answers are slow answers. You'll turn all three into working code in the Build: Token & Cost Calculator chapter.

## Why It Matters
**Why an engineer cares.** (1) **Money** — APIs bill per token, in and out. (2) **Limits** — the context window (Chapter 8) is measured in tokens. (3) **Latency** — output is generated token-by-token, so long answers are slow answers. You'll turn all three into working code in the Build: Token & Cost Calculator chapter.

## Hands-On
Open a tokenizer playground in your browser (OpenAI's tokenizer page, or the `tiktoken` library later). Type and observe: your full name (rare names shatter into many pieces), "strawberry", a Python snippet, the same sentence in English vs Telugu/Hindi, a long number like 8675309. For each, write one line on *why* it split the way it did.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why subword tokens instead of characters or whole words? Give one failure of each extreme.
2. State the English rules of thumb: tokens per word, tokens per 1,000 words.
3. Explain the strawberry failure mechanically, using the word "opaque."
4. Name the three engineering costs measured in tokens.
5. Why can serving a Hindi-language product cost multiples of the English version?


---

## Wikilinks
[[what-is-a-language-model]]
[[context-windows]]
[[build-token-cost-calculator]]
[[embeddings-intuition]]

## Status log
- Started: 2026-07-21
- Finished: null
