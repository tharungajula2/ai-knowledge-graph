# VIZIER 🧠 — Interactive AI Engineering Knowledge Graph & Brain

> **Persona & System Overview:** An interactive, node-driven AI engineering knowledge brain and static web application compiling 228 curriculum nodes across 10 permanent AI domains into a physics-based D3 cosmic graph visualizer, scannable Library, and mobile-first in-app note reader with automated status validation ("Gates of Honesty").

---

## 1. Project Title & One-Line Persona

**VIZIER** is a self-rewiring, zero-runtime-server knowledge compilation system and static SPA designed for mastering AI Engineering. It parses structured Markdown notes, extracts bidirectional `[[wikilinks]]`, validates frontmatter schema rules, calculates gamified XP/streaks, and compiles a living D3 visualization and interactive textbook across 10 domains.

---

## 2. Headline Results Table & Top 3 Takeaways

### System Quantitative Overview

| Metric / Dimension | Quantity / Value | Technical Context |
|---|---|---|
| **Total Curriculum Nodes** | **228 nodes** | 10 permanent AI domains (Foundations to Frontier Capstone) |
| **Curriculum Node Types** | Concept (112), Build (60), Deep-Dive (32), Capstone (10), Synthesis (14) | S (≤1d), M (1-2d), L (3+d) effort sizing |
| **Gates of Honesty Guard** | **Min 3 lines (20+ chars)** per lit note | Zero empty-lit nodes permitted by automated build parser |
| **Graph Edges & Links** | Bidirectional `[[wikilinks]]` parsing | Dynamic backlink lists and force-directed graph edges |
| **Gamification Scale** | 1,000 XP / Level | S=10 XP, M=25 XP, L=50 XP, Capstone=100 XP |
| **Target Runtime Footprint** | **0 Server / 0 DB Dependencies** | 100% compiled static build deployed on Vercel |

### Top 3 Critical Insights

1. **Strict Node-Driven Progress Automation:** Nodes are strictly categorized into 3 state transitions: `dark` (planned ghost node) $\rightarrow$ `charging` (in-progress with pasted study notes) $\rightarrow$ `lit` (mastered, locked, with Feynman explanation). Lighting a node triggers automated frontmatter updates, streak incrementing, and immutability ledger snapshots (`curriculum/.locked/`).
2. **Automated Empty-Lit Guard:** To guarantee zero superficial checkmarks, the build compiler (`tools/validate-notes.js` & `tools/site-build/compile-curriculum.js`) executes an **Empty-Lit Guard**. If any note marked `status: lit` lacks substantive body content, the build process immediately terminates with Exit Code 1.
3. **Single-Page Application & Local Indexing:** All state (nodes, links, streaks, XP, trophy shelf) is compiled during build time into lightweight JSON artifacts (`brain-index.public.json`, `curriculum.json`). The web frontend renders a responsive D3 galaxy graph and offline-capable Markdown reader using local `highlight.js` without external runtime API calls.

---

## 3. High-Level Architecture Diagram

```
========================================================================================================
                                    INPUT LAYER & KNOWLEDGE CONTENT
========================================================================================================
[ notes/ ] ------------------> 228 Markdown Note Files organized in 10 Domain Folders
                               (01-foundations/ to 10-frontier-capstone/)
[ curriculum/ ] -------------> Syllabus Definition (CURRICULUM_FULL.md) & Locked Immutability Ledger (.locked/)

========================================================================================================
                               BUILD & COMPILATION PIPELINE (tools/)
========================================================================================================
  tools/validate-notes.js           tools/site-build/compile-curriculum.js       tools/sync-note.js
  Enforces YAML Schema              Parses Markdown & [[wikilinks]]             CLI Automation
  Checks Empty-Lit Guard            Calculates XP, Level, Streaks, Badges       Updates Frontmatter
  Fails build on invalid notes      Compiles JSON indexes & HTML note pages     Git Commit & Push
       |                                           |                                   |
       +-------------------------------------------+-----------------------------------+
                                                   |
                                                   v
========================================================================================================
                               OUTPUT ARTIFACTS & WEB DEPLOYMENT (site/)
========================================================================================================
[ site/brain-index.public.json ] -> Compact node graph, metadata, and link dataset
[ site/brain-index.preview.json ] -> Full preview index including internal draft notes
[ site/notes/ ] --------------------> Pre-rendered static HTML note pages with syntax highlighting
[ site/ ] --------------------------> Deployed to Vercel (Static Single-Page Application)

========================================================================================================
                               FRONTEND USER INTERFACE & COMPONENT SYSTEM
========================================================================================================
[ site/js/graph-engine.js ] -------> Interactive D3.js Cosmic Visualizer (Concentric Rings & Galaxy modes)
[ site/js/library-engine.js ] -----> Searchable/Filterable Library list view with sorting & progress tracking
[ site/js/note-reader.js ] --------> In-App Markdown Note Reader overlay with wikilink navigation
[ site/js/gamification.js ] -------> XP progress bar, level titles, streak flame, and trophy shelf modal
```

---

## 4. Quickstart Execution Guide

### Prerequisites & Environment Setup

```bash
# Clone the repository and navigate to workspace
cd "d:\0000_after portfolio_24726\0_vizier\vizier"

# Install Node.js project dependencies
npm install
```

### Note Writing & One-Command Sync Ritual

```bash
# 1. Open active note (e.g. notes/01-foundations/01-02-how-machines-learn.md)
# 2. Paste notes below the marker line: <!-- PASTE MASTERCLASS NOTE BELOW THIS LINE... -->

# 3. Execute single-command sync to validate, compile brain, commit, and push to GitHub:
npm run sync

# 4. Alternatively, to mark the active note as MASTERED & LIT immediately:
npm run light
```

### Local Development & Preview Commands

```bash
# Compile the brain index and static HTML notes without git push
npm run build-brain

# Validate all markdown notes against schema and Empty-Lit guard rails
npm run validate-notes

# Serve the static site locally for browser preview
npm run dev
```

---

## 5. File & Output Inventory Table

| Output / File Path | Primary Description & Key Contents |
|---|---|
| `notes/` | 228 Markdown note files spanning 10 domain folders (`01-foundations` to `10-frontier-capstone`) |
| `curriculum/CURRICULUM_FULL.md` | Master 228-node curriculum syllabus and floating milestone definitions |
| `curriculum/.locked/` | JSON immutability snapshot ledger created on first node lighting |
| `tools/validate-notes.js` | Schema validator and Empty-Lit Guard script |
| `tools/site-build/compile-curriculum.js` | Main compiler extracting wikilinks, generating graph JSON, and building static HTML |
| `tools/sync-note.js` | One-command CLI (`npm run sync` / `npm run light`) automating build and git workflow |
| `site/brain-index.public.json` | Compiled public dataset containing graph nodes, edges, XP, and streak stats |
| `site/brain-index.preview.json` | Extended dataset including charging/draft note previews |
| `site/notes/*.html` | Static pre-rendered HTML note pages consumed by the in-app reader |
| `site/js/app.js` | SPA entry point initializing UI views, event routing, and state stores |
| `site/js/graph-engine.js` | D3.js visualization engine supporting Concentric Rings and Galaxy modes |
| `site/js/library-engine.js` | Library list/grid renderer with search, multi-faceted filtering, and 5-mode sorting |

---

## 6. Key Technical & Domain Matrices

### 10-Domain Curriculum Architecture Matrix

| Domain ID | Domain Title | Focus & Core Competencies | Node Count |
|---|---|---|---|
| **01** | **Foundations** | Machine learning mathematics, loss functions, transformer architecture, attention mechanisms | 24 nodes |
| **02** | **Prompting & APIs** | Structured output parsing, function calling, prompt orchestration, provider SDKs | 22 nodes |
| **03** | **RAG & Retrieval** | Vector databases, chunking strategies, hybrid search, reranking, contextual retrieval | 24 nodes |
| **04** | **Agents** | Agentic loops, tool selection, planning algorithms (ReAct, Plan-and-Solve), sub-agents | 24 nodes |
| **05** | **Multi-Agent & MCP** | Model Context Protocol (MCP), multi-agent consensus, supervisor patterns, handoffs | 22 nodes |
| **06** | **Memory & Knowledge** | Short-term/long-term memory, episodic storage, knowledge graphs, state persistence | 20 nodes |
| **07** | **Evals & Observability** | LLM-as-a-judge, benchmark suites, tracing, telemetry, latency/cost profiling | 22 nodes |
| **08** | **Safety & Security** | Prompt injection defenses, guardrails, red-teaming, sandbox execution, threat modeling | 20 nodes |
| **09** | **Production** | Async streaming backends, caching, rate-limiting, edge deployment, containerization | 20 nodes |
| **10** | **Frontier Capstone** | Local SLM fine-tuning, speculative decoding, multi-modal pipelines, Vizier v2 capstone | 10 nodes |

### Technical Implementation Decisions

1. **Why Static Single-Page App (SPA) on Vercel?** Eliminates server maintenance, runtime database latency, and API costs. Pre-compiling Markdown notes into static JSON and HTML ensures sub-50ms page transitions and full offline capability.
2. **Why D3.js SVG + Canvas Hybrid rendering?** Concentric orbit rings and node labels are rendered via SVG for crisp crisp text and DOM click handling, while particle stars and background connections utilize HTML5 Canvas for high FPS performance across devices.
3. **Why Custom Wikilink Compiler over Obsidian/Roam?** Building a custom Node.js parser (`tools/site-build/compile-curriculum.js`) allows enforcing strict validation rules (Empty-Lit Guard, immutability locking) directly inside the CI/CD deployment pipeline.

---

## 7. Real vs. Synthetic / Illustrative Disclaimers

| Component | Status | Implementation Details |
|---|---|---|
| **Curriculum Map & Notes Engine** | **Production / Active** | Fully operational note compilation, schema validator, and D3 graph engine. |
| **One-Command Sync CLI** | **Production / Active** | `tools/sync-note.js` active in local environment driving daily workflow. |
| **In-App Reader & Offline Syntax** | **Production / Active** | Bundled static `highlight.js` rendering markdown notes within static site. |
| **Multi-Agent Laboratory Code** | *Archived / Historical* | Reference code archived at git tag `pre-brain-simplification`; re-architected as hands-on curriculum build nodes. |

---

## 8. Dependencies & Reproduction Notes

### Core Stack & Libraries

- **Runtime Environment:** Node.js (v18.0.0+)
- **Build Utilities:** `gray-matter` (YAML frontmatter parsing), `marked` (Markdown compiler), `glob`
- **Frontend Assets:** D3.js v7 (CDN / bundled), `highlight.js` v11 (bundled static CSS/JS)
- **Deployment Platform:** Vercel Static Hosting (`vercel.json`)

### Repositories & License Information

- **Workspace:** `vizier-ai`
- **Documentation References:** See [`VIZIER_OWNERS_MANUAL.md`](VIZIER_OWNERS_MANUAL.md) for detailed operator instructions and [`PROJECT_TRUTH_vizierai.md`](PROJECT_TRUTH_vizierai.md) for full architectural specs.

