## ELI5
"Which model is best?" is like "which vehicle is best?" — meaningless without axes. A truck, a scooter, and an F1 car are all "best." The landscape stops being a confusing zoo of names the moment you carry a fixed set of axes and pin every new name onto them.

## The Real Explanation
**Axis 1 — Open-weights vs closed API.** Closed (the frontier labs' flagships — Anthropic, OpenAI, Google): top capability, zero ops burden, per-token pricing, data leaves your walls, provider can deprecate. Open-weights (Meta's Llama line, Mistral, Alibaba's Qwen, DeepSeek, etc.): weights are files you can download — self-host, fine-tune freely, data stays home, but *you* own GPUs, serving, and upgrades. Note the honest term is open-*weights*, not open-source: you get the artifact, rarely the training data or full recipe. Enterprise conversations orbit this axis endlessly (compliance vs capability), which is why interviewers love it.

**Axis 2 — Frontier vs small.** Frontier models: maximum capability, maximum price and latency. Small models (single-digit billions of params) run on a laptop or phone, cost pennies, and — the key modern insight — a small model *fine-tuned for one narrow job* routinely beats a frontier generalist *at that job*. Production systems therefore **route**: cheap model for the easy 80%, frontier for the hard 20%. Model-tiering is a standard cost lever you'll pull in the production domain.

**Axis 3 — Modality & shape.** Text-only vs multimodal (vision/audio in, sometimes images out); embedding models vs generative (Chapter 5); "reasoning" variants that spend extra thinking-tokens to buy accuracy on hard problems — a live tradeoff (latency & cost vs depth) you now know how to evaluate.

**Axis 4 — How to *read* claimed rankings.** Benchmarks (exam-style scores) saturate and leak into training data; leaderboard arenas (humans blind-vote between model answers) measure preference, not truth; the only benchmark that finally matters is **your own eval set on your own task** — a drum the evaluation domain will beat loudly. Treat every launch-day claim as marketing until it survives your evals.

## Why It Matters
Where this appears in real systems and jobs: open vs closed, frontier vs small — as of the day I light this node.

## Hands-On
Run the frontier-scan: search the current top closed flagships, top open-weights families, and current pricing per million tokens for one frontier and one budget model. Build your personal landscape table with the four axes as columns and ~8 models as rows. Date-stamp it in the note — it is a snapshot, and per Rule 7 the *next* reader of this node might be you in a replan, re-running the scan.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Open-weights vs closed: give two decisive advantages each, and the compliance reason enterprises accept weaker models.
2. Why can a small fine-tuned model beat a frontier generalist? What production pattern does that enable?
3. What is a "reasoning" model spending, to buy what?
4. Why are public benchmarks weak evidence, and what is the only benchmark that matters?
5. Why is this node marked `frontier` — what rots, what doesn't?


---

## Wikilinks
[[training-pipeline]]
[[sampling-controls]]
[[hallucination]]

## Status log
- Started: 2026-07-21
- Finished: null