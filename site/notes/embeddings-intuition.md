## ELI5
Imagine a magical map where every word, sentence, and document is a *pin*, and the rule of the map is: **things with similar meaning are pinned close together**. "King" is near "queen." "My laptop won't turn on" is near "computer fails to boot" — even though they share almost no words. An **embedding** is the coordinates of a pin on that map. Meaning, turned into numbers you can measure distance between.

## The Real Explanation
**What it literally is.** An embedding model takes text in and outputs a vector — a list of, say, 768 or 1536 numbers. That vector is a point in a 768-dimensional space. You cannot picture 768 dimensions; nobody can. Picture the 2D map and trust that the math generalizes: the only operation that matters is *distance* (or its twin, similarity — usually **cosine similarity**, which scores direction-alignment between two vectors from -1 to 1, in practice ~0 to 1 for text).

**Where the geometry comes from.** Embedding models train on enormous piles of text pairs with a simple pressure: texts that appear in similar contexts, or that humans marked as related, must be pushed close; unrelated texts pushed apart. Squeeze billions of examples through that pressure and the space *organizes itself* — topic neighborhoods, tone directions, language bridges (the English and Spanish sentences for "I love dogs" land close). Nobody assigns coordinates. The geometry condenses out of training, exactly like the rules condensed in Chapter 2.

**The killer application: search by meaning.** Keyword search finds *strings*; embedding search finds *meanings*. Embed every document in your knowledge base once and store the vectors. At query time, embed the question, then find the **nearest neighbors** — the stored vectors closest to the query vector. Those documents are about the same thing, even with zero word overlap. This is semantic search, and it is the beating heart of RAG — the entirety of Domain 03 stands on this one idea. When you meet vector databases (Pinecone, Chroma, FAISS), they are simply purpose-built engines for "store millions of vectors, return nearest neighbors fast."

**Embeddings vs the LM.** Same family (transformers), different job. The LM outputs *the next token*. The embedding model outputs *a location*. You'll constantly use both in one system: embeddings to *find* the right knowledge, the LM to *write* with it.

## Why It Matters
Where this appears in real systems and jobs: meaning as coordinates; nearest-neighbor thinking.

## Hands-On
On paper, draw a 2D "meaning map" and pin these by gut feeling: "dog", "puppy", "wolf", "cat", "car", "truck", "The engine won't start", "My pet is sick". Now draw the query pin "vehicle repair" and circle its 2 nearest neighbors. You just ran a vector search by hand. Bonus: notice "wolf" sits near "dog" on the animal axis but far on a wildness axis — that's what having hundreds of dimensions buys: many axes of similarity at once.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does an embedding model take in and put out, literally?
2. What is cosine similarity measuring, in one sentence?
3. Explain how the geometry arises during training — what's pushed together, what's pushed apart?
4. Why does semantic search beat keyword search for "my laptop won't turn on" vs a doc titled "computer fails to boot"?
5. What is a vector database, in one sentence, and which domain of your brain lives on it?


---

## Wikilinks
[[tokens]]
[[what-is-a-language-model]]
[[attention-transformers]]

## Status log
- Started: 2026-07-21
- Finished: null