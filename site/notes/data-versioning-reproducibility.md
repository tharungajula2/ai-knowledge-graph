## ELI5
You version your code (Git, Vol 01 Ch 19) — but ML results depend on *data* too, and data is usually *not* in Git (too big, binary, changing). The node summary: **data versioning basics, git-for-data, reproducibility standards, and writing model cards.** A result you can't reproduce is a result you can't trust or improve — and reproducibility in ML requires versioning not just code but *data*, *config*, and *environment*, plus documenting what you built (model cards). This is the discipline that separates "it worked once on my machine" from "anyone can reproduce this."

## The Real Explanation
**Why code versioning isn't enough — the reproducibility triangle.** To reproduce an ML result you need *three* things pinned, not one: *code* (Git handles this — Vol 01 Ch 19), *data* (the exact dataset version — and Git can't: datasets are large, binary, and Git chokes on them), and *environment* (the exact package versions — Vol 01 Ch 14's `requirements.txt`, and deeper: CUDA versions, hardware). Miss any vertex and reproduction fails: same code + different data = different result; same code + data + different package versions = possibly different result (a library update changed a default). Reproducibility is pinning all three, and data is the vertex people forget.

**Git-for-data — the tooling.** Since Git can't version large data, tools like DVC (Data Version Control) and lakeFS add *data versioning* alongside Git: the *data itself* lives in object storage (S3, etc.), while a small *pointer/hash* lives in Git — so `git checkout <commit>` restores both the code *and* the matching data version (the pointer resolves to the right data). You get "git-for-data": versioned datasets, reproducible data states, data lineage (which data version produced which result). The pattern echoes your Vol 06 Ch 8 provenance instinct and Vol 03 Ch 15's content-hashing — pinning data by hash so a result traces to its exact inputs.

**Reproducibility standards — the checklist.** A reproducible ML result pins: *code version* (Git commit), *data version* (DVC hash / dataset snapshot), *environment* (locked dependencies, ideally containerized — a future domain's Docker), *config/hyperparameters* (Ch 10's tracking), *random seeds* (where determinism is wanted — Vol 01 Ch 9's note that even temp 0 isn't fully deterministic, but seeds pin what can be pinned), and *the run's metrics* (Ch 10). With all pinned, anyone can reproduce your result — the scientific standard, applied to ML. For your *LLM* work, the analog: pin the *prompt version*, the *model version* (Vol 01 Ch 11), the *judge version* (Ch 4), the *golden-set version* (Ch 2), and the *eval config* — the same discipline, LLM substrate, and the reason your eval history is trustworthy only if these are versioned.

**Model cards — documenting what you built.** A *model card* (the industry standard, from Google's "Model Cards" work) is a structured document accompanying a model: *what it does*, *what data it was trained on*, *how it performs* (metrics, and crucially *per-subgroup* — Vol 01 Ch 12's fairness dimension), *its limitations and failure modes* (Vol 04 Ch 16 honesty), *intended use and out-of-scope use*, and *ethical considerations* (bias, Vol 08's territory). Model cards are how you *communicate* a model responsibly — and writing one forces you to *know* your model's limits (the self-honesty of Vol 06 Ch 16's reviewer, applied to models). For LLM systems, the analog is a *system card* documenting your agent/RAG system's behavior, limits, and evals. Writing these is a senior, responsible-AI signal — most people ship models with no documentation of their limits.

## Why It Matters
Where this appears in real systems and jobs: Data versioning basics, git-for-data, reproducibility standards, and writing model cards.

## Hands-On
Practice the reproducibility discipline (concept node, concrete): (1) Take your Ch 10 MLflow experiment and make it *fully reproducible* — pin code (Git), data (a versioned snapshot or DVC if you set it up), environment (locked deps), config (tracked), seed. Then the test: can a fresh checkout reproduce your result exactly? Document what it took. (2) Write a *model card* for your Ch 10 classifier (or a *system card* for your research agent): what it does, its data, its metrics *including where it's weak*, its limitations, intended/out-of-scope use. (3) The LLM mapping: write the reproducibility checklist for your *eval program* — what must be versioned (prompt, model, judge, golden set, config) for an eval score to be reproducible and comparable over time. The reproducibility test + the model/system card + the eval-reproducibility checklist = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the reproducibility triangle's three vertices, and why code-versioning alone fails.
2. How does git-for-data work — where does the data live, where does the pointer live?
3. Recite the reproducibility checklist, and its LLM-eval analog.
4. What does a model card document, and why does writing one force self-honesty?
5. What must be versioned for an LLM eval score to be comparable over time?


---

## Wikilinks
[[git-mastery]]
[[python-environments]]
[[build-experiment-tracker]]
[[judge-bias-pinning]]
[[ingestion-pipelines]]

## Status log
- Started: 2026-07-21
- Finished: null