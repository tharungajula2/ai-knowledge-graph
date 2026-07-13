# VIZIER 🧠

VIZIER is a versioned, evolving, and public 250-day interactive knowledge brain dedicated exclusively to **Mastering AI Engineering**. Rather than a generic reactive chatbot, it is built as a highly structured personal knowledge graph that grows by one node per day, tracing a rigorous path from deep foundations to the frontier edge.

Every published note is subjected to VIZIER's **Three Gates of Honesty** to ensure rigorous, evidence-based learning:
1. **Cited**: Every factual claim links directly to primary sources, specifications, or core research papers.
2. **Tiered**: Sources are categorized by evidence quality (e.g., *Tier 1* for primary model specs/peer-reviewed papers, *Tier 2* for official developer documentation, *Tier 3* for secondary explainers).
3. **Challenged**: Every note contains a mandatory section highlighting limits, trade-offs, or potential ways the claims could be incorrect to prevent confirmation bias.

---

## 🗺️ Workspace Directory Layout

The workspace is organized to prioritize learning first, keeping operational systems isolated and frozen:

```text
vizier-ai/
├── brain/               # The heart: markdown learning notes grouped by domain
├── curriculum/          # Living node-graph syllabus (VIZIER_MASTERY_GRAPH.md & curriculum.json)
├── site/                # Public D3 visualizer frontend (deployed to Vercel)
├── posts/               # Content archives and LinkedIn/Twitter draft posts
├── tools/               # Build pipelines, indexers, AI replanning and scan scripts
├── docs/                # System specifications, deployment guides, and daily runbooks
├── agent-lab/           # The frozen agentic engine (FastAPI, LangGraph, etc.)
└── _local-secrets/      # Gitignored local credentials, API tokens, and configurations
```

---

## 🚀 Local Quickstart Guide

### 1. Prerequisites & Setup
Ensure you have **Node.js** (v18+) installed. Clone the repository and install the development dependencies:

```bash
# Clone the repository
git clone https://github.com/tharungajula2/vizier-ai.git
cd vizier-ai

# Install root dependencies
npm install
```

### 2. Configure Local Secrets
Keep all secrets isolated outside the source code tree. Set up the `_local-secrets/` structure:
1. Create a `_local-secrets/.env` file containing your private API credentials:
   ```ini
   GEMINI_API_KEY="your-gemini-key-here"
   ```

### 3. Run Build and Validation Scripts
Run the compiler scripts to scan your markdown notes, calculate network connections, and compile static web assets:
```bash
# Compile nodes, generate feed, and render markdown files to HTML pages
npm run build-brain

# Regenerate the D3 visualizer preview json representation
node tools/site-build/gen-preview-brain.js
```

### 4. Run the Visualizer Locally
To view the visualizer locally:
```bash
# Start a simple HTTP server in the root or site directory
python -m http.server 8000
# Open http://localhost:8000/site/brain.html in your browser
```

---

## 🛠️ The Operational Runbook
For complete instructions on daily learning, content pipeline schedules, and automated curriculum replanning, see [docs/DAILY_RITUAL.md](docs/DAILY_RITUAL.md). For hosting instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
