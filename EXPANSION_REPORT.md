# EXPANSION_REPORT: VIZIER Curriculum Map Upgrades

This report documents the curriculum map expansion from **202** nodes to **228** nodes, covering the full modern AI engineering landscape.

---

## Summary of Node Distribution

| Domain | Original Count | New Count | Net Change | Focus Areas Added |
| :--- | :---: | :---: | :---: | :--- |
| **01 — Foundations** | 21 | 24 | +3 | Classical ML, NLP-to-Transformer lineage, Professional Python craft |
| **02 — Prompting & LLM APIs** | 20 | 20 | 0 | No changes |
| **03 — RAG & Retrieval** | 21 | 22 | +1 | Vector DB benchmarking (pgvector, FAISS, Chroma), index details (IVF/HNSW) |
| **04 — Agents** | 20 | 20 | 0 | No changes |
| **05 — Multi-Agent & MCP** | 19 | 19 | 0 | No changes |
| **06 — Memory & Knowledge** | 19 | 19 | 0 | No changes |
| **07 — Evals & Observability** | 19 | 22 | +3 | MLOps & Model Lifecycle cluster (MLflow, tracking, serving) |
| **08 — Safety & Security** | 20 | 20 | 0 | No changes |
| **09 — Production** | 22 | 38 | +16 | Cloud Ops cluster (k8s, CI/CD, deploy) & Enterprise Scale cluster (async workers, logging, load testing, multi-tenancy) |
| **10 — Frontier & Capstone** | 21 | 24 | +3 | Fine-Tuning cluster (LoRA/QLoRA, fine-tune build) & VIZIER v2 Capstone rewrite |
| **TOTALS** | **202** | **228** | **+26** | **26 new/upgraded nodes** |

---

## Detailed Node Ledger per Section (A–G)

### A. Cloud & Deployment (Domain 09 — Production)
*   `cloud-fundamentals` (concept · S) — *New*: Cloud accounts, projects, regions, IAM roles, and setting up budget/billing alerts from day zero.
*   `compute-choices` (concept · S) — *New*: Serverless containers vs virtual machines vs managed Kubernetes clusters; structural trade-offs.
*   `build-container-deployment` (build · M) — *New*: Build a Docker image, push it to a registry, and manually deploy it to a serverless container service (e.g., Cloud Run); verify with curl endpoint test.
*   `kubernetes-essentials` (concept · M) — *New*: Pods, deployments, services, ingress controllers, and horizontal pod autoscalers; understanding k8s orchestration conceptually.
*   `cicd-fundamentals` (concept · S) — *New*: Pipeline execution, runner containers, trigger events, and automated stage routing.
*   `build-github-actions-pipeline` (build · M) — *New*: Write and run a GitHub Actions YAML workflow that lints Python code, executes pytest runs, builds a container image, and deploys it to staging; verify with commit triggers.
*   `secrets-cost-engineering` (build · M) — *Upgraded*: Upgraded from `secrets-done-right` to build-level; implements secure storage via secrets managers and writes utility scripts calculating LLM token cost metrics with strict budget capping; verify with mock budgets.
*   `static-sites-cdns` (concept · S) — *New*: Object storage buckets, CDN caching behavior, and edge routing for high-performance static sites.

### B. MLOps & Model Lifecycle (Domain 07 — Evals & Observability)
> [!NOTE]
> MLOps & Model Lifecycle has been added as a new cluster in Domain 07 since model tracking, registry logging, and version lifecycle management directly build upon and extend eval-driven development.
*   `build-experiment-tracker` (build · M) — *New*: Build an experiment tracker integration using MLflow on a free workspace to train a classifier, log hyperparameters/metrics, register the model artifact, and execute batch inference; verify with registered model runs.
*   `data-versioning-reproducibility` (concept · S) — *New*: Data versioning basics, git-for-data, reproducibility standards, and writing model cards.
*   `model-serving-patterns` (concept · S) — *New*: Batch inference vs real-time REST endpoints vs token streaming; latency, cost, and resource tradeoffs.

### C. Fine-Tuning & Model Adaptation (Domain 10 — Frontier & Capstone)
> [!NOTE]
> Converted the single `fine-tuning-when-why` node into a comprehensive cluster detailing the exact adapt-vs-buy engineering cycle.
*   `prompt-vs-rag-vs-tune` (concept · S) — *New*: The buy-vs-tune decision matrix; when context injection beats model tuning and vice-versa.
*   `lora-qlora-concepts` (concept · M) — *New*: Parameter-efficient fine-tuning, LoRA weight adapters, quantization (NF4/FP4), and why a free T4 GPU is enough.
*   `build-qlora-finetune` (build · L) — *New*: Build a script to fine-tune a small open model (e.g. Llama-3-8B/Qwen-2.5-Coder) using QLoRA on a custom ~300 pair dataset, hand-review samples, evaluate on a 50-pair held-out set, and compile a before/after eval table artifact; verify with training loss metrics.
*   `preference-tuning-distillation` (concept · M) — *New*: DPO, RLHF, reward models, model distillation techniques, and evaluating tuned model alignment.

### D. ML & NLP Foundations Depth (Domain 01 — Foundations)
*   `classical-ml-fundamentals` (concept · M) — *New*: Train/test splits, overfitting/regularization, precision/recall/F1, and confusion matrices.
*   `nlp-transformer-lineage` (concept · M) — *New*: From TF-IDF, Word2Vec, and RNNs/LSTMs to self-attention; the architectural lineage that enabled LLMs.
*   `python-craft-professional` (build · M) — *New*: Build a modular package using typing conventions, unit tests with pytest, execution profiling, and metadata packaging; verify with test passes.

### E. Enterprise Architecture & Scale (Domain 09 — Production)
> [!NOTE]
> Added a complete cluster of 9 nodes to cover system performance, compliance, load testing, caching, and infrastructure resilience.
*   `multi-tenancy-design` (concept · M) — *New*: Tenant isolation strategies, Row Level Security (RLS) policies, and per-tenant rate/resource limits.
*   `build-async-workers` (build · M) — *New*: Build a background task worker loop using Redis/Celery to run long-running agent execution tasks asynchronously; verify with mock task status polling.
*   `rate-limiting-logs` (build · M) — *New*: Build API rate-limiting middleware and a structured JSON logging pipeline that outputs trace-correlated metrics; verify with concurrency bursts.
*   `observability-slos` (concept · S) — *New*: Metrics, logs, traces, and Service Level Objectives (SLOs) in production systems.
*   `authn-vs-authz` (concept · S) — *New*: Authentication vs Authorization, JWT validation, custom API key tables, and credential authorization roles.
*   `build-load-testing` (build · M) — *New*: Write a load testing suite using Locust/k6 to simulate concurrent users accessing agent endpoints and analyze latency spikes; verify with simulated load runs.
*   `caching-layer-depth` (concept · S) — *New*: Multi-tier caching including HTTP response cache, semantic vector cache, and database query pooling.
*   `failure-drills-rollbacks` (concept · S) — *New*: Chaos engineering drills, automated rollback protocols, and database migration backup strategy.
*   `compliance-responsible-ai` (concept · S) — *New*: PII masking compliance, data retention limits, append-only security logs, and responsible-AI org policies.

### F. Vector & Retrieval Breadth (Domain 03 — RAG & Retrieval)
*   `build-vector-db-benchmark` (build · M) — *New*: Build a benchmarking script comparing pgvector, local FAISS-style indices, and embedded Chroma-style stores on a corpus, measuring recall@k and latency; verify with comparative performance reports.
*   `vector-databases` (concept · M) — *Upgraded*: Upgraded details to include IVF partitioning and HNSW graph structures.
*   `chunking` (concept · S) — *Upgraded*: Upgraded details to cover sliding windows, semantic chunking, and hierarchical document splitters.
*   `graphrag-preview` (concept · S) — *Upgraded*: Upgraded details to cover community summaries, entity linking, and hierarchical relationship indexing.

### G. The Capstone Rewrite (Domain 10 — Frontier & Capstone)
> [!IMPORTANT]
> The final capstone cluster has been rewritten so that the learner builds the entire agentic loop and production architecture from scratch, mapping each subsystem directly to the prerequisites that taught it.
*   `define-vizier-v2` (capstone · M) — *Redefined*: Spec the unified agent+brain rebuilt from scratch by ME, mapped back to the modules that taught it.
*   `build-vizier-v2-core` (build · L) — *Redefined*: Rebuild the ReAct execution framework and graph-based supervisor from scratch (taught by `build-agent-from-scratch` and `build-supervisor`).
*   `vizier-v2-memory-retrieval` (build · L) — *Redefined*: Integrate long-term memory extraction and hybrid vector retrieval (taught by `build-memory-layer` and `build-hybrid-search`).
*   `vizier-v2-gate-safety` (build · M) — *Redefined*: Connect the human-in-the-loop proposal queue and injection overlap scanner (taught by `build-proposal-gate` and `build-overlap-scanner`).
*   `vizier-v2-evals-traces` (build · M) — *Redefined*: Implement LLM-as-a-judge regression testing and observability span tracing (taught by `build-eval-judge` and `build-tracing-instrumentation`).
*   `vizier-v2-redteam-ship` (build · M) — *Redefined*: Package, containerize, container-deploy, and establish CI/CD for the entire system (taught by `build-github-actions-pipeline` and `build-container-deployment`).
