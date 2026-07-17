# Vizier Notes System & Build Pipeline Guide

This guide explains how to write and manage curriculum notes, how the automatic status engine updates the learning graph, and how to use the built-in terminal helpers.

---

## 1. Directory Structure

Notes are written in standard Markdown (`.md`) format. 
* **Primary Location**: `brain/knowledge/<domain>/<node-id>.md`
* **Fallback Location**: `notes/<node-id>.md` (supported at root)
* **Template**: A reference template is located at `notes/TEMPLATE.md` and `brain/knowledge/TEMPLATE.md`.

---

## 2. Note Template Structure

Every curriculum note must contain the following sections to maintain the rigor of the learning ledger:

```markdown
---
id: node-id
title: "Node Title"
domain: domain-name
cluster: "Cluster Name"
status: in-progress
started: YYYY-MM-DD
completed: null
plan_version: 1.0.0
tags: []
links: []
---

## ELI5
Explain like I'm 5 — no jargon allowed.

## The Real Explanation
Precise, with correct terminology introduced gently.

## Why It Matters
Where this appears in real systems and jobs.

## Hands-On
The exact exercise/build for this node, runnable by a beginner.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
5 self-test questions I must answer before marking learned.
1. Question 1
...

## Wikilinks
Connections to other nodes — these drive the graph edges.
Example: [[map-of-ai]]

## Status log
- Started: YYYY-MM-DD
- Finished: null
```

---

## 3. How Node Status Flips (The Life-Cycle States)

The build pipeline (`npm run build-brain`) scans your note files and computes the status of each node automatically:

| State | Visual | Condition |
| :--- | :--- | :--- |
| 👻 **Ghost** | Grey / Outlined | The note markdown file **does not exist** at any supported path. |
| ⚡ **Charging** | Pulsing Accent | The note markdown file **exists**, but has **no finished date** (Finished is `null` or missing, and frontmatter `completed` is null). |
| 🔥 **Lit** | Glowing Color | The note markdown file **exists** and has a **valid finished date** (e.g. `completed: YYYY-MM-DD` in frontmatter or `- Finished: YYYY-MM-DD` in the Status log). |

---

## 4. How Edges are Generated

Relationships (edges) between nodes on the interactive D3 graph are determined deterministically:
1. **Prerequisite Chains**: Within the same domain cluster, nodes automatically require their predecessor (e.g., node 2 requires node 1).
2. **Organic Wikilinks**: Using `[[node-slug]]` within the body of any note generates a bidirectional backlink and wires an edge on the graph automatically.

---

## 5. Built-in Workflow Commands

Vizier provides command-line scripts inside `package.json` to manage this workflow:

### A. Start a New Node
```bash
npm run next-node
```
* **What it does**: Scans the curriculum tree to find ghost nodes whose prerequisites are satisfied. It lets you select one, creates the note from the template with the current date, and opens it in your editor.

### B. Finish a Node
```bash
npm run finish-node <node-id>
```
* **What it does**: 
  1. Updates the frontmatter (`status: learned`, `completed: YYYY-MM-DD`).
  2. Updates the `## Status log` section in the markdown body (`- Finished: YYYY-MM-DD`).
  3. Recommends new wikilinks based on semantic analysis.
  4. Generates social content drafts for you in `posts/<node-id>/`.
  5. Rebuilds the static brain files.

### C. Build the Brain Manually
```bash
npm run build-brain
```
* **What it does**: Compiles the graph data into `site/brain-index.public.json` and updates the compiled HTML pages inside `site/notes/`.

---

## 6. Lifecycle Locking

To ensure the integrity of the learning ledger:
* Once a node is marked **Lit** (completed), the build script creates a lock snapshot in `curriculum/.locked/<node-id>.json`.
* **Important**: Lit nodes are immutable. If you attempt to modify their core metadata or downgrade them back to `charging`/`ghost`, the build pipeline will fail with a `LOCKED NODE VIOLATION` error.
