## ELI5
For nine rings, "the model" has been a voice on the other end of an HTTPS call — someone else's GPU, someone else's weights, your tokens billed by the million. Today the model moves into your house. You will download a file of weights, load it on your own laptop, and watch tokens appear with *no network cable involved*. The first time it happens, something permanent clicks: the model is not a service. It's an artifact. A big file of numbers you can hold.

## The Real Explanation
**Why local matters — the four permanent reasons.** (1) **Privacy**: tokens that never leave your machine can never leak, never be logged, never be subpoenaed — the entire Vol 08 threat model shrinks when there's no wire. (2) **Cost shape**: API calls are opex forever; a local model is capex once — the economics invert for high-volume, low-stakes workloads. (3) **Latency floor**: no network round-trip means the floor drops to pure compute. (4) **Control**: no deprecations, no silent model swaps breaking your golden sets (Vol 02's regression fear, structurally eliminated), no rate limits (Vol 02 Ch 10's whole chapter, gone). The permanent counterweights: local models are *smaller and dumber* than frontier hosted ones, your hardware is the ceiling, and you become your own ops team.

**The mechanics you must own.** A model on disk is weights in a format (GGUF is the current lingua franca of local inference); a **runtime** loads them (llama.cpp lineage tools, Ollama-style wrappers that make it one command); **quantization** shrinks weights from 16-bit floats down to 4-bit integers so a model that "needs" 16 GB fits in 5 — you'll meet the same idea from the training side in Chapter 11 (QLoRA), so bank the intuition now: *precision is a dial, and most of a model's ability survives coarser numbers*. **The RAM law**: parameter count × bytes per parameter ≈ memory needed; a 7–8B model at 4-bit ≈ 4–5 GB — laptop territory. Tokens/second is your new personal benchmark.

**The bridge that makes this trivial for you.** Most local runtimes expose an **OpenAI-compatible API** on localhost. Which means: your Vol 02 gateway can treat your own laptop as *just another provider* in the fallback chain. Local-first for cheap/private tasks, cloud for hard ones — that's a routing policy you already know how to write; only the base URL is new.

## Why It Matters
Where this appears in real systems and jobs: run a model on my own laptop.

## Hands-On
Install a local runtime (Ollama-style is the fastest path). Pull a small instruct model (3–8B, quantized). Then: (a) chat with it in the terminal — *turn off your WiFi first* and feel the proof; (b) measure tokens/sec on your machine and write it down; (c) add it to your gateway as a provider named `local` and route three real tasks through it (a summary, a JSON extraction with your Vol 02 schema machinery, a Feynman explanation); (d) run 5 rows of an existing golden set (Vol 02/Vol 07) against it and score honestly against your usual provider. In the note: the tokens/sec number, the golden-set delta, and one paragraph: which of *your* workloads would you actually route local, and why.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the four permanent reasons for local and the three permanent costs — from memory.
2. Do the RAM math: why does an 8B model at 4-bit fit on your laptop but a 70B doesn't?
3. What is quantization doing to the weights, in one sentence a 12-year-old follows?
4. How did the OpenAI-compatible localhost API let you reuse your gateway unchanged?
5. Your golden-set delta: what did the local model lose, and for which task types did it not matter?


---

## Wikilinks
[[build-gateway]]
[[model-landscape]]
[[lora-qlora-concepts]]
[[rate-limits-caching]]

## Status log
- Started: 2026-07-21
- Finished: null