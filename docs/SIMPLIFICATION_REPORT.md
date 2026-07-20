# VIZIER Brain Simplification Report

This report summarizes the architectural refactoring to simplify the **VIZIER** repository. By isolating the public D3 visualizer and removing the experimental, offline backend agents (`agent-lab`), we have transitioned the repository into a sleek, fast, and secure single-page application (SPA) centered exclusively around the interactive knowledge brain.

---

## 1. Clean Preconditions Verified
Before making changes, the following checks were confirmed:
* The annotated git tag `pre-brain-simplification` was created at the parent commit, preserving the entire history of `agent-lab/` for future resurrection or study.
* A working branch `brain-only` was created, ensuring the main branch remains untouched and all simplification work is isolated.
* The expanded curriculum node graph (containing the upgraded 228 nodes across 10 domains with integrated AI engineering concepts) was successfully compiled.

---

## 2. Decommissioned / Removed Assets

The following files and folders have been completely removed from the working tree:

### A. The Agent-Lab Subsystem (`agent-lab/`)
* **`agent-lab/backend/`**: Decommissioned the FastAPI application, LangGraph supervisor, specialists subgraphs (`specialists.py`), proposal hitl systems (`proposer.py`), tools/mcp integrations (`mcp_client.py`), LLM gateways (`gateway.py`), and metadata sql migrations.
* **`agent-lab/web/`**: Removed the Next.js approvals cockpit, Supabase real-time clients, briefings viewer, and evaluation dashboards.

### B. Deprecated UI Pages (`site/`)
* **`site/index.html`**: The old generic landing/portfolio page.
* **`site/feed.html`**: The chronological notes feed page (now replaced by index search and visualization filters).
* **`site/about.html`**: The static text-heavy info page.
* **`site/capabilities.html`**: The experimental capabilities index.

### C. Deprecated Developer Tools (`tools/`)
* **`tools/weekly-selfreview.ps1`**: A PowerShell script that triggered the `backend/app/brain_review.py` AI-led review module (decommissioned with the agent-lab removal).

---

## 3. Retained & Optimized Assets

All critical components of the core learning compiler and visualizer were kept and optimized:

### A. Core Compiler Scripts (`tools/`)
* **`tools/site-build/build.js`**: Rebuilt to compile the curriculum index, render note markdowns, and ignore deleted routes. It no longer builds `feed.html` or `about.html`.
* **`tools/site-build/compile-curriculum.js`**: Reads and transforms the main markdown syllabus into JSON databases (`curriculum.json`, `brain-index.public.json`).
* **`tools/site-build/verify.js`**: Validates cross-references, link structures, and verifies security integrity.
* **`tools/site-build/scan-history.js`**: Scans commit history for accidentally staged mock keys or developer secrets.
* **`tools/day-close.js`**: Commits the daily work and pushes straight to remote. Upgraded to push directly to the `brain-only` branch instead of `main`.
* **`tools/frontier-scan.js`**: Connects to the Gemini client to run frontier technology updates against target ghost nodes.

### B. The Live Visualizer Engine (`site/`)
* **`site/assets/style.css`**: Holds all customized glassmorphism theme components, HSL gradients, and responsive layouts.
* **`site/index.html` (formerly `brain.html`)**: The primary D3 visualizer frontend. It has been moved to the root route (`/`) and stripped of old navigation links.
* **`site/brain-index.public.json`**: Serving as the unified offline graph data source.

---

## 4. Navigation & Routing Transition

The brain visualizer is now served directly at the root of the site, making it the primary interface:

| Previous URL | New URL | Action taken |
| :--- | :--- | :--- |
| `/site/brain.html` | `/site/index.html` | Renamed file to make it the default root document. |
| `/site/` | `/site/index.html` | Served automatically by Vercel / server root directory indexes. |
| `/brain` / `/brain.html` | `/` | Configured permanent 301 redirects in `vercel.json` to route legacy paths to the root. |
| Navigation Row | Removed | Staged nav links (Home, Feed, Capabilities, About) removed from the top navigation bar. |
| Note Page "Back" link | `/site/index.html` | The "Back to Brain" link in `tools/site-build/build.js` is corrected to point to `../index.html` instead of `../brain.html`. |

---

## 5. Deployment & Vercel Pipeline Verification

### A. Vercel Configuration (`vercel.json`)
The configuration at the repository root was cleaned to serve the static frontend with redirects and clean URLs:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build-brain",
  "outputDirectory": "site",
  "cleanUrls": true,
  "redirects": [
    {
      "source": "/brain",
      "destination": "/",
      "permanent": true
    },
    {
      "source": "/brain.html",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### B. Local Server Test & D3 Verification
We ran the local Python server (`python -m http.server 8000`) and validated rendering using an automated browser check:
1. Checked that `/site/index.html` successfully loaded the D3 galaxy visualizer.
2. Verified the concentric ring orbits (Foundations, Prompting APIs, RAG, Agents...) rendered with zero console errors.
3. Tested search indexing and clicked node details to verify they display correctly.
4. Clicked **View Note** to verify the note route matches `site/notes/<slug>.html` and the "Back to Brain" button safely returns to `site/index.html`.
5. Confirmed build command discrepancy is fixed (`docs/DEPLOYMENT.md` updated to reference `npm run build-brain` only).
