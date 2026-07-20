# Vizier Notes Guide & Paste Ritual

> **The 1-to-1 Note System:** Every curriculum node maps directly to a file at `notes/<node-id>.md`.

---

## The 5-Step Paste Ritual

When activating or updating a curriculum node:

1. **Open Note File**: Locate `notes/<node-id>.md` (e.g. `notes/tokens.md`).
2. **Paste Masterclass Note**: Paste your course note content **below** the comment marker:
   `<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE. ... -->`
3. **Set Status**: Update `status:` in YAML frontmatter to `charging` (pasted) or `lit` (mastered).
4. **Bump Metadata**:
   - Update `updated: YYYY-MM-DD` (today's date).
   - Bump `version:` (e.g., `0.1.0` → `0.2.0`).
   - If setting status to `lit`, fill `lit_date: YYYY-MM-DD`.
5. **Run Build**:
   ```bash
   npm run build-brain
   ```
   *Runs validation and re-compiles the static learning graph.*

---

## Frontmatter Schema Reference

```yaml
---
id: <node-id>
title: "<Node Title>"
domain: <domain-slug>
ring: <1-10>
type: concept | build
size: S | M | L
status: dark | charging | lit
version: 0.1.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
lit_date: YYYY-MM-DD | null
revisions: 0
artifact: vizier-floor/<node-id>/index.js | null
wikilinks: []
tags: [domain-name]
---
```

---

## Status Lifecycle Rules

- 👻 **Dark**: Placeholder note (`status: dark`). Faint node on graph.
- ⚡ **Charging**: Note content pasted (`status: charging`). Amber pulsing node.
- 🔥 **Lit**: Mastered (`status: lit`). Full glow, locked in curriculum, counts toward XP/streaks.
- 🚨 **Guardrail**: Marking `status: lit` without substantive content fails the build (`EMPTY LIT NODE`).
