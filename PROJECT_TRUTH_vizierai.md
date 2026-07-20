# Vizier — PROJECT TRUTH
Last verified: July 20, 2026, from the active codebase on `main` (merged from `ignition`).

## 1. One-liner
A self-rewiring interactive curriculum map and notes textbook for mastering AI engineering.

## 2. Elevator pitch
VIZIER is a single-purpose learning brain. It renders 228 curriculum nodes across 10 AI engineering domains as an interactive cosmic graph and a mobile-first searchable library. Notes written in markdown with wikilinks are compiled into the graph, flipping nodes from dark (planned) to charging (pasted/in-progress) to lit (mastered). The entire system — curriculum compiler, note parser, status automation, Library view, note reader, gamification overlay, and D3 visualizer — runs as a static single-page app deployed on Vercel.

## 3. What it is
VIZIER solves the problem of tracking a long, structured learning marathon where linear logs fail to capture conceptual connections. It is a visual, self-rewiring knowledge graph and searchable textbook that grows node-by-node through honest, note-driven progress.

The project has one part: a static web client displaying an interactive D3 graph and scannable Library of 228 curriculum nodes across 10 permanent AI domains. During builds (`npm run build-brain`), a Node.js compiler parses markdown notes from `notes/`, validates frontmatter schema and body content, extracts `[[wikilinks]]` to generate graph edges, computes streaks and XP, and outputs static HTML notes and JSON indexes (`site/brain-index.public.json`, `site/brain-index.preview.json`, `curriculum/curriculum.json`) consumed by the frontend.

**The agent-lab chapter.** VIZIER originally included a multi-agent laboratory (LangGraph supervisor, specialist subgraphs, MCP adapters, HITL proposal gate, Next.js safety cockpit, prompt injection scanner). In the brain simplification of July 2026, every concept from agent-lab was absorbed into the curriculum as "build it yourself from scratch" nodes, and reference code was removed from the working tree. The full agent-lab codebase is preserved at the git tag `pre-brain-simplification`. The curriculum now teaches those same systems as hands-on build projects.

## 4. Tech stack

| Component | Technologies | Role |
| :--- | :--- | :--- |
| **Visualizer & Library** | HTML5, JavaScript (Vanilla ES6), D3.js, SVG, Canvas, CSS | Renders interactive concentric/galaxy graph, Library list/grid, inspector panel, search, gamification UI. |
| **Build Pipeline** | Node.js | Compiles curriculum markdown → JSON indexes & static HTML notes, parses notes/wikilinks, validates schema/content integrity. |
| **In-App Reader** | HTML5, CSS3, Local `highlight.js` | Mobile-first reader overlay with syntax highlighting, copy-code buttons, scrollable code/tables, and `[[wikilink]]` routing. |
| **Styling** | Vanilla CSS (glassmorphism, dark HSL palette) | Mobile-first 375px responsive dark cosmic theme. |
| **Deployment** | Vercel (static) | Builds via `npm run build-brain`, serves `site/` as output directory. |
| **Data** | JSON (`brain-index.public.json`, `brain-index.preview.json`, `badges.json`, `curriculum.json`) | All state is compiled at build time; zero runtime server or database dependencies. |

## 5. Core features
* **Concentric Ring / Galaxy Graph**: A physics-based D3 visualization mapping 10 domains and 228 nodes with two layout modes (concentric rings with orbital spin, force-directed galaxy), zoom/pan, hover tooltips, and click-to-inspect.
* **Library View & View Toggle**: Dual-mode engine (`Graph | Library`) with instant graph state preservation. Features progress dashboard, hero "Continue" chapter card, multi-faceted filtering (status, domain, type, ring, size), 5 sorting modes, and touch-friendly 48px+ scannable node rows.
* **In-App Note Reader**: Mobile-first overlay / desktop panel rendering GitHub-flavored Markdown. Includes offline `highlight.js` syntax highlighting, copy-code buttons, scrollable code blocks/tables, and interactive `[[wikilink]]` navigation.
* **Strict 1-to-1 Note Architecture**: 228 markdown note files in `notes/` strictly matching curriculum node IDs 1-to-1 (`<node-id>.md`).
* **YAML Frontmatter Schema & Guard Rails**: Schema enforcing `id`, `title`, `domain`, `ring`, `type`, `size`, `status` (dark/charging/lit), `version`, `created`, `updated`, `lit_date`, `revisions`, `artifact`, `wikilinks`, `tags`. Build fails loudly via `tools/validate-notes.js` and `tools/site-build/compile-curriculum.js` if any lit node lacks substantive content (Empty-Lit Guard).
* **Wikilink & Backlink Engine**: The build compiler (`tools/site-build/compile-curriculum.js`) crawls markdown notes, extracts `[[wikilinks]]`, and generates bidirectional edges and backlink lists for the graph inspector and note reader.
* **Note-Driven Status Automation**: Node status transitions automatically — dark (planned) → charging (pasted/in-progress) → lit (mastered). Status is derived from note frontmatter at build time. Lit nodes are locked and immutable (`curriculum/.locked/<node-id>.json`).
* **XP & Level System**: XP computed per lit node by size (S=10, M=25, L=50, capstone=100). Level bar in left panel (1000 XP/level) with titles: Apprentice → Journeyman → Engineer → Architect → Vizier.
* **Streak Flame**: Daily streak counter with current and best-ever display, driven by git commit/build history.
* **Boss Nodes**: 10 domain capstone nodes render with a distinct glow and trigger celebration particle physics on first light.
* **Trophy Shelf**: Badge system (`site/badges.json`) with a modal shelf displaying achievements (First Light, Ring Closed ×10, Century, The Rebuild, Graduation).
* **LIVE / VISION Modes**: LIVE shows lit/charging nodes (real progress). VISION shows the full planned graph including all dark nodes.
* **Deep-Link & Inspector**: Click any node to open a detail panel with metadata, prerequisites, backlinks, note preview, and copy-link.

## 6. Frontmatter Schema & Lighting Rules

Every note file in `notes/<node-id>.md` MUST conform to this frontmatter schema:

```yaml
---
id: <node-id>
title: "<Node Title>"
domain: <domain>
ring: <1-10>
type: <concept|build|deep-dive|synthesis|capstone|frontier>
size: <S|M|L>
status: <dark|charging|lit>
version: <x.y.z>
created: YYYY-MM-DD
updated: YYYY-MM-DD
lit_date: <YYYY-MM-DD | null>
revisions: <integer>
artifact: <relative-path | null>
wikilinks: []
tags: [<domain>]
---
```

### Lighting Rules
1. **Dark (Default)**: Note contains frontmatter shell and HTML comment comment line `<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE... -->`. Node renders dim on graph/library.
2. **Charging**: Masterclass note content pasted below the HTML comment. `status` set to `charging`. Version bumped to `0.2.0`. Node pulses on graph and shows CHARGING badge in Library.
3. **Lit (Mastered)**: Mastery verified, explanation written, artifact built (if build type). `status` set to `lit`, `completed: YYYY-MM-DD`, `lit_date: YYYY-MM-DD`, `version: 1.0.0`.
4. **Empty-Lit Guard**: The build pipeline (`tools/validate-notes.js` and `compile-curriculum.js`) enforces that any note with `status: lit` MUST have at least 3 non-comment, non-heading lines of 20+ characters. If an empty lit node is found, the build fails immediately with exit code 1.
5. **Immutability Lock**: On first light, `compile-curriculum.json` creates a JSON snapshot in `curriculum/.locked/<node-id>.json`. Any attempt to alter node metadata or downgrade a lit node causes build failure.

## 7. The Paste Ritual

To light a node during learning sessions:
1. Open the note file: `notes/<node-id>.md`.
2. Paste the complete masterclass text directly below line 19 (`<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE... -->`).
3. Set `status: charging` (if currently studying/editing) or `status: lit` (if mastered).
4. Update frontmatter dates: `updated: YYYY-MM-DD`, `completed: YYYY-MM-DD`, `lit_date: YYYY-MM-DD`.
5. Bump `version` (e.g. `0.2.0` for charging, `1.0.0` for lit) and increment `revisions`.
6. Run the build command:
   ```bash
   npm run build-brain
   ```
7. Verify build output (`validate-notes PASSED`, zero errors).
8. Commit and deploy:
   ```bash
   git add .
   git commit -m "learn(<domain>): light <node-id>"
   git push origin main
   ```

## 8. Feature status table

| Feature | Status | Evidence / File Path |
| :--- | :--- | :--- |
| **D3 Graph Visualizer (rings + galaxy)** | SHIPPED | `site/index.html` — D3/SVG/Canvas interactive visualizer. |
| **Library View Engine** | SHIPPED | `site/index.html` — `#library-view`, progress dashboard, continue hero card, filter/sort list. |
| **In-App Note Reader** | SHIPPED | `site/index.html` — `#insp` overlay, Markdown renderer, wikilink router. |
| **Offline Syntax Highlighting** | SHIPPED | `site/assets/highlight.min.js`, `site/assets/highlight.min.css` — bundled syntax highlighting. |
| **Note Validation Guard Rails** | SHIPPED | `tools/validate-notes.js`, `tools/site-build/compile-curriculum.js` — Empty-Lit Guard & 1-to-1 check. |
| **1-to-1 Curriculum Notes System** | SHIPPED | `notes/*.md` — 228 markdown note files strictly mapped 1-to-1 to curriculum. |
| **Wikilink & Backlink Parser** | SHIPPED | `tools/site-build/compile-curriculum.js` — `[[wikilink]]` extraction and edge compiler. |
| **Note-Driven Status Automation** | SHIPPED | `tools/site-build/compile-curriculum.js` — reads `status`/`lit_date` frontmatter fields. |
| **Structured Notes Template & Guide** | SHIPPED | `notes/TEMPLATE.md`, `NOTES_GUIDE.md` — paste ritual & frontmatter specification. |
| **XP & Level System** | SHIPPED | `site/index.html` — level progress bar, XP counter, rank titles. |
| **Streak Flame** | SHIPPED | `site/index.html` — streak calculation and flame UI display. |
| **Boss Node Glow** | SHIPPED | `site/index.html` — capstone nodes render with glow filter & particle burst. |
| **Trophy Shelf & Badges** | SHIPPED | `site/badges.json`, `site/index.html` — trophy modal shelf UI. |
| **Domain Progress Rings** | SHIPPED | `site/index.html` — per-domain completion percentages. |
| **Search (Graph & Library)** | SHIPPED | `site/index.html` — instant fuzzy search across titles, IDs, tags, domains. |
| **LIVE / VISION Toggle** | SHIPPED | `site/index.html` — `#btn-live` / `#btn-preview` mode switching. |
| **Curriculum Compiler** | SHIPPED | `tools/site-build/compile-curriculum.js` — parses graph and notes → JSON. |
| **Static Build Script** | SHIPPED | `tools/site-build/build.js` — generates static HTML notes and site bundles. |
| **Vercel Production Deployment** | SHIPPED | `vercel.json` — `buildCommand: npm run build-brain`, `outputDirectory: site`. |
| **Mobile Responsive Layout (375px)** | SHIPPED | `site/assets/style.css`, `site/index.html` — mobile-first 375px responsive design. |

## 9. Real vs. Demo
* **What is real**:
  * The build pipeline compiles notes, parses wikilinks, extracts backlinks, enforces content rules, and outputs site JSON.
  * The D3 visualizer renders concentric rings, nodes, edges, and gamification overlays client-side.
  * The Library view provides instant fuzzy search, multi-faceted filtering, 5 sorting options, and progress counts.
  * Note reader opens GFM formatted notes with offline code highlighting, copy buttons, and wikilink navigation.
  * Vercel production deployment builds and serves the site statically at root.
* **What is honestly zero right now** (as of July 20, 2026):
  * **Curriculum progress**: 1 of 228 nodes is lit (`attention-transformers`), 1 node is charging (`map-of-ai`), 226 are dark.
  * **XP / Level**: 10 XP, Level 1 (Apprentice). Progress accumulates strictly from real note completion.
  * **Streaks**: Current streak is calculated from real commit history.

## 10. Curriculum philosophy & graph design
* **Nodes, Not Calendars**: The graph is independent of rigid dates. Progress is asymmetric and honestly tracked.
* **Node Life-Cycle States**:
  * **Dark (Ghost)**: Planned. Dim node on graph/library.
  * **Charging**: In progress. Note content pasted, status: charging, pulsing graph node.
  * **Lit**: Mastered. Content verified, locked in `curriculum/.locked/`. Immutable.
* **The 10 Permanent Domains**: Foundations, Prompting & APIs, RAG & Retrieval, Agents, Multi-Agent & MCP, Memory & Knowledge, Evals & Observability, Safety & Security, Production, Frontier & Capstone.
* **228 Nodes**: 1-to-1 mapping with `notes/<node-id>.md`.

## 11. Full curriculum map
The complete 228-node curriculum (all 10 domains, every cluster, node ID, type, size, summary, and edge wiring) lives in:

→ **[CURRICULUM_FULL.md](CURRICULUM_FULL.md)** (repo root)
