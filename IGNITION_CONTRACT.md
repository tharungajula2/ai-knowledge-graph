# IGNITION CONTRACT
> **Authored:** 2026-07-20 · Branch: `ignition` · Safety tag: `pre-ignition`  
> **Purpose:** Single source of operational truth before the first note is activated. Nothing herein is aspirational — every claim is traced to a file and line in the current codebase.

---

## A. DATA SOURCE OF TRUTH

### Primary Source File
```
curriculum/curriculum.json          (113,700 bytes, 3939 lines)
```
This is the **runtime data source**. The D3 visualization and all build scripts read from this file.  
The upstream authoring source (from which `curriculum.json` is compiled) is:
```
curriculum/VIZIER_MASTERY_GRAPH.md  (identical byte-count as CURRICULUM_FULL.md at repo root)
```
`CURRICULUM_FULL.md` at repo root is a human-readable mirror of `VIZIER_MASTERY_GRAPH.md` — they are kept in sync but the `.md` inside `curriculum/` is what the build pipeline reads.

### Node Count
| Metric | Value |
|---|---|
| **Total curriculum nodes** | **228** |
| Lit nodes (as of this tag) | 0 |
| Total XP | 0 |

### Per-Domain Counts (exact, from `curriculum.json` at `pre-ignition`)
| Domain | Node Count |
|---|---|
| `foundations` | 24 |
| `prompting-apis` | 20 |
| `rag-retrieval` | 22 |
| `agents` | 20 |
| `multi-agent-mcp` | 19 |
| `memory-knowledge` | 19 |
| `evals-observability` | 22 |
| `safety-security` | 20 |
| `production` | 38 |
| `frontier-capstone` | 24 |
| **TOTAL** | **228** |

### Complete Node ID List (228 nodes, in curriculum.json order)
```
map-of-ai, how-machines-learn, what-is-a-language-model, tokens, embeddings-intuition,
attention-transformers, training-pipeline, context-windows, sampling-controls, hallucination,
model-landscape, classical-ml-fundamentals, nlp-transformer-lineage, python-environments,
python-data-shapes, python-classes-modules, python-async, python-typing-pydantic, git-mastery,
terminal-fluency, python-craft-professional, build-token-cost-calculator, synthesis-foundations,
capstone-foundations,
first-api-call, roles-and-system-prompts, prompt-skeleton, few-shot-prompting, reasoning-prompts,
structured-output, tool-calling, streaming-responses, errors-retries-backoff, rate-limits-caching,
build-gateway, injection-first-look, multimodal-input, voice-audio-apis, long-context-strategies,
prompt-quality, build-cli-chatbot, build-feynman-bot, synthesis-apis, capstone-apis,
why-rag, embeddings-hands-on, chunking, vector-databases, build-first-rag,
keyword-fulltext-search, build-hybrid-search, build-vector-db-benchmark, reranking,
citations-grounding, rag-failure-modes, metadata-filters, query-rewriting-hyde,
multi-hop-retrieval, ingestion-pipelines, rag-evals-intro, build-chat-with-my-brain,
evaluate-brain-chat, graphrag-preview, semantic-caching, synthesis-rag, capstone-rag,
what-makes-an-agent, react-by-hand, designing-tools, build-agent-from-scratch, langgraph-state,
langgraph-checkpointers, hitl-interrupts, plan-and-execute, reflection-patterns, subgraphs,
build-supervisor, build-specialists, scratchpads-working-memory, build-research-agent,
add-the-gate, agent-failure-modes, cost-latency-budgets, build-node-proposer, synthesis-agents,
capstone-agents,
when-many-beats-one, orchestrator-worker, handoffs-routing, shared-state-patterns, parallel-agents,
debate-consensus, token-economics-of-teams, mcp-fundamentals, build-mcp-server, build-mcp-bridge,
mcp-clients, mcp-resources-prompts, mcp-security, protocol-landscape, build-writer-critic,
build-brain-mcp-server, experiment-one-vs-many, synthesis-multi-agent, capstone-multi-agent,
build-memory-taxonomy, memory-architectures, memory-extraction, retrieval-and-decay,
memory-frameworks, compaction-summarization, personalization-via-memory, privacy-in-memory,
knowledge-graphs-101, entity-extraction, graphrag-deep, temporal-knowledge,
brain-as-knowledge-graph, build-memory-layer, build-link-suggester-v2, build-brain-reviewer,
build-learning-recall-agent, synthesis-memory, capstone-memory,
why-evals-rule, build-golden-dataset, build-eval-judge, judge-bias-pinning, trajectory-evals,
tool-use-metrics, eval-frameworks-hands-on, prompt-regression-tests, ci-gates-for-ai,
build-experiment-tracker, data-versioning-reproducibility, model-serving-patterns,
build-tracing-instrumentation, reading-traces, online-evals, ab-testing-prompts,
cost-latency-dashboards, build-eval-harness, failure-to-golden-loop, error-analysis-practice,
synthesis-evals, capstone-evals,
agent-threat-model, direct-injection, build-overlap-scanner, jailbreaks-redteaming,
supply-chain-risks, spotlighting-delimiters, lethal-trifecta, least-privilege-tools,
build-proposal-gate, build-idempotency-audit, guardrails-in-out, pii-redaction,
refusals-content-safety, sandboxing-isolation, build-redteam-my-agent, fix-what-broke,
build-injection-suite, responsible-shipping, synthesis-safety, capstone-safety,
build-fastapi-backend, sse-streaming, build-briefing-scheduler, build-migration-runner,
docker-for-ai, deploying-backends, google-oauth-flow, gmail-calendar-read, supabase-deep-dive,
realtime-subscriptions, build-command-center, caching-layers, build-poller-engine,
webhooks-telegram, monitoring-alerting, build-demo-mode, cloud-fundamentals, compute-choices,
build-container-deployment, kubernetes-essentials, cicd-fundamentals, build-github-actions-pipeline,
secrets-cost-engineering, static-sites-cdns, multi-tenancy-design, build-async-workers,
rate-limiting-logs, observability-slos, authn-vs-authz, build-load-testing, caching-layer-depth,
failure-drills-rollbacks, compliance-responsible-ai, resurrection, the-bridge, hardening-pass,
synthesis-production, capstone-production,
local-models, small-distilled-models, voice-agents, computer-use-agents, coding-agents,
agentic-rag-frontiers, reasoning-test-time-compute, protocol-futures, reading-papers-forever,
prompt-vs-rag-vs-tune, lora-qlora-concepts, build-qlora-finetune, preference-tuning-distillation,
define-vizier-v2, build-vizier-v2-core, vizier-v2-memory-retrieval, vizier-v2-gate-safety,
vizier-v2-evals-traces, vizier-v2-redteam-ship, the-full-story, the-demo-film,
portfolio-integration, retrospective, graduation
```

---

## B. BUILD PIPELINE (end-to-end)

```
AUTHOR INPUT
    │
    ▼
curriculum/VIZIER_MASTERY_GRAPH.md        ← human-edited source of all node definitions
    │
    │  npm run build-brain
    │  → node tools/site-build/build.js
    │      └─ requires tools/site-build/compile-curriculum.js
    │
    ▼
compile-curriculum.js: compileCurriculum()
    │
    ├─ parseMasteryGraph() reads VIZIER_MASTERY_GRAPH.md
    │    Parses: domain headings, cluster headings, node lines matching pattern:
    │    `- <id> — <title> (<type> · <size>): <summary>`
    │
    ├─ For each node, looks for a note file at:
    │    brain/knowledge/<domain>/<id>.md    (primary)
    │    notes/<id>.md                       (fallback)
    │
    ├─ If note found:
    │    • parseFrontmatter() → extracts started, completed, status, confidence, modified
    │    • parseStatusLog() → fallback date extraction from ## Status log section
    │    • sanitizeContent() → blocks private-flagged or secret-leaking files
    │    • extractWikiLinks() → collects [[wikilink]] targets
    │    • Resolved status: if completed → 'lit'; else → 'charging'
    │
    ├─ If note NOT found: status = 'ghost'
    │
    ├─ Lock system: curriculum/.locked/<id>.json
    │    • When a node hits 'lit', a lock file is written with {id, title, domain, type, size, status, locked_at}
    │    • On subsequent builds, lock file is verified — any metadata change causes process.exit(1)
    │
    ├─ Programmatic edges:
    │    • Sequential within each cluster (compile-curriculum.js:413–421)
    │    • Capstone of domain N → first node of domain N+1 (lines 424–441)
    │    • Cross-domain links from ## CROSS-DOMAIN LINKS section of mastery graph (lines 443–460)
    │    • Wiki-link edges added for any [[id]] found in note content
    │
    ├─ Writes curriculum/curriculum.json (full node list + metadata + milestones)
    ├─ Writes site/brain-index.public.json (D3 graph: nodes + edges + metadata)
    └─ Writes site/brain-index.preview.json (identical copy of public for VISION mode)
    │
    └─ build.js: buildSite()
         ├─ Writes site/assets/style.css
         ├─ For each exported note file:
         │    • Writes site/notes/<id>.md    (sanitized raw markdown, frontmatter stripped)
         │    • Converts markdown to HTML via simpleMarkdownToHtml()
         │    └─ Writes site/notes/<id>.html (full wrapped page)
         └─ Done
```

**Key script locations:**
| Script | Path | Role |
|---|---|---|
| Main build entry | `tools/site-build/build.js` | Orchestrates everything |
| Curriculum compiler | `tools/site-build/compile-curriculum.js` | Parses mastery graph → JSON |
| HTML/CSS writer | `tools/site-build/build.js:buildSite()` | Produces static site pages |
| Next-node helper | `tools/next-node.js` | Suggests next node to study |
| Finish-node helper | `tools/finish-node.js` | Marks a node complete |

**What the page consumes at runtime:**
- `site/brain-index.public.json` — loaded via `fetch()` in live mode
- `site/brain-index.preview.json` — loaded via `fetch()` in vision/preview mode
- `site/notes/<id>.md` — fetched on demand by the inspector panel
- `site/notes/<id>.html` — navigated to via "View Note" button in inspector

---

## C. NODE VISUAL STATE DETERMINATION

Node state (dark/ghost/lit/charging) flows through the following path:

### 1. State Resolution (compile-curriculum.js)
**File:** `tools/site-build/compile-curriculum.js` · **Lines 280–338**

```
note file found?
    NO  → resolvedStatus = 'ghost'
    YES →
        fm.status === 'learned' OR node.completed → resolvedStatus = 'lit'
        else                                      → resolvedStatus = 'charging'
```

Note the terminology mapping:
| Your term | Code term | Meaning |
|---|---|---|
| `dark` | `ghost` | No note file exists for this node |
| `charging` | `charging` | Note file exists but not yet completed |
| `lit` | `lit` | Note has a `completed` date or `status: learned` frontmatter |

The resolved status is written into `curriculum.json` per node (field: `"status"`) and propagated into `brain-index.public.json` / `brain-index.preview.json` (field: `nodes[].status`).

### 2. CSS Visual Rendering (site/index.html)
**File:** `site/index.html`

**Node class assignment (line 1461):**
```js
return `node ${d.type} ${d.status || 'ghost'} ${isTouchedToday ? 'touched-today' : ''}`;
```
The `status` value becomes a CSS class directly.

**Visual rules by state:**

| State | Live mode (`.live-mode`) | Vision mode (`.vision-mode`) | Animation |
|---|---|---|---|
| `ghost` | opacity 0.12, faint stroke | opacity 0.65, soft stroke | none |
| `charging` | opacity 0.65 | opacity 0.85 | `heartbeat` pulse (2.5s ease-in-out) |
| `lit` | opacity 1.0 | opacity 1.0 | white stroke + domain-color glow drop-shadow |

**CSS locations:**
- `.live-mode .node.ghost` — **line 397–398**
- `.live-mode .node.charging` — **line 399**
- `.live-mode .node.lit` — **line 400**
- `.vision-mode .node.ghost` — **line 403–404**
- `.vision-mode .node.charging` — **line 405**
- `.vision-mode .node.lit` — **line 406**
- `.node.charging` heartbeat animation — **lines 409–415**
- `.node.lit` stroke/glow rules — **lines 416–420**

**Node fill color (`nodeColor` function, line 1071–1076):**
```js
function nodeColor(d) {
  if (d.type === 'center')    return '#3ee2e2';
  if (d.type === 'domain')    return domainColors[d.domain] || '#2a7f7f';
  if (d.type === 'milestone') return '#f687b3';
  return domainColors[d.domain] || '#94a3b8';
}
```
Color is determined by **domain**, not by status. Status controls opacity and animation.

**Edge state (lines 1403–1415):**
- Both endpoints `lit` → `.lit-lit` class (bright teal, animated pulse)
- Either endpoint `ghost` → `.ghost-edge` class (0.5px, nearly invisible)
- Otherwise → default `.link` (faint teal)

---

## D. NODE INSPECTOR / PANEL

### Where it opens
**File:** `site/index.html`  
**DOM element:** `<div id="insp">` — a right-side slide-in panel (CSS: `top: 16px; right: 16px; width: 380px`)

### Trigger
Every node `g.node` element has `.on('click', onNodeClick)` registered at **line 1466**.

`onNodeClick(event, d)` at **line 1963**:
1. Calls `openInspector(d)` (**line 1966**)
2. Flies the camera to the node via D3 zoom transform (**lines 1975–1978**)
3. Adds `.pulsing` CSS class to clicked node

### What `openInspector(d)` does (lines 2012–2128)
1. Sets `#node-title` to `d.label`
2. Renders metadata chips (domain, cluster, type, size, status) into `#node-meta`
3. Renders detail grid (ID, ring, connections, started, completed, tags) into `#node-details`
4. Renders prerequisites list (clickable nav buttons) into `#node-reqs`
5. Renders backlinks list into `#node-backlinks`
6. **Fetches note content:** `fetch(\`notes/${d.slug || d.id}.md\`)` → strips frontmatter → `marked.parse(cleanMd)` → injects into `#node-preview` (**lines 2105–2126**)
7. Adds `.open` class to `#insp` (slides panel in via CSS transform)

### How to inject content into the panel
The inspector reads `site/notes/<id>.md`. To inject content:
1. Write a note at `brain/knowledge/<domain>/<id>.md`
2. Run `npm run build-brain`
3. The build copies the sanitized, frontmatter-stripped markdown to `site/notes/<id>.md`
4. On next panel open, `fetch()` loads it and `marked.parse()` renders it as HTML into `#node-preview`

**Action buttons in panel:**
- `#btn-view` — opens `notes/<id>.html` in a new tab (**line 2156**)
- `#btn-copy` — copies a deep-link URL with `?node=<id>` (**line 2133**)
- `#btn-close` — calls `closeInspector()` (**line 2131**)

---

## E. FRONTMATTER SCHEMA (definitive spec)

Every note file at `brain/knowledge/<domain>/<id>.md` **MUST** carry this exact frontmatter block. This is the single authoritative spec. Do not deviate.

```yaml
---
id: <string>              # MUST equal the filename (without .md) AND the curriculum id
title: <string>           # Human-readable title, copied verbatim from curriculum.json
domain: <string>          # One of the 10 domain slugs (see list below)
ring: <number>            # Domain ring number: foundations=1 … frontier-capstone=10
type: concept | build     # Exactly one of these two; see Note on Types below
size: S | M | L           # From curriculum.json; drives XP: S=10, M=25, L=50
status: dark | charging | lit
                          # dark     = note is a stub / completely untouched
                          # charging = notes pasted in but not yet mastered
                          # lit      = mastered and LOCKED (cannot be downgraded)
version: <semver>         # Starts 0.1.0; bump MINOR on content updates, MAJOR on full rewrites
created: <ISO date>       # YYYY-MM-DD, date the note file was first created
updated: <ISO date>       # YYYY-MM-DD, date of last content edit
lit_date: <ISO date> | null
                          # Date status was set to lit; null until that happens
revisions: <integer>      # Count of deliberate revision passes; starts 0
artifact: <relative path> | null
                          # For build nodes: relative path into vizier-floor/ for the artifact
                          # e.g. vizier-floor/build-token-cost-calculator/calculator.py
                          # null for concept nodes
wikilinks: [<node-id>, …] # Array of node ids this note links to with [[wikilink]] syntax
tags: [<string>, …]       # Free-form topic tags (e.g. [python, fundamentals, llm])
---
```

### Domain slugs and ring numbers
| Ring | Domain slug |
|---|---|
| 1 | `foundations` |
| 2 | `prompting-apis` |
| 3 | `rag-retrieval` |
| 4 | `agents` |
| 5 | `multi-agent-mcp` |
| 6 | `memory-knowledge` |
| 7 | `evals-observability` |
| 8 | `safety-security` |
| 9 | `production` |
| 10 | `frontier-capstone` |

### Note on Types
The curriculum uses 5 node types: `concept`, `build`, `synthesis`, `capstone`, `frontier`. The frontmatter spec reduces this to **two author-facing types**: `concept` (for concept, synthesis, frontier, and capstone nodes) or `build` (for build nodes). The `type` field in the frontmatter is for the author's note classification. The curriculum `type` is preserved in `curriculum.json` separately and drives D3 shape rendering.

### Status lifecycle
```
dark → charging → lit
         ↑           ↓ (LOCKED — process.exit(1) if reversed)
         └───────────  (no going back once lit)
```
The compile step enforces this via the lock files at `curriculum/.locked/<id>.json`.

### Full example (map-of-ai)
```yaml
---
id: map-of-ai
title: The Map of AI
domain: foundations
ring: 1
type: concept
size: S
status: charging
version: 0.1.0
created: 2026-07-14
updated: 2026-07-20
lit_date: null
revisions: 0
artifact: null
wikilinks: []
tags: [ai, ml, foundations, overview]
---
```

---

## F. RISKS AND MISMATCHES

### F.1 — No Duplicate IDs Found ✅
Validation confirmed: all 228 node IDs are unique in `curriculum.json` at the `pre-ignition` tag.

### F.2 — No Illegal Filename Characters Found ✅
All 228 IDs use only `[a-zA-Z0-9\-]` characters. All IDs are valid as filesystem filenames on both Windows and Linux.

### F.3 — No Nodes Missing Domains Found ✅
All 228 nodes have a non-empty `domain` field.

### F.4 — `type` field mismatch between curriculum and proposed frontmatter schema ⚠️
The curriculum uses 5 distinct node types: `concept` (108), `build` (93), `synthesis` (11), `capstone` (11), `frontier` (5). The frontmatter spec in Section E uses only `concept | build`. If we ever want to query notes by exact node type, we need to either: (a) extend the frontmatter `type` field to include all 5 values, or (b) add a separate `curriculum_type` field. **Decision required before first note is written.**

### F.5 — `production` domain is disproportionately large ⚠️
`production` contains **38 nodes** — 67% more than the next largest domain (foundations=24, frontier-capstone=24). This means `production` will dominate the ring visually and take the longest to light. Not a bug, but a planning risk.

### F.6 — Two nodes with emoji in titles (not in IDs) ℹ️
`capstone-foundations` → "🏁 Capstone: Foundations"  
`capstone-apis` → "🏁 Capstone: APIs"  
(and similarly all capstones, `graduation` → "🏆 GRADUATION", `resurrection`, `the-bridge`). The **IDs** are clean; the **titles** contain emoji. This is fine for display but the `title` frontmatter field must carry the emoji to match `curriculum.json`.

### F.7 — `brain/knowledge/` directory structure must match domain slugs exactly ⚠️
The compiler looks for notes at `brain/knowledge/<domain>/<id>.md`. The domain slug used in the directory path MUST be identical to `node.domain` in `curriculum.json`. If a note is placed at the wrong path (e.g. `brain/knowledge/foundations/map-of-ai.md` → correct; `brain/knowledge/Foundations/map-of-ai.md` → NOT found on case-sensitive Linux/Vercel). The fallback path (`notes/<id>.md`) exists but is deprecated — do not use it for new notes.

### F.8 — `status` field in frontmatter vs. curriculum.json status ⚠️
The compiler (`compile-curriculum.js` line 309) resolves status from the **note's `completed` date or `status: learned` frontmatter key** — it does NOT read a `status:` key from frontmatter directly (except the literal string `'learned'`). The Section E schema uses `dark | charging | lit` as `status` values. The compiler currently interprets `status: learned` as "lit". To use `status: lit` in frontmatter and have it recognized, the compiler needs a one-line patch: add `|| fm.status === 'lit'` to the condition at line 309. **This patch must be applied before first note activation.**

### F.9 — `version`, `revisions`, `lit_date`, `artifact`, `wikilinks`, `tags` are NOT read by the compiler ℹ️
The current compiler reads: `started`, `completed`, `finished`, `status`, `confidence`, `modified`. All other frontmatter fields proposed in Section E (`version`, `revisions`, `lit_date`, `artifact`, `wikilinks`, `tags`) are for the author's own tracking and future tooling. They are **not currently consumed** by the build pipeline or displayed in the inspector. The `wikilinks` field in frontmatter is separate from inline `[[wikilink]]` syntax — the compiler parses inline syntax for backlink wiring, not the frontmatter array.

### F.10 — `map-of-ai` already has `status: charging` in curriculum.json ℹ️
This node has `"started": "2026-07-14"` and `"status": "charging"` in `curriculum.json` at `pre-ignition`. A note file at `brain/knowledge/foundations/map-of-ai.md` was presumably created at that time (or the build was run with it). If the note file no longer exists, the next build will reset it to `ghost`. Verify note file existence before first ignition build.

---

## G. SESSION REPORT

| Item | Value |
|---|---|
| **Session type** | Read-only analysis + safety actions |
| **Safety action 1** | ✅ Annotated tag `pre-ignition` created on commit `3e6c5dc` (branch `brain-only`) |
| **Safety action 2** | ✅ Working branch `ignition` created from `pre-ignition` |
| **Files changed** | 1 (this file: `IGNITION_CONTRACT.md`) |
| **BUILD line** | N/A — `npm run build-brain` was NOT run this session |
| **VALIDATION — ID uniqueness** | ✅ PASS — 228 node IDs, 0 duplicates, 0 illegal characters, 0 missing domains |
| **Authored** | 2026-07-20T11:55 IST |
