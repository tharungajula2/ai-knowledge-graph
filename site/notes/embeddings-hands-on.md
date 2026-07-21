## ELI5
Volume 01, Chapter 5 gave you the map-of-meaning as *intuition* — pins on a board, distance as similarity. Today the intuition becomes numbers in your terminal: you will embed real sentences, compute cosine similarity **by hand** (the node summary's exact demand), watch semantic neighbors emerge from arithmetic, and — most importantly — find the places where the geometry *surprises* you. Trust built by verification, not by faith.

## The Real Explanation
**Getting vectors.** Two routes, use both this chapter: an embedding API through provider SDKs (Gemini offers embedding models on the free tier — your zero-cost reps continue), and a *local* model via the `sentence-transformers` library (`all-MiniLM-L6-v2` is the classic starter: small, fast, runs on your laptop, 384 dimensions). Local matters beyond cost: it's how you'll embed thousands of chunks in Ch 15 without rate-limit pain (Vol 02, Ch 10), and it removes the network from your experiments. Note what comes back: a plain list of floats. `len(vector)` is the dimension. That's all an embedding physically is.

**Cosine similarity by hand — the ritual.** The formula: cos(A,B) = (A·B) / (|A|·|B|) — dot product over the product of lengths. In code, once, with no library doing the thinking:
```python
import math
def cosine(a: list[float], b: list[float]) -> float:
    dot   = sum(x*y for x, y in zip(a, b))
    len_a = math.sqrt(sum(x*x for x in a))
    len_b = math.sqrt(sum(x*x for x in b))
    return dot / (len_a * len_b)
```
What it *means*: direction-agreement between two arrows from the origin — 1.0 = same direction (same meaning-direction), near 0 = unrelated. Why cosine and not plain distance: it ignores vector *length* (which can vary with text length and model quirks) and measures only *orientation* — meaning lives in direction. Two practical notes to bank now: many embedding models ship vectors pre-normalized to length 1, and then cosine similarity *equals* the raw dot product (cheaper — one multiply-add per dimension; this is why vector DBs often talk about "inner product"); and absolute similarity numbers are **model-relative** — 0.7 on one model ≠ 0.7 on another; only *rankings and contrasts within one model* mean anything. Never hardcode a "0.8 = related" threshold from folklore; derive thresholds from your own data (a golden-set instinct — Vol 02, Ch 16).

**The asymmetry that shapes real systems.** Questions and answers are *different kinds of text* — "What time is check-in?" and "Guests may access rooms from 2 PM" share meaning but not form. Good retrieval embeddings are trained on question↔passage pairs so these land close anyway; some models go further and want a task prefix or instruction ("query: ..." vs "passage: ...") to embed each side appropriately. Read your model's card; using a query-style embedding for passages (or ignoring required prefixes) is a silent quality killer that no error message will ever report.

## Why It Matters
Where this appears in real systems and jobs: embed sentences; cosine similarity by hand.

## Hands-On
Build `similarity_lab.py`: embed ~15 sentences you write — clusters by design (3 about cricket, 3 about cooking, 3 about Python errors, 3 paraphrases of one idea in different words, and 3 curveballs: a Hinglish sentence, a sarcastic sentence, "My laptop won't turn on" + "computer fails to boot"). Compute the full 15×15 cosine matrix with *your own* function; print it as a heat-grid (text is fine). Verify: clusters light up, paraphrases score high despite zero word-overlap, the laptop pair confirms Vol 01 Ch 5's promise. Then hunt one *surprise* — a pair scored higher or lower than your intuition — and write two sentences on it (sarcasm and negation are classic embedding blind spots; finding one teaches you more than ten confirmations). Finally: sanity-check `cosine(v, v) == 1.0` in a pytest, plus a test that your function matches `numpy` dot-product on normalized vectors. Green + matrix + surprise = lit.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Write the cosine formula from memory and say what each part contributes.
2. Why direction rather than distance? What does length-normalization buy computationally?
3. Why are absolute similarity scores model-relative, and what practice does that forbid?
4. Explain the query↔passage asymmetry and the silent failure it causes.
5. What was your surprise pair, and what does it warn you about for retrieval quality?


---

## Wikilinks
[[embeddings-intuition]]
[[why-rag]]
[[vector-databases]]
[[prompt-quality]]

## Status log
- Started: 2026-07-21
- Finished: null