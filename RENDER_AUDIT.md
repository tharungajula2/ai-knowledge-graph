# VIZIER Note Rendering Audit & Overhaul Plan

**Branch:** `notes-render-overhaul`  
**Date:** 2026-07-21  
**Repository:** `tharungajula2/vizier-ai`  

---

## 1. Executive Summary & Audit Scope

This document provides an exhaustive, line-by-line audit of how markdown notes are parsed, highlighted, and rendered across both the **VIZIER Brain App** (client-side interactive reader) and the **Static Site Generator** (build-time HTML generation).

---

## 2. Note Rendering Pipeline & Architecture

### 2.1 File Paths & Line Ranges

| Component | Target File | Key Function / Range | Responsibility |
|---|---|---|---|
| **Client Reader Engine** | `site/js/note-reader.js` | `openInspector(d)` (L124–298) | Fetches note `.md` file via HTTP, parses YAML frontmatter, converts `[[wikilinks]]`, and renders markdown into DOM `#node-preview`. |
| **Marked Renderer Config** | `site/js/note-reader.js` | `marked.setOptions()` (L66–108) | Configures custom `marked.Renderer` for GFM tables and syntax highlighting using Highlight.js. |
| **Brain HTML Container** | `site/index.html` | `#insp` (L251–276) | The slide-over dialog container for displaying the parsed note content inside the live knowledge graph. |
| **Static Site Generator** | `tools/site-build/build.js` | `simpleMarkdownToHtml()` (L42–218) | Build-time standalone HTML page compiler (`site/notes/{slug}.html`). |
| **Curriculum Compiler** | `tools/site-build/compile-curriculum.js` | `compileCurriculum()` (L287–854) | Scans `notes/` directory, validates frontmatter, calculates statuses (`ghost` / `charging` / `lit`), and enforces content presence. |

---

### 2.2 Libraries & Tools Used

* **Markdown Library:**
  * **Client App:** `marked` (Loaded via CDN `https://cdn.jsdelivr.net/npm/marked/marked.min.js` in `site/index.html` L34).
  * **Static Generator:** Custom regex-based parser `simpleMarkdownToHtml()` in `tools/site-build/build.js` (L42–218).
* **Syntax Highlighter:**
  * **Client App:** `Highlight.js` (Local build `site/assets/highlight.min.js` loaded in `site/index.html` L36).
  * **Static Generator:** Basic entity escaping (`&`, `<`, `>`) in `build.js` (L53–55); no client JS required on static pages.

---

### 2.3 Exact Order of Operations & Double-Processing Pinpoint

```
[ Raw Note Markdown ]
         │
         ▼
[ 1. Frontmatter Extraction ] ── Strips YAML header (site/js/note-reader.js L232-250)
         │
         ▼
[ 2. Wikilink Regex Pass ]    ── Replaces [[slug|label]] with <a class="wiki-link"...> (L268-274)
         │
         ▼
[ 3. Marked Engine Parse ]    ── Invokes marked.parse(cleanMd) (L283/285)
         │
         ├──► Custom Code Renderer (L73-105)
         │       │
         │       ├──► Highlight.js Tokenizer: window.hljs.highlight(rawCode, { language })
         │       │       Returns HTML strings containing <span class="hljs-...">
         │       │
         │       └──► Wraps in <div class="code-block-wrapper"><pre><code>...</code></pre></div>
         │
         └──► Custom Table Renderer (L69-71)
                 Wraps GFM tables in <div class="table-wrapper"><table class="md-table">
         │
         ▼
[ 4. DOM Insertion ]          ── Sets innerHTML of #node-preview container
```

#### 🔍 Double-Processing / Literal Escape Injection Pinpoint

Double-processing occurs when HTML entity escaping is executed **AFTER** HTML elements (such as Highlight.js `<span class="hljs-...">` tags or `<a class="wiki-link">` links) have already been synthesized:

1. **Static Build Pipeline Collision (`tools/site-build/build.js` L70–74):**
   * Lines 70–74 perform global document-wide entity escaping:
     ```javascript
     html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
     ```
   * Code blocks are extracted beforehand to `___CODE_BLOCK_${idx}___` (L50–66). However, if any HTML element (such as headers or blockquotes) is generated prior to step 70, or if code block placeholders are mangled, the `<` and `>` characters inside generated HTML are transformed into `&lt;` and `&gt;`.
   * When rendered by the browser, this displays raw unparsed markup like `class="hljs-string">` or `<span class="hljs-keyword">` directly on screen.

2. **Client Reader Escaping Misalignment (`site/js/note-reader.js` L92 & L268–274):**
   * Wikilinks are injected into `cleanMd` as raw HTML `<a class="wiki-link"...>` *before* calling `marked.parse(cleanMd)`. If Marked options or a downstream sanitizer processes raw HTML strings inside markdown blocks, entity double-escaping occurs.
   * In `markedRenderer.code` (L92), if `hljs` fails, `escapeHtml(rawCode)` is called. If `rawCode` was pre-escaped by a prior pass, characters like `&` become `&amp;amp;`.

---

## 3. Special-Block Conventions Audit

| Block Convention | Format in Notes | Currently Handled? | Current Implementation / Render Output | Recommended Overhaul / Handling |
|---|---|---|---|---|
| **Fenced Code** | ````python ... ```` | **YES** | Wrapped in `.code-block-wrapper`, highlighted via `Highlight.js`, equipped with copy button. | Retain; add language indicator badge. |
| **Task Lists** | `- [ ]` / `- [x]` | **YES** | Converted to `<li class="task-list-item">` with checkbox input. | Add interactive toggle state. |
| **Wiki-Links** | `[[note-slug\|Label]]` | **YES** | Transformed to `<a class="wiki-link" data-node-id="...">`. Opens note overlay on click. | Retain; add preview hover card. |
| **Section Challenged** | `## Where this could be wrong` | **YES** | Applied `.section-challenged` CSS class (orange left border in `build.js` L91–94). | Expand to client-side reader `note-reader.js`. |
| **`[OUTPUT]` Blocks** | `[OUTPUT]` | ❌ **NO** | Rendered as standard paragraph text or bold text `**[OUTPUT]**`. | Styled terminal output card with dark background & green text. |
| **`[MENTAL TRACE]`** | `[MENTAL TRACE]` | ❌ **NO** | Rendered as plain text paragraph without visual distinction. | Styled execution trace box with cyan border & debug icon. |
| **Terminal / Shell** | ````bash` / ````shell` | ❌ **NO** | Rendered as default generic code block without shell prompt or window header. | Styled macOS/Linux terminal block with `$ ` prompts. |
| **Error / Traceback** | Traceback (most recent call last) | ❌ **NO** | Rendered as plain code block without error highlights. | Red-tinted alert box with syntax-highlighted stack trace. |

---

## 4. Note Schema & Lifecycle Specification

### 4.1 Node Mapping & Directory Layout
Notes map to Mastery Graph nodes (`curriculum/VIZIER_MASTERY_GRAPH.md`) by matching the `id` field in frontmatter or the filename slug:
* **Canonical Path Pattern:** `notes/{domain_folder}/{chapter_code}-{slug}.md`  
  * *Example:* `notes/01-foundations/01-16-python-classes-modules.md` -> Node ID: `python-classes-modules`
* **Resolution Engine:** `tools/site-build/compile-curriculum.js` (L313–331) indexes all `.md` files in `notes/` by `fm.id` or basename (stripping leading `\d{2}-\d{2}-`).

---

### 4.2 Status Transition Rules (`ghost` → `charging` → `lit`)

The node status lifecycle is compiled in `compile-curriculum.js` (L366–384):

```
                       ┌─────────────────────────┐
                       │   No Note File Exists   │
                       │   OR Frontmatter: dark  │
                       └────────────┬────────────┘
                                    │
                                    ▼
                             STATUS: GHOST
                                    │
                  ┌─────────────────┴─────────────────┐
                  │ Note File Created & Has Content   │
                  └─────────────────┬─────────────────┘
                                    │
                                    ▼
                             STATUS: CHARGING
                                    │
                  ┌─────────────────┴─────────────────┐
                  │ Frontmatter: status: lit/learned   │
                  │  OR completed: YYYY-MM-DD set     │
                  │  AND hasNoteContent() >= 3 lines  │
                  └─────────────────┬─────────────────┘
                                    │
                                    ▼
                              STATUS: LIT
                       (Locked in .locked/{id}.json)
```

1. **`ghost` (Dark Node):** Default state when no `.md` note file exists in the filesystem, OR if frontmatter explicitly specifies `status: dark`.
2. **`charging` (In Progress):** Note file exists and contains content, but `completed` date is `null` and status is not `lit`.
3. **`lit` (Mastered & Verified):**
   * Triggers when `status: lit` / `status: learned` is present in frontmatter OR `completed: YYYY-MM-DD` date is set.
   * **Strict Verification Guard (`compile-curriculum.js` L398):** A node claiming `lit` status **MUST** have at least 3 substantive content lines (each >= 20 chars) below the frontmatter. If empty, the build process aborts with a fatal error.

---

### 4.3 Active Test Notes Directory

The repository currently contains 4 active authoring notes in `notes/01-foundations/`:

1. `notes/01-foundations/01-01-map-of-ai.md` (Status: `charging`, 2,881 bytes)
2. `notes/01-foundations/01-06-attention-transformers.md` (Status: `charging`, 3,084 bytes)
3. `notes/01-foundations/01-16-python-classes-modules.md` (Status: `charging`, 29,901 bytes — Comprehensive Masterclass)
4. `notes/01-foundations/01-17-python-async.md` (Status: `charging`, 27,170 bytes — Comprehensive Masterclass)

*(All remaining 20 files in `notes/01-foundations/` are 400–500 byte stub templates awaiting content).*

---

## 5. Styling, Typography & Layout Audit

### 5.1 Syntax Highlight CSS Location
* **CSS File Path:** `site/assets/highlight.min.css` (Loaded in `site/index.html` L35).
* **Code Block Custom Rules:** `site/css/styles.css` (L360–398) & `site/assets/style.css` (L346–398).

---

### 5.2 Typography & Spacing Values

#### Desktop Layout (`site/css/styles.css` L318–440)
* **Font Families:**
  * Body Text: `'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  * Code / Monospace: `'JetBrains Mono', monospace`
* **Inspector Panel Width:** `540px` (max-width `90vw`, height `100vh`)
* **Note Content Container (`.md`):** `max-width: 68ch; margin: 0 auto;`
* **Font Size & Line Height:**
  * Note Body (`.md`): `0.92rem` (14.72px), `line-height: 1.75` (25.76px)
  * Paragraph Spacing (`.md p`): `margin-bottom: 16px`
  * Code Block (`code`): `font-size: 0.84rem` (13.44px), `line-height: 1.6`
  * Inline Code (`.md :not(pre) > code`): `font-size: 0.82rem`, `padding: 2px 6px`
* **Heading Hierarchy:**
  * `h1`: `1.3rem` (20.8px), `font-weight: 600`, border-bottom `1px solid rgba(255,255,255,0.08)`
  * `h2`: `1.1rem` (17.6px), `font-weight: 600`
  * `h3`: `0.98rem` (15.68px), `font-weight: 600`
  * `h4`: `0.9rem` (14.4px), `font-weight: 600`

#### Mobile Layout (`site/css/styles.css` L299–307 & L762–790)
* **Inspector Panel Width:** `100vw`, `height: 100vh`, `padding: 16px 14px`
* **Note Body Font Size:** `0.9rem` (14.4px), `line-height: 1.7`
* **Code Block Wrapping:** `pre { overflow-x: auto !important; white-space: pre !important; }`

---

## 6. Recommendations & Overhaul Roadmap

1. **Unify Markdown Engines:** Migrate client reader and static builder to share a common rendering configuration to prevent double-escaping bugs.
2. **Implement Block Handlers:** Add custom render rules for `[OUTPUT]`, `[MENTAL TRACE]`, and shell tracebacks.
3. **Enhance Syntax Highlighting:** Ensure Highlight.js token spans are never entity-escaped after generation.

---
*Audit completed on branch `notes-render-overhaul`.*
