## ELI5
This ring so far has been LLM-eval-focused; this cluster grounds you in the broader *MLOps* discipline that all of AI engineering sits on — and that your target roles expect you to know. The node summary: **build an experiment tracker integration using MLflow on a free workspace to train a classifier, log hyperparameters/metrics, register the model artifact, and execute batch inference; verify with registered model runs.** This is a deliberate step *sideways* into classical ML lifecycle tooling — because "AI engineer" means knowing the MLOps foundations, not just prompting, and MLflow is the industry-standard experiment tracker you'll meet everywhere.

## The Real Explanation
**Why experiment tracking exists — the reproducibility problem.** Train a model with one set of hyperparameters, get 0.85 accuracy; change three things, get 0.87; change five more, get 0.83 — and now you *can't reconstruct* which combination gave 0.87, or reproduce it (Vol 01 Ch 12's train/test rigor, now with a bookkeeping crisis). Experiment tracking solves this: every training run logs its *hyperparameters* (what you configured), *metrics* (what resulted), *artifacts* (the trained model, plots), and *code version* (Vol 01 Ch 19) — so every result is reproducible and comparable. It's version control for *experiments* rather than code, and it's non-negotiable in serious ML work.

**MLflow — the standard, its four pillars.** *Tracking*: log params, metrics, artifacts per run (`mlflow.log_param`, `mlflow.log_metric`, `mlflow.log_artifact`) — the experiment journal. *Projects*: package code for reproducible runs. *Models*: a standard format for saving/loading models across frameworks. *Registry*: a versioned store of *registered* models with stages (staging → production → archived) — the model's lifecycle, managed. The build touches all four, but tracking and registry are the heart.

**The build — classifier, tracked, registered, served (per the node).** (1) *Train a classifier* — a genuinely simple one (scikit-learn on a standard dataset — this isn't about the model, it's about the *lifecycle*; a logistic regression or random forest on iris/titanic is perfect). This also cashes in Vol 01 Ch 12 (classical ML — train/test split, precision/recall/F1 — the fundamentals node, now with real code). (2) *Log hyperparameters and metrics* to MLflow — run it several times with different hyperparameters, and watch the tracking UI let you *compare runs* (the payoff: "which config won?" answered by data, not memory). (3) *Register the model artifact* — promote your best run's model to the registry with a version and stage. (4) *Batch inference* — load the registered model and run it on a batch of inputs (Ch 12's batch-vs-realtime, previewed) — the model serving its purpose, from the registry. (5) *Free workspace* — MLflow runs locally or on free-tier hosted workspaces (per the node — no cost).

**Why this matters for the LLM engineer (bridging back).** Even in LLM-land, the *concepts* transfer directly: your *eval runs* (Chs 2-9) are experiments — log the prompt version, the golden-set scores, the judge version (Ch 4's pinning!) as tracked experiments, and you get reproducible, comparable eval history *for free* (many teams track LLM evals in MLflow or similar exactly this way). The registry concept maps to *prompt/model versioning* (Vol 02 Ch 3's prompts-as-artifacts, now with lifecycle stages). And when you fine-tune (a future domain), this *is* the tooling. Experiment tracking is the through-line connecting classical ML and LLM engineering — the same reproducibility discipline, one substrate.

## Why It Matters
Where this appears in real systems and jobs: Build an experiment tracker integration using MLflow on a free workspace to train a classifier, log hyperparameters/metrics, register the model artifact, and execute batch inference; verify with registered model runs.

## Hands-On
Build it (est. 1 day): set up MLflow (local or free workspace) → train a scikit-learn classifier with train/test split and precision/recall/F1 (Vol 01 Ch 12, in code) → log params + metrics across several hyperparameter runs → use the MLflow UI to compare runs and pick the winner → register the best model with a version/stage → load from registry and run batch inference → verify registered model runs appear correctly. Then the bridge: log *one of your LLM eval runs* (a golden-set score with prompt version + judge version) as an MLflow experiment — see your LLM work fit the MLOps frame. Tag `mlops-v0.1`. The tracked runs + the registered model + the batch inference + the LLM-eval-as-experiment = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What problem does experiment tracking solve, and why is it non-negotiable in serious ML?
2. Name MLflow's four pillars, and which two are the heart of this build.
3. Walk the five build steps: train → log → register → batch-infer → verify.
4. How do LLM eval runs map onto experiment tracking, and why is judge-version logging crucial?
5. Why is experiment tracking the through-line between classical ML and LLM engineering?


---

## Wikilinks
[[classical-ml-fundamentals]]
[[git-mastery]]
[[data-versioning-reproducibility]]
[[model-serving-patterns]]
[[judge-bias-pinning]]

## Status log
- Started: 2026-07-21
- Finished: null