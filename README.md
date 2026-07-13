# VIZIER 🧠

VIZIER is a living, public 250-day scientific second brain of health, biology, and systems-level learning notes. Rather than a generic reactive chatbot, it is built as a highly structured personal knowledge graph that grows by one node per day.

Every published note is subjected to VIZIER's **Three Gates of Honesty** to ensure rigorous, evidence-based learning:
1. **Cited**: Every factual claim link directly to primary scientific literature (PubMed, PMC, etc.).
2. **Tiered**: Sources are categorized by evidence quality (e.g. *Tier 1* for systematic reviews/meta-analyses, *Tier 2* for randomized controlled trials).
3. **Challenged**: Every note contains a mandatory section highlighting counter-arguments, caveats, or limits to prevent confirmation bias.

---

## 🗺️ Workspace Directory Layout

The workspace is organized to prioritize learning first, keeping operational systems isolated and frozen:

```text
vizier-ai/
├── brain/               # The heart: markdown learning notes (one file per node)
├── curriculum/          # Living node-graph syllabus and roadmap
├── site/                # Public D3 visualizer frontend (deployed to Vercel)
├── posts/               # LinkedIn content and writing archives
├── tools/               # Build pipelines, indexers, and self-review scripts
├── docs/                # Consolidated system specifications, reports, and runbooks
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
1. Create a `_local-secrets/backend/` directory.
2. Create `_local-secrets/backend/.env` containing your private credentials (e.g. Supabase, Telegram keys):
   ```ini
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-key-here"
   TELEGRAM_BOT_TOKEN="your-token"
   TELEGRAM_CHAT_ID="your-chat-id"
   ```

### 3. Run the D3 Visualizer Locally
To view the living brain visualization on your local machine:
```bash
# Start a simple HTTP server in the site directory
npx http-server site
# Open http://localhost:8080 in your browser
```

### 4. Run Build and Validation Scripts
Run the compiler scripts to scan your markdown notes, calculate network connections, and compile static web assets:
```bash
# Scan local markdown brain notes, validate headers, and query Supabase counts
node brain/scan.js

# Build notes, generate feed, and render markdown files to HTML pages
node tools/site-build/build.js

# Regenerate the D3 visualizer preview json representation
node tools/site-build/gen-preview-brain.js
```

### 5. Send Telegram Micro-Lessons
VIZIER schedules daily pushes of Feynman learning notes to a Telegram channel:
```bash
# Deterministically select and push the next unseen micro-lesson
node brain/push-micro-lesson.js
```
