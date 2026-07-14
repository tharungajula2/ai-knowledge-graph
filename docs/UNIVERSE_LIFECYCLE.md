# VIZIER Universe Lifecycle Runbook

This document defines the lifecycle states and transitions of a learning universe, along with the archival process when moving to a new universe.

---

## 1. Lifecycle States

A learning universe exists in one of two states:

1. **ACTIVE**: The universe is currently being explored.
   - The user charges and lights nodes in the active universe.
   - Static builds automatically calculate node counts, completed dates, and update stats.
   
2. **COMPLETE**: Triggered automatically when all planned nodes are lit (`lit_count === node_count`).
   - The build system automatically flags the universe status as `"complete"` and sets the completion date to the date of the last lit node.
   - Once complete, the universe is frozen, ready for archival.

---

## 2. Archival & Transition (new-universe tool)

When transition to a new universe is desired:
```bash
npm run new-universe
```

This interactive tool performs the following steps:
1. Prompts for the next universe codename (e.g., `AGENTS`, `ROBOTICS`) and the next curriculum markdown file path.
2. Checks if the active universe is complete (all 200 nodes lit).
   - If not complete, it refuses to run unless the `--abandon` flag is passed.
   - If `--abandon` is passed, the status of the abandoned universe is marked as `ABANDONED` in `UNIVERSES.md` with an honest record.
3. Archival Routine:
   - Creates a read-only directory `universes/universe-<number>/`.
   - Moves the active universe's notes (`brain/knowledge/` subfolders), `curriculum/curriculum.json`, `curriculum/.locked/` snapshots, and `curriculum/CHANGELOG.md` into the archive folder.
   - These archived universes remain permanently browsable and read-only.
4. Initialization Routine:
   - Registers the next universe in `curriculum/UNIVERSES.md`.
   - Creates a fresh `curriculum/curriculum.json` initialized with Universe N+1, status `"active"`, and zero lit nodes.
   - Creates a fresh empty `curriculum/CHANGELOG.md`.
