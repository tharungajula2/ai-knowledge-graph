---
id: classical-ml-fundamentals
title: "Classical ML Fundamentals"
domain: foundations
ring: 1
cluster: "How AI Works"
type: concept
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["how-machines-learn", "map-of-ai", "nlp-transformer-lineage"]
tags: [foundations]
---

## ELI5
Before you're allowed to summon dragons, you learn why swords have two edges. Classical ML is where the field's permanent laws were discovered — and those laws (generalize, don't memorize; measure honestly; know your error types) apply *unchanged* to every LLM system you will ever ship. Interviewers probe here deliberately: it separates people who understand ML from people who've only used ChatGPT.

## The Real Explanation
**Train/test split — the iron law.** A student who memorizes past exam papers aces those papers and fails the real exam. To know if a model *generalized* rather than memorized, you must evaluate it on data it never saw. So: split your data (classically 80/20), train on one part, measure on the held-out part, and *never let the test set influence any decision during development* (use a third split — validation — for tuning). The moment test data leaks into training, your accuracy number is fiction. This law reappears in LLM-land as "did the benchmark leak into pretraining?" — same disease, planetary scale.

**Overfitting & regularization.** Overfitting = the memorizing student: training error keeps falling while held-out error rises, because the model started fitting the *noise* of the training set. Cures share one spirit — constrain the model's freedom: penalize large weights (L1/L2 regularization), randomly disable neurons during training (dropout), stop training when validation error turns upward (early stopping), or simply get more data. The underfitting/overfitting seesaw (too simple ↔ too memorized) is the bias–variance tradeoff, and you'll feel it again the day you fine-tune with QLoRA and watch a model overfit 500 examples in three epochs.

**Precision, recall, F1 — because "accuracy" lies.** A fraud model that predicts "not fraud" always is 99.9% accurate and 100% useless. On imbalanced problems you must split the error types: **Precision** = of everything I flagged, how much was truly positive? (cost of false alarms). **Recall** = of all true positives out there, how many did I catch? (cost of misses). They trade off against each other via your decision threshold: cancer screening wants recall (a miss is a death; a false alarm is a follow-up test); spam filtering wants precision (a false alarm eats a real email). **F1** is their harmonic mean — a single balanced number, harsh on whichever is weaker. You will use precisely these words to evaluate RAG retrieval ("did we *recall* the relevant chunks?") and agent guardrails ("what's the *precision* of the injection detector?" — yes, the one in your own agent-lab).

**Confusion matrix — the 2×2 that generates everything.** Rows = truth, columns = prediction: True Positives, False Positives (false alarm), False Negatives (miss), True Negatives. Every metric above is arithmetic on these four cells (Precision = TP/(TP+FP), Recall = TP/(TP+FN)). Drawing this matrix from memory and deriving the metrics is a 90-second interview classic. Make it reflex.

## Why It Matters
Where this appears in real systems and jobs: Train/test splits, overfitting/regularization, precision/recall/F1, and confusion matrices.

## Hands-On
Take a concrete scenario: 1,000 emails, 50 are spam; your filter flags 60 emails, of which 40 are actually spam. Build the full confusion matrix (TP=40, FP=20, FN=10, TN=930), then compute accuracy, precision, recall, and F1 by hand. Then answer: your boss says "just maximize accuracy" — write two sentences on why that's a trap here. Finally, name which metric you'd prioritize for: airport weapons screening; a court's guilty verdict; your agent-lab's prompt-injection scanner.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the iron law of the train/test split and the disease it prevents. What's its LLM-era echo?
2. Describe overfitting via the two error curves, and name three cures with their shared spirit.
3. Precision vs recall: define both from the confusion matrix cells, and give one domain that maximizes each.
4. Why is accuracy a lying metric on imbalanced data? Use the fraud example.
5. Draw the confusion matrix from memory and derive precision, recall, F1.


---

## Wikilinks
[[how-machines-learn]]
[[map-of-ai]]
[[nlp-transformer-lineage]]

## Status log
- Started: 2026-07-21
- Finished: null
