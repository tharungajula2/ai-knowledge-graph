---
id: lora-qlora-concepts
title: "LoRA & QLoRA Concepts"
domain: frontier-capstone
ring: 10
cluster: "Fine-Tuning & Model Adaptation"
type: concept
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["local-models", "training-pipeline", "prompt-vs-rag-vs-tune", "build-qlora-finetune", "model-serving-patterns"]
tags: [frontier-capstone]
---

## ELI5
Full fine-tuning of an 8B model means updating 8 billion numbers — optimizer states and gradients ballooning memory to multiples of the model's size, GPUs you'll never afford. Yet next chapter you will fine-tune that model on a *free* T4. The trick has two halves and both fit in a sentence: **don't retrain the wall, hang pictures on it** (LoRA), and **store the wall in compressed form while you hang them** (QLoRA). This chapter earns you the right to say those sentences precisely.

## The Real Explanation
**LoRA — Low-Rank Adaptation.** The insight: the *change* a fine-tune needs to make to the weights is far simpler than the weights themselves — mathematically, the update matrix has low rank. So: freeze every original weight. Beside chosen layers, add two small trainable matrices, A (d×r) and B (r×d), where the rank r is tiny (8, 16, 32). The layer's effective weight becomes W + B·A. Train *only* A and B — typically well under 1% of total parameters. The numbers that make it click: a 4096×4096 attention matrix is ~16.8M parameters; its r=16 LoRA pair is 4096×16 + 16×4096 ≈ 131K — **128× fewer**, per layer. Consequences that matter to you as an engineer: training memory collapses (tiny gradients/optimizer states), the output is a small **adapter file** (megabytes, not gigabytes — shippable, versionable, swappable: one base model, many adapters, one per task), and at inference the adapter can be merged into the base for zero added latency. The dial: higher r = more expressive, more data-hungry; r=16 is the workhorse default you'll use tomorrow.

**QLoRA — the Q is quantization.** Even frozen, an 8B model in 16-bit needs ~16 GB just to *sit* in memory — over a free T4's limit before training starts. QLoRA stores the frozen base in **4-bit** (NF4 — a 4-bit format shaped to match the normal distribution real weights follow; smarter than naive rounding, near-lossless for this job), quantizing memory ~4×: the 8B base now sits in ~5 GB. The crucial subtlety: compute still happens in higher precision — weights are dequantized on the fly for each forward pass — and the LoRA adapters themselves stay in full precision. So the *frozen knowledge* is compressed; the *learning* is not. Chapter 1's local-inference quantization and this are the same physics, applied at serve-time there and train-time here. Total memory: 4-bit base + tiny adapters + small gradients ≈ a free-tier GPU. That's the entire miracle, demystified.

**The honest limits.** LoRA shapes *behavior* superbly (format, style, task-shape — exactly your Chapter 10 diagnosis); it does not implant large new knowledge (too few trainable parameters — RAG keeps that job). Catastrophic forgetting — the model losing general ability while learning your task — is muted by the frozen base but not gone; your held-out *general* checks in Chapter 12 will watch for it. And data quality dominates everything: 300 clean pairs beat 3,000 sloppy ones, which is why tomorrow's build spends more time on data than on training.

## Why It Matters
Where this appears in real systems and jobs: Parameter-efficient fine-tuning, LoRA weight adapters, quantization (NF4/FP4), and why a free T4 GPU is enough.

## Hands-On
No GPU today — a whiteboard session that makes tomorrow mechanical. (a) Draw the LoRA diagram from scratch: frozen W, the A/B bypass, the sum, sizes labeled for d=4096, r=16. (b) Compute, by hand, total LoRA parameters for a model where you adapt the attention projections across 32 layers, and the % of an 8B total. (c) Draw the QLoRA memory map for an 8B on a 16 GB T4: 4-bit base, adapters, gradients, optimizer, activations — where does the memory go? (d) Write the six-sentence interview answer: "What is LoRA, what does the Q add, and when would you use it?" Rehearse it aloud. All four go in the note; this note is one you *will* be asked to perform.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is the update low-rank while the weights aren't? Give the intuition, not just the claim.
2. Do the 128× arithmetic for one 4096×4096 layer at r=16, from memory.
3. What exactly is stored in 4-bit in QLoRA, what isn't, and why does that split preserve learning quality?
4. Why does one base + many adapters change your *deployment* story? Connect to Vol 07's model registry.
5. State LoRA's honest limits — the two things it won't do — and which tool covers each.


---

## Wikilinks
[[local-models]]
[[training-pipeline]]
[[prompt-vs-rag-vs-tune]]
[[build-qlora-finetune]]
[[model-serving-patterns]]

## Status log
- Started: 2026-07-21
- Finished: null
