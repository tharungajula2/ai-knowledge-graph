# Vizier — PROJECT TRUTH
Last verified: July 18, 2026, from the active codebase on `main` (merged from `brain-only`).

## 1. One-liner
A self-rewiring interactive curriculum map and notes textbook for mastering AI engineering.

## 2. Elevator pitch
VIZIER is a single-purpose learning brain. It renders 228 curriculum nodes across 10 AI engineering domains as an interactive cosmic graph. Notes written in markdown with wikilinks are compiled into the graph, flipping nodes from ghost (planned) to charging (in-progress) to lit (complete). The entire system — curriculum compiler, note parser, status automation, gamification overlay, and D3 visualizer — runs as a static single-page app deployed on Vercel.

## 3. What it is
VIZIER solves the problem of tracking a long, structured learning marathon where linear logs fail to capture conceptual connections. It is a visual, self-rewiring knowledge graph that grows node-by-node through honest, note-driven progress.

The project has one part: a static frontend displaying an interactive D3 graph of 228 curriculum nodes in 10 permanent AI domains, with concentric ring and galaxy layout modes. During builds, a Node.js compiler parses markdown notes from `notes/` and `brain/knowledge/`, extracts `[[wikilinks]]` to generate graph edges, computes streaks and XP, and outputs JSON indexes consumed by the client-side visualizer.

**The agent-lab chapter.** VIZIER originally included a multi-agent laboratory (LangGraph supervisor, specialist subgraphs, MCP adapters, HITL proposal gate, Next.js safety cockpit, prompt injection scanner). That system was built by IDE coding agents as a learning exercise. In the brain simplification of July 2026, every concept from agent-lab was absorbed into the curriculum as "build it yourself from scratch" nodes, and the reference code was removed from the working tree. The full agent-lab codebase is preserved at the annotated git tag `pre-brain-simplification` for historical reference. The curriculum now teaches those same systems as hands-on build projects, which is the entire point.

## 4. Tech stack

| Component | Technologies | Role |
| :--- | :--- | :--- |
| **Visualizer** | HTML5, JavaScript, D3.js, SVG, Canvas, CSS | Renders the interactive concentric/galaxy graph, inspector panel, search, gamification UI. |
| **Build Pipeline** | Node.js | Compiles curriculum markdown → JSON indexes, parses notes/wikilinks, computes streaks and XP. |
| **Styling** | Vanilla CSS (glassmorphism, HSL palette) | Dark cosmic theme with responsive mobile layout. |
| **Deployment** | Vercel (static) | Builds via `npm run build-brain`, serves `site/` as output directory. |
| **Data** | JSON (brain-index.public.json, badges.json, curriculum.json) | All state is compiled at build time; zero runtime dependencies. |

## 5. Core features
* **Concentric Ring / Galaxy Graph**: A physics-based D3 visualization mapping 10 domains and 228 nodes with two layout modes (concentric rings with orbital spin, force-directed galaxy), zoom/pan, hover tooltips, and click-to-inspect.
* **Wikilink & Backlink Engine**: The build compiler (`tools/site-build/compile-curriculum.js`) crawls markdown notes, extracts `[[wikilinks]]`, generates bidirectional edges and backlink lists for the graph inspector.
* **Note-Driven Status Automation**: Node status transitions automatically — ghost → charging (note exists with `started` date, no `completed` date) → lit (note has `completed` date). Status is derived from note frontmatter at build time. Lit nodes are locked and immutable.
* **Structured Notes Pipeline**: Notes follow a mandatory template (`notes/TEMPLATE.md`): ELI5, Real Explanation, Why It Matters, Hands-On, Proof, Prove It (5 self-test questions), Wikilinks, Status Log.
* **XP & Level System**: XP computed per lit node by size (S=10, M=25, L=50, capstone=100). Level bar in left panel (1000 XP/level) with titles: Apprentice → Journeyman → Engineer → Architect → Vizier.
* **Streak Flame**: Daily streak counter with current and best-ever display, driven by commit/build history.
* **Boss Nodes**: 10 domain capstone nodes render with a distinct glow and trigger a celebration animation on first light.
* **Trophy Shelf**: Badge system (`site/badges.json`) with a modal shelf displaying achievements (First Light, Ring Closed ×10, Century, The Rebuild, Graduation).
* **Per-Domain Progress Rings**: Completion percentages shown in the ring legend panel.
* **Search**: Client-side fuzzy search across node titles, tags, and domains.
* **LIVE / VISION Modes**: LIVE shows only lit/charging nodes (real progress). VISION shows the full planned graph including all ghosts.
* **Deep-Link & Inspector**: Click any node to open a detail panel with metadata, prerequisites, backlinks, note preview, and copy-link.
* **Tour Mode**: Automated fly-through animation visiting each domain ring.

## 6. Feature status table

| Feature | Status | Evidence |
| :--- | :--- | :--- |
| **D3 Graph Visualizer (rings + galaxy)** | SHIPPED | `site/index.html` — 2781 lines, full D3/SVG/Canvas renderer. |
| **Wikilink & Backlink Parser** | SHIPPED | `tools/site-build/compile-curriculum.js` — wikilink extraction and edge generation. |
| **Note-Driven Status Automation** | SHIPPED | `tools/site-build/compile-curriculum.js` — reads frontmatter `status`/`completed` fields. |
| **Structured Notes Template** | SHIPPED | `notes/TEMPLATE.md` — 7-section mandatory structure. |
| **XP & Level System** | SHIPPED | `site/index.html` lines 720–730 — level bar, XP counter, title display. |
| **Streak Flame** | SHIPPED | `site/index.html` lines 732–743 — streak current/best display. |
| **Boss Node Glow** | SHIPPED | `site/index.html` — capstone nodes render with distinct glow filter. |
| **Trophy Shelf & Badges** | SHIPPED | `site/badges.json` (5 badges defined), `site/index.html` lines 921–955 (modal). |
| **Domain Progress Rings** | SHIPPED | `site/index.html` — per-domain completion % in ring legend. |
| **Search** | SHIPPED | `site/index.html` — `#search-panel` with fuzzy matching. |
| **LIVE / VISION Toggle** | SHIPPED | `site/index.html` — `#btn-live` / `#btn-preview` mode switching. |
| **Tour Mode** | SHIPPED | `site/index.html` — `#btn-tour` automated domain fly-through. |
| **Curriculum Compiler** | SHIPPED | `tools/site-build/compile-curriculum.js` — parses `VIZIER_MASTERY_GRAPH.md` → JSON. |
| **Day-Close Pipeline** | SHIPPED | `tools/day-close.js` — builds, computes streaks, commits, pushes. |
| **Next-Node / Finish-Node CLI** | SHIPPED | `tools/next-node.js`, `tools/finish-node.js` — node selection and completion workflow. |
| **Frontier Scanner** | SHIPPED | `tools/frontier-scan.js` — Gemini-powered ghost node update scanner. |
| **QA Integrity Checker** | SHIPPED | `tools/check-qa-integrity.js` — validates all nodes have required fields, zero orphans. |
| **Vercel Production Deployment** | SHIPPED | `vercel.json` — `buildCommand: npm run build-brain`, `outputDirectory: site`. |
| **Mobile Responsive Layout** | SHIPPED | `site/assets/style.css` — `@media (max-width: 768px)` collapsible panels. |

## 7. Real vs. Demo
* **What is real**:
  * The build pipeline compiles notes, extracts wikilinks, generates graph JSON, and computes XP/streaks correctly.
  * The D3 visualizer renders concentric rings, nodes, edges, stats, and gamification overlays fully client-side.
  * The note template and status automation pipeline are fully functional.
  * Vercel production deployment builds and serves the brain SPA at root (`/`).
* **What is honestly zero right now** (as of July 18, 2026):
  * **Curriculum progress**: 0 of 228 nodes are lit. 1 node (`map-of-ai`) exists as `in-progress`. The other 227 are ghosts. All progress from here is real and note-driven — there is no simulation.
  * **XP / Level**: 0 XP, Level 1 (Apprentice). Will increase only when notes are completed and nodes are lit.
  * **Streaks**: Current streak is 0. Will accumulate from actual daily builds.
  * **Badges**: All locked. Earned only by real milestones.

## 8. Problems solved / Technical hurdles overcome
* **Brain Simplification Architecture**: Designed a process to absorb every concept from a working multi-agent system into curriculum build nodes, then safely remove the reference implementation while preserving it at a git tag — converting "code I was given" into "things I must build myself."
* **Wikilink-Driven Graph Rewiring**: Built a compiler that reads `[[wikilinks]]` from free-form markdown notes and deterministically generates graph edges and backlinks, making the knowledge graph self-organizing as notes are written.
* **Gamification as Pure Overlay**: Implemented XP, levels, streaks, boss nodes, and badges as a pure data-driven overlay on the existing graph engine — all computed from the built JSON at render time, degrading gracefully if fields are absent, with zero changes to graph physics or data semantics.
* **Single-Page Static Deployment**: Converted a multi-page site (home, feed, about, brain) into a single-page brain-only app served at root, with Vercel redirects for legacy URLs, eliminating all backend runtime dependencies.

## 9. Known limitations
*Sourced from `QA_REPORT.md` (July 17, 2026 audit).*

* **Empty graph in LIVE mode**: LIVE mode shows 0 nodes because nothing is lit yet. An empty-state overlay explains this and offers a dismiss button. VISION mode shows the full 228-node plan.
* **No runtime server**: The app is fully static. There is no backend, no database, no API. All state is baked at build time. This is intentional but means progress requires local builds and git pushes.
* **Notes pipeline is manual**: Writing a note, running `npm run finish-node`, and running `npm run day:close` are manual CLI steps. There is no automated ingestion or CI trigger.
* **Single note exists**: Only `notes/map-of-ai.md` and `brain/knowledge/foundations/map-of-ai.md` exist as real content. The textbook is 99.5% unwritten.
* **Frontier nodes are stale placeholders**: The 5 frontier-type nodes contain baseline guesses from graph creation date. They are designed to be regenerated via `npm run frontier-scan` when approached.

## 10. Ready-made copy

### Resume bullet points
* Built an interactive D3.js knowledge graph visualizer rendering 228 AI engineering curriculum nodes across 10 domains with concentric ring and force-directed galaxy layouts.
* Engineered a markdown-to-graph compiler in Node.js that parses wikilinks from structured notes, generates bidirectional edges, and automates node status transitions (ghost → charging → lit) from note metadata.
* Designed a gamification overlay (XP/levels, streaks, boss nodes, trophy badges) as a pure data-driven layer computed at build time with zero coupling to graph physics.
* Executed a codebase simplification that absorbed a multi-agent system's concepts into build-it-yourself curriculum nodes, converting reference code into structured learning objectives.

### LinkedIn description
I built VIZIER to track my journey mastering AI engineering. It's an interactive cosmic graph of 228 curriculum nodes across 10 domains — from foundations and APIs to agents, security, and production. Notes written in markdown with wikilinks automatically rewire the graph's edges. Nodes light up only when I've written a Feynman-depth explanation and, for builds, a working artifact. The whole system compiles to a static single-page app deployed on Vercel. Every concept from a multi-agent system I studied was absorbed into the curriculum as "build it from scratch" nodes — the map doesn't just track learning, it IS the textbook.

### GitHub README intro
VIZIER is a single-purpose learning brain — an interactive, self-rewiring curriculum map for mastering AI engineering. 228 nodes across 10 domains. Notes light up nodes. Wikilinks create edges. Progress is real and publicly visible. The brain is the app.

## 11. Interview talking points
* **The Simplification Decision**: Explain that you had a working multi-agent system (LangGraph supervisor, MCP adapters, HITL gate, safety cockpit) built by coding agents, and you chose to remove it and convert every concept into build-it-yourself curriculum nodes — because understanding > having.
* **Wikilink Graph Engine**: Explain how free-form `[[wikilinks]]` in markdown notes are parsed at build time to generate graph edges, making the knowledge map self-organizing as you learn.
* **Gamification Design**: Explain the XP/level/badge system as a pure overlay — computed from the same JSON the graph uses, no separate state store, degrades gracefully if fields are missing.
* **The Curriculum Philosophy**: Explain why the graph uses nodes-not-calendars, why lit nodes are immutable, and why frontier nodes are regenerated from live scans rather than frozen at creation.

## 12. Curriculum philosophy & graph design
* **Nodes, Not Calendars**: The graph is independent of calendar deadlines. Nodes take variable time. Progress is asymmetric and honestly tracked.
* **Node Life-Cycle States**:
  * **Ghost**: Planned (uncompleted). Dim on the graph.
  * **Charging**: In progress (note exists, pulsing animation).
  * **Lit**: Completed. Locked forever (`locked: true`). Immutable.
* **The 10 Permanent Domains**: Foundations, Prompting & APIs, RAG & Retrieval, Agents, Multi-Agent & MCP, Memory & Knowledge, Evals & Observability, Safety & Security, Production, Frontier & Capstone.
* **228 Nodes**: ~88 build nodes, 10 capstones, 10 synthesis nodes, 5 frontier placeholders, the rest concept nodes. Count will change via replans — that's the point.

## 13. Mastery graph rules
1. The 10 domains (rings) are the permanent spine. Nodes evolve; rings never do.
2. Lit nodes are immutable — tooling refuses to alter them.
3. A node isn't lit until its note has a Feynman explanation (and, for builds, a working artifact).
4. Notes use `[[wikilinks]]` freely; the build rewires edges and backlinks organically.
5. `sync` runs regularly, lit node or not. Charging is real work.
6. Replans need a written reason in `curriculum/CHANGELOG.md`. Never replan from restlessness.
7. `frontier` nodes are placeholders — regenerated from a fresh frontier-scan when approached.

## 14. Floating milestones
* **M1 — RESURRECTION**: Deploy a full backend + dashboard with my own hands. Baseline: `resurrection`.
* **M2 — THE BRIDGE**: The deployed agent proposes brain nodes through its own approval gate. Baseline: `the-bridge`.
* **M3 — FIRST PUBLIC ARTIFACT**: Ship something strangers can use. Baseline: `build-feynman-bot`.
* **M4 — HALF-LIT BRAIN**: 50% of nodes lit; the halfway story post.
* **M5 — VIZIER v2**: The final capstone — a unified agent+brain system designed and built by me from scratch. Baseline: `define-vizier-v2`.

## 15. Operational workflow loops

### 15.1 The Daily Loop
1. Run `npm run next-node` to select the next ghost node or continue the active one.
2. Write the note in `notes/` using the template. Use `[[wikilinks]]` freely.
3. Run `npm run finish-node` to transition to `learned` and lock it.
4. Run `npm run day:close` (or `npm run sync`) to build, compute streaks, commit, push.

### 15.2 The Content Loop
* On lighting a node, `npm run draft-post` generates content drafts in `posts/<node-id>/`.
* 1-in-4 format rotation: Carousels, Text, Infographics, Video walk-throughs.

### 15.3 The Evolution Loop
* `npm run frontier-scan` — crawl recent AI developments to refresh frontier nodes.
* `npm run replan` — modify ghost nodes with LLM suggestions; changes logged in `curriculum/CHANGELOG.md`.

## 16. Full curriculum map
The complete 228-node curriculum (all 10 domains, every cluster, every node with ID/title/type/size/summary, milestones, and cross-domain edge wiring) lives in:

→ **[CURRICULUM_FULL.md](CURRICULUM_FULL.md)** (repo root)

Canonical source: `curriculum/VIZIER_MASTERY_GRAPH.md`.

### Domain summary

| # | Domain | Ring | Nodes |
|---|--------|------|------:|
| 01 | Foundations | `foundations` | 24 |
| 02 | Prompting & LLM APIs | `prompting-apis` | 20 |
| 03 | RAG & Retrieval | `rag-retrieval` | 22 |
| 04 | Agents | `agents` | 20 |
| 05 | Multi-Agent & MCP | `multi-agent-mcp` | 19 |
| 06 | Memory & Knowledge | `memory-knowledge` | 19 |
| 07 | Evals & Observability | `evals-observability` | 22 |
| 08 | Safety & Security | `safety-security` | 20 |
| 09 | Production | `production` | 38 |
| 10 | Frontier & Capstone | `frontier-capstone` | 24 |
| | **Total** | | **228** |
