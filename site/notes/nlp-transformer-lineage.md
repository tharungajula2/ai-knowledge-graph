## ELI5
Every ancestor of the Transformer died of a specific disease, and the Transformer is the child that inherited every cure. Walk the family tree once — TF-IDF → Word2Vec → RNN/LSTM → attention — and the modern architecture stops being a miracle and becomes an *inevitability*. This chapter turns "I use LLMs" into "I know why LLMs are shaped like this."

## The Real Explanation
**Gen 1: Words as counts — TF-IDF (through the 2000s).** Represent a document by word-counts, weighted so that words frequent *in this document* but rare *across all documents* score highest (Term Frequency × Inverse Document Frequency — "the" scores ~0, "transformer" scores high in a doc about transformers). Powered a generation of search engines; still a respectable keyword-search baseline today (its descendant BM25 lives inside "hybrid search" in Domain 03 — this generation never fully died). **The disease: no meaning.** "Car" and "automobile" are as unrelated as "car" and "banana." Synonyms are strangers; word order is discarded entirely ("dog bites man" = "man bites dog").

**Gen 2: Words as vectors — Word2Vec (2013).** The breakthrough insight: *a word is known by the company it keeps*. Train a tiny network to predict a word from its neighbors across billions of sentences, and the learned vectors arrange themselves by meaning — "car" lands next to "automobile," and vector arithmetic famously half-works: king − man + woman ≈ queen. This is Chapter 5's embedding idea at its birth. **The disease: one frozen vector per word.** "Bank" gets a single vector, awkwardly averaging riverbank and finance. Context can't move the meaning.

**Gen 3: Reading in order — RNNs & LSTMs (2014–2017).** Recurrent networks read token-by-token, carrying a running memory vector; LSTMs added learned gates deciding what to keep and forget, stretching usable memory. Now context exists — "bank" after "fishing on the" reads differently — and this generation powered the first decent neural translation and Siri-era assistants. **The two diseases you met in Chapter 6:** distant information still faded (gradient signals decay across long sequences), and strict one-at-a-time reading made training unparallelizable — you cannot throw 10,000 GPUs at a model that must finish word 4 before touching word 5. Scale hit a wall.

**Gen 4: Everyone looks at everyone — Transformers (2017).** "Attention Is All You Need" deleted recurrence entirely: every token attends to every token directly (no decay across distance), all positions compute in parallel (the GPU wall falls), and every word's representation is rebuilt *from context* at every layer — so "bank" finally means the right thing in each sentence, solving Gen 2's disease too. Add the scaling laws (capability grows predictably with size + data + compute) and the path from 2017's translation model to today's frontier is just this architecture, scaled relentlessly.

**The lineage in one breath — say it out loud:** counts had no meaning → vectors had meaning but no context → recurrence had context but no reach and no parallelism → attention had reach, context, *and* parallelism, and parallelism is what let it eat the entire internet.

## Why It Matters
Where this appears in real systems and jobs: From TF-IDF, Word2Vec, and RNNs/LSTMs to self-attention; the architectural lineage that enabled LLMs.

## Hands-On
Build the four-generation table in your note from memory: columns = *representation · superpower gained · fatal disease · what survives today*. (Survivals: TF-IDF→BM25 in hybrid search; Word2Vec→the embedding intuition; RNN→sequence thinking; Transformer→everything.) Then the classic probe: explain how each generation handles "bank" in "river bank" vs "bank account" — one sentence per generation. That single question tests the whole chapter.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does TF-IDF score highly, and what's its fatal blindness? Which modern technique is its descendant?
2. State Word2Vec's core insight in one sentence, and its one-vector disease.
3. What did LSTMs fix about vanilla RNNs, and which two diseases remained?
4. Name the three simultaneous cures attention delivered, and circle the one that unlocked internet-scale training.
5. Recite the lineage-in-one-breath from memory.


---

# PART II — THE ENGINEER'S FLOOR
*9 chapters, all build nodes. Part I rewired your intuition; Part II builds your hands. Every chapter here ends with an artifact that runs — that's the lighting condition.*

---

## Wikilinks
[[attention-transformers]]
[[embeddings-intuition]]
[[classical-ml-fundamentals]]
[[map-of-ai]]

## Status log
- Started: 2026-07-21
- Finished: null