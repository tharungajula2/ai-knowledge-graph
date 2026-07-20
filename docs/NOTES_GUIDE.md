# How I Light a Node — The Vizier Paste Ritual

> **The 1-to-1 Note System:** Every curriculum node maps directly to a markdown file at `notes/<node-id>.md`.
> **Goal:** Transition nodes from **dark** (planned) → **charging** (pasted/in-progress) → **lit** (mastered & locked).

---

## ⚡ The 5-Step Paste Ritual

Follow these steps whenever you study a topic, draft a note, or complete a build project:

### 1. Open Note File
Locate the note file corresponding to your node ID at `notes/<node-id>.md` (e.g. `notes/attention-transformers.md`).

### 2. Paste Note Content
Paste your masterclass notes or project documentation **below** the paste marker line:
```markdown
<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE. Then set status to charging (pasted) or lit (mastered), bump version, update the updated date. -->
```
*Note: Write complete, Markdown-formatted content including headings, code snippets, blockquotes, tables, and `[[wikilinks]]` to related nodes.*

### 3. Update Frontmatter Metadata
Update the YAML frontmatter block at the top of `notes/<node-id>.md`:
- Set `status:` to `charging` (content pasted, in progress) or `lit` (topic mastered).
- Set `updated: YYYY-MM-DD` (today's date).
- Set `completed: YYYY-MM-DD` and `lit_date: YYYY-MM-DD` if status is `lit`.
- Bump `version:` (e.g. `0.1.0` → `0.2.0` for charging, `1.0.0` for lit).
- Increment `revisions:` count (manually bump `revisions: N` whenever you re-read or refine a note).
- For build nodes, populate `artifact:` relative file path (e.g., `vizier-floor/<node-id>/index.js`).

### 4. Run Build & Validate
Execute the build pipeline locally:
```bash
npm run build-brain
```
The build pipeline automatically invokes `tools/validate-notes.js` and `tools/site-build/compile-curriculum.js`, validating:
- 1-to-1 mapping with `curriculum.json`
- Valid YYYY-MM-DD dates & semver format
- **Empty-Lit Guard**: Fails immediately if any note marked `status: lit` lacks substantive body content (at least 3 lines of 20+ chars).

### 5. Verify & Commit
- Verify node status update on the D3 graph visualizer or Library View.
- Commit and push your changes:
```bash
git add .
git commit -m "learn(<domain>): light <node-id>"
git push origin main
```

---

## 📋 YAML Frontmatter Reference Schema

```yaml
---
id: attention-transformers
title: "Attention & Transformers"
domain: foundations
ring: 1
type: concept
size: M
status: lit
version: 1.0.0
created: 2026-07-20
updated: 2026-07-20
completed: 2026-07-20
lit_date: 2026-07-20
revisions: 1
artifact: null
wikilinks: [tokens, embeddings-intuition, nlp-transformer-lineage]
tags: [foundations, attention, transformer, deep-learning]
---
```

---

## 🔒 Status Lifecycle & Guard Rail Rules

1. 🌑 **DARK (`status: dark`)**: Ghost appearance on graph/library. Placeholder shell with paste marker.
2. ⚡ **CHARGING (`status: charging`)**: Content pasted. Pulsing highlight on graph & library row. Signals active learning.
3. 🔥 **LIT (`status: lit`)**: Node mastered. Full domain neon glow, increments global XP & level bar, locks node metadata snapshot in `curriculum/.locked/`.
4. 🚨 **EMPTY-LIT GUARD RAIL**: Setting `status: lit` without at least 3 substantive lines of body content (20+ chars each) causes `validate-notes.js` to exit with error code 1. An unearned lit node is impossible.
