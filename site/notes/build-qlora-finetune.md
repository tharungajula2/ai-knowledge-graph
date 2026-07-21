## ELI5
Every JD you've stared down says it — "experience with fine-tuning LLMs" — and until today the honest answer was no. By the end of this build the answer is: *"Yes — I fine-tuned a small open model with QLoRA on a dataset I created, and here's the before/after eval table."* That table is the whole point of the node (your spec says so verbatim). Numbers, not adjectives — the Vol 01 capstone rule, now aimed at the weights themselves.

## The Real Explanation
**The task.** Fine-tune a small open instruct model (Llama-3-8B-class or a Qwen-2.5-class model — pick per your Chapter 10 memo; smaller = faster iterations on a free GPU) to emit your **proposal-gate JSON**: natural-language request in ("email Priya moving the review to 3pm"), exact structured action payload out — the schema your gate (Vol 08) already validates. The perfect task because *you own the ground truth*: JSON validity and field-exact-match are computable, no fuzzy judge needed for the headline metrics.

**The data — where the real work lives (~300 pairs).** Generate synthetic pairs with a strong LLM through your gateway: a generation prompt that demands diversity — actions (email/calendar/task/notify), phrasings (terse, verbose, Hinglish, typo-ridden, indirect "can you maybe…"), edge cases (missing fields, two actions in one request, impossible requests that should map to a clarify/refuse payload). **Save the generation prompt in the repo** — reviewers always ask how the data was made, and "here's the exact prompt, versioned" is a senior answer. Hand-review 30 random pairs against a written rubric; fix or regenerate failures — this half-hour is the highest-leverage time in the build (Chapter 11: data quality dominates). Hold out **50 pairs** untouched for eval; train on the rest. Also assemble a tiny *general-ability* probe set (10 ordinary questions) to watch for catastrophic forgetting.

**The training.** Free GPU (Colab T4 / Kaggle). The standard stack: transformers + peft + bitsandbytes + trl's SFTTrainer. Config per your node: 4-bit NF4 base, LoRA r=16 (alpha 32, dropout ~0.05) on the attention projections, small learning rate (~2e-4), 2–3 epochs, batch size that fits with gradient accumulation. **Log the loss curve and save the plot** — your node's verify clause names training-loss metrics; a smooth descent is your first evidence, a flat or chaotic curve your first debug signal. Training runs ~1–2 hours; you've waited longer for npm installs.

**The eval — the table that is the point.** Same harness, three conditions on the 50 held-out pairs: (1) BEFORE — base model, plain prompt; (2) BEFORE+ — base model with your best few-shot prompt (the honest baseline your Chapter 10 memo built; skipping it is how people fake fine-tuning wins); (3) AFTER — tuned model, plain prompt. Metrics: JSON validity rate, field-exact-match rate, plus the general-probe score across conditions. Expected shape: AFTER beats both on the task metrics, with a much shorter prompt (a latency/cost win worth pricing with tokentools); general probe roughly flat (forgetting check). Whatever the numbers say, **the numbers go in the table** — an honest modest gain teaches more than an inflated one.

**The artifact set.** Export the adapter (megabytes). Write `finetune/FINETUNE_REPORT.md` in the VIZIER repo: task, data recipe (with the generation prompt), hand-review rubric and findings, hyperparameters, the loss curve, **the before/after table**, cost (₹0 — say it, it's a flex), "what I'd do differently," and — non-negotiable — a closing section titled **"When NOT to fine-tune,"** distilled from your Chapter 10 memo. That section is what separates "I ran a script" from "I have judgment."

## Why It Matters
Where this appears in real systems and jobs: Build a script to fine-tune a small open model (e.g. Llama-3-8B/Qwen-2.5-Coder) using QLoRA on a custom ~300 pair dataset, hand-review samples, evaluate on a 50-pair held-out set, and compile a before/after eval table artifact; verify with training loss metrics.

## Hands-On
The build, sequenced (est. 2–3 honest days): Day 1 — generation prompt → 300 pairs → hand-review 30 → splits → the eval harness *first* (BEFORE and BEFORE+ rows measured before any training exists — locks you into honesty). Day 2 — training notebook → run → loss curve → AFTER row → the table. Day 3 — forgetting probe, FINETUNE_REPORT.md, adapter committed, and the public artifact: a short post built around the table ("I taught an 8B model to speak my agent's action schema — for free — here's the before/after"). Tag `finetune-v0.1`. In the note: the table itself, the loss curve, one data-quality war story from the hand-review, and the six-sentence Chapter 11 answer — now with *your own numbers* in it.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is the proposal-gate task ideal for a first fine-tune? Name the property and its Vol 07 name.
2. Defend the three-condition eval. What lie does omitting BEFORE+ enable?
3. Walk your data recipe: diversity axes, the review rubric, why the generation prompt is versioned.
4. Read your own loss curve aloud: what would a flat curve have told you? A spiky one?
5. Your table, from memory — all three conditions, both metrics — and the one-sentence verdict.
6. When should you NOT fine-tune? Answer as in the report, then compress to one sentence.


---

## Wikilinks
[[lora-qlora-concepts]]
[[prompt-vs-rag-vs-tune]]
[[build-proposal-gate]]
[[build-golden-dataset]]
[[build-experiment-tracker]]
[[few-shot-prompting]]

## Status log
- Started: 2026-07-21
- Finished: null