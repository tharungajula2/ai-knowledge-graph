# VIZIER 🧠

VIZIER is an interactive knowledge brain dedicated exclusively to **Mastering AI Engineering**. It is built as a highly structured personal knowledge graph that grows node-by-node, tracing a rigorous path across 228 curriculum nodes across 10 AI domains.

Every published note is subjected to VIZIER's **Gates of Honesty** to ensure rigorous, evidence-based learning:
1. **Cited**: Every factual claim links directly to primary sources, specifications, or core research papers.
2. **Challenged**: Every note contains a mandatory section highlighting limits, trade-offs, or potential failure modes.

---

## 🗺️ Workspace Directory Layout

The workspace is organized into a clean, intuitive layout:

```text
vizier-ai/
├── README.md                # Project introduction & quickstart
├── VIZIER_OWNERS_MANUAL.md  # Definitive operator manual & single-command guide
├── PROJECT_TRUTH_vizierai.md# Technical specification & system architecture
├── CURRICULUM_FULL.md       # Complete 228-node curriculum map
├── notes/                   # 228 Markdown learning notes in 10 domain folders
│   ├── 01-foundations/      # 01-01-map-of-ai.md to 01-24-capstone-foundations.md
│   ├── 02-prompting-apis/   # 02-01-prompt-skeleton.md ...
│   ├── 03-rag-retrieval/    # 03-01-why-rag.md ...
│   ├── 04-agents/           # 04-01-what-makes-an-agent.md ...
│   ├── 05-multi-agent-mcp/  # 05-01-when-many-beats-one.md ...
│   ├── 06-memory-knowledge/ # 06-01-memory-architectures.md ...
│   ├── 07-evals-observability/# 07-01-why-evals-rule.md ...
│   ├── 08-safety-security/  # 08-01-agent-threat-model.md ...
│   ├── 09-production/       # 09-01-build-fastapi-backend.md ...
│   └── 10-frontier-capstone/# 10-01-local-models.md ...
├── curriculum/              # Living node-graph syllabus & locked ledger (.locked/)
├── site/                    # Public D3 visualizer & Library frontend (Vercel output)
├── tools/                   # Build scripts, note validator & sync-note CLI
└── docs/                    # System runbooks & historical reports
```

---

## 🚀 Quickstart & One-Command Sync Ritual

### 1. Daily Note Writing Workflow
Open the note file inside `notes/<domain-folder>/` (e.g. `notes/01-foundations/01-02-how-machines-learn.md`).
Paste your masterclass notes or build documentation below line 19 (`<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE... -->`).

### 2. Single-Command Sync & Deploy
In your terminal, run **one command**:

```bash
# To sync progress, validate notes, build brain, commit, and push to GitHub:
npm run sync

# To mark active note as MASTERED & LIT:
npm run light
```

---

## 🛠️ Detailed Documentation
- **[VIZIER_OWNERS_MANUAL.md](VIZIER_OWNERS_MANUAL.md)** — Step-by-step owner's guide and workflow cheat sheet.
- **[PROJECT_TRUTH_vizierai.md](PROJECT_TRUTH_vizierai.md)** — Architectural specification, tech stack, and feature state.
- **[CURRICULUM_FULL.md](CURRICULUM_FULL.md)** — Complete 228-node curriculum reference.
