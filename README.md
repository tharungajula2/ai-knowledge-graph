# VIZIER — AI Engineering Learning Graph

VIZIER is a personal learning system for studying AI engineering through a structured, evolving curriculum. It turns Markdown study notes and a 228-entry syllabus into a browsable knowledge map, searchable chapter library, and in-page note reader.

The repository name is `ai-knowledge-graph`; the implementation calls the project **VIZIER**. Its main deliverable is a static browser application backed by generated JSON and HTML. The curriculum covers foundations, APIs, retrieval, agents, multi-agent systems, memory, evaluation, safety, production, and frontier topics.

## Explore

- [Technical and product blueprint](PROJECT_BLUEPRINT.md) — architecture, data flow, authoring tools, setup, caveats, and source map.
- [Curriculum source](curriculum/VIZIER_MASTERY_GRAPH.md) · [Markdown notes](notes/) · [Static application](site/index.html)
- [Generated graph index](site/brain-index.public.json) · [Build pipeline](tools/site-build/compile-curriculum.js)

## What is implemented

- A D3-powered graph with concentric curriculum rings and a force-directed view, zoom, pan, labels, search, and node inspection.
- A curriculum library with status, domain, type, ring, and size filters, plus sorting and a “continue” chapter affordance.
- Static note pages and an in-app reader with cross-note navigation, backlinks, code presentation, and deep links.
- A Node.js compiler that parses the curriculum and note frontmatter, resolves `[[wikilinks]]`, builds node/edge metadata, emits JSON indexes, and generates note pages.
- A note validator with curriculum-to-note checks, metadata checks, privacy-pattern scanning, and a minimum-content check for notes marked `lit`.

The checked-in index reports 228 curriculum entries, 1,515 edges, zero entries marked `lit`, and all 228 marked `charging`. These are snapshot values in the committed generated data, not a claim that every planned exercise has been completed. Read [the implementation and maturity notes](PROJECT_BLUEPRINT.md#current-state-and-maturity) before interpreting the status UI.

## Run locally

Requires Node.js. The project declares no npm dependencies. From the repository root:

```bash
npm run validate-notes
npm run build-brain
npm run serve
```

Then open `http://localhost:8080`. The serve script uses `npx http-server`, which may fetch the utility if it is not already cached. The app loads D3.js and Marked from CDNs, so a network connection is needed for those libraries. See [setup and troubleshooting](PROJECT_BLUEPRINT.md#setup-and-troubleshooting).

## Maturity

This is a substantial curriculum and a working static-site implementation, with supporting authoring and indexing scripts. It is best understood as a personal learning tool and portfolio prototype rather than a production learning platform: progress in the browser is derived from generated note metadata, there is no account or database-backed sync, and the curriculum snapshot currently has no `lit` nodes. Some adjacent `brain/` utilities describe a broader personal assistant and integrations, but they are separate from the static curriculum UI.

## Technology

| Area | Implementation |
|---|---|
| Browser UI | HTML, CSS, vanilla JavaScript |
| Graph and simulation | D3.js v7, loaded from CDN |
| Note compilation | Custom Node.js scripts and Markdown transforms |
| Content and syllabus | Markdown with YAML-like frontmatter; curriculum source parsed by project code |
| Generated artifacts | Static HTML and JSON under `site/` |
| Hosting configuration | Vercel output directory set to `site/` |

See [PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md) for the data model, algorithms, security boundaries, and verified limitations.

---

*This README describes the checked-in source and generated snapshot. It does not claim that a live deployment was verified.*
