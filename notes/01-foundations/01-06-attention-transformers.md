---
id: attention-transformers
title: "Attention & Transformers"
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
wikilinks: ["embeddings-intuition", "context-windows", "nlp-transformer-lineage", "training-pipeline"]
tags: [foundations]
---

## ELI5
Read this: "The trophy didn't fit in the suitcase because **it** was too big." What does "it" mean? You resolved that instantly because your brain let "it" *look back at* every earlier word and decide which ones matter — "trophy": very relevant; "suitcase": relevant; "the": ignore. **Attention** is exactly that, as math: every word gets to look at every other word and take a weighted vote on what matters for understanding it. The **Transformer** is the architecture built around doing this, in parallel, at massive scale. It's the "T" in GPT.

## The Real Explanation
**The problem it solved.** Before 2017, language models (RNNs/LSTMs — full lineage in Chapter 13) read text strictly left-to-right, squeezing everything seen so far into one running memory. Two fatal flaws: long-range links faded (by word 500, word 3 is mush), and reading one-word-at-a-time can't be parallelized, so training crawled. The 2017 paper "Attention Is All You Need" threw away the sequential reading entirely.

**How attention works, one level down (the Q/K/V picture).** For each token, the model computes three vectors: a **Query** ("what am I looking for?"), a **Key** ("what do I contain, as an advertisement?"), and a **Value** ("what information do I actually carry?"). Every token's Query is scored against every other token's Key — high score means "you're relevant to me." The scores become weights (softmaxed to sum to 1), and each token's new representation is the weighted blend of everyone's Values. For "it": the Query "I'm a pronoun seeking my noun" matches hardest with the Key of "trophy," so "it"'s updated meaning is mostly trophy-flavored. This all-pairs matching is why attention cost grows with the *square* of sequence length — the reason long context is expensive (Chapter 8).

**Stacking makes understanding.** One attention pass = one round of "every word refines itself by consulting every other word." Transformers run many attention "heads" in parallel per layer (each head learns a different relationship-type: one tracks pronouns, one tracks syntax, one tracks rhyme...) and stack dozens of layers. Early layers resolve grammar; deep layers hold plot, logic, code semantics. Add feed-forward layers between attention layers (per-token processing), plus positional information so word order isn't lost, and that's the Transformer. Honestly — that's the whole machine behind the modern world.

**Why it took over everything.** Parallelism: all tokens process simultaneously, so training scales to GPU clusters and internet-sized data. Long-range: word 5000 attends to word 1 as easily as to word 4999. Generality: the same architecture, unchanged, mastered text, images (ViT), audio, protein folding. Scaling laws (bigger = predictably better) did the rest.

## Why It Matters
Where this appears in real systems and jobs: the "every word looks at every word" idea.

## Hands-On
Take the sentence "The bank raised interest rates because the economy was overheating." For the word "bank", play one attention head by hand: give every other word a relevance weight summing to 1 for the question "which sense of bank?" — notice "rates" and "interest" get the mass, which is *why* the model knows it's not a riverbank. Then do the same for "overheating." You just computed two rows of an attention matrix by intuition.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What two flaws of sequential (RNN) reading did attention fix, and which one unlocked massive scale?
2. Walk through Query, Key, Value using the trophy/suitcase sentence.
3. Why do multiple attention heads exist? Give two example relationship-types heads learn.
4. Why does attention cost grow quadratically with sequence length, and which everyday limit does that explain?
5. "The same architecture works for text, images, and proteins." What does that tell you about what the Transformer actually is?


---

## Wikilinks
[[embeddings-intuition]]
[[context-windows]]
[[nlp-transformer-lineage]]
[[training-pipeline]]

## Status log
- Started: 2026-07-21
- Finished: null
