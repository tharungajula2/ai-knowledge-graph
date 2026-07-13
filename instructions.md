# VIZIER REBIRTH — Antigravity Prompt Pack v3 · FINAL (THE NODE BRAIN)

**Goal:** Transform the messy `vizier` folder into a clean, brain-first repo built on a
**node graph, not a day list** → push to `https://github.com/tharungajula2/vizier-ai.git`
(private) → deploy the brain publicly on Vercel.

**The v3 principle — NODES ≠ DAYS:**
- The **marathon is 250 days** — I show up daily, commit daily, the graph rebuilds daily.
- The **curriculum is a graph of NODES** — some take an hour, some take four days.
  Finishing two nodes in one day or one node in one week are both healthy.
- Three node states: **ghost** (planned) → **charging** (in progress, softly pulsing) →
  **lit** (completed, glowing). A charging node is proof of daily work even when nothing
  "finishes" that day — asymmetric progress, honestly displayed.
- Notes use **[[wikilinks]]**; every daily rebuild resolves them into graph edges and
  backlinks. The map literally rewires itself every day I write.
- The past (lit nodes) is immutable; the future (ghosts) is a versioned plan that evolves.

**How to use:** Paste **Prompt 0** first (it installs the Golden Rules for the whole
session). Then Prompts 1–8 in order, one at a time. Wait for each to finish, skim the
summary, paste the next. Steps only you can do are marked **🖐️ MANUAL**. Prompt 9 is a
pocket prompt for any day you're ready.

---

## PROMPT 0 — GOLDEN RULES + SECURITY SCRUB + FRESH GIT (⚠️ FIRST, NEVER SKIP)

```
You are restructuring my project. First, adopt these GOLDEN RULES for this entire session:

GOLDEN RULES (apply to every prompt I give you from now on):
1. PLAN FIRST. Before changing anything, show me a short plan and the list of files you
   will touch. Only proceed after showing the plan.
2. NEVER delete code. We move and reorganize; we do not destroy. If something must be
   removed, move it to `_graveyard/` instead.
3. NEVER commit secrets. No .env files, no API keys, no OAuth tokens, no token caches.
   (My old keys were rotated at the provider level, but treat every found secret as live.)
4. COMMIT AFTER EVERY PROMPT. End each task with: git add -A → conventional commit message
   ("chore(structure): ...", "feat(brain): ...") → push to origin main. Show the hash.
5. EXPLAIN LIKE I'M NEW. After each task, a 5-line plain-English summary of what changed
   and why.
6. NEVER modify anything inside `agent-lab/` after Prompt 1 creates it — UNLESS I
   explicitly say "unfreeze agent-lab". That phrase is the only key to that door.
7. IMMUTABLE PAST, FLUID FUTURE. Once a node is completed (a real note exists with
   status: learned), that node's id, title, and content are permanent. Only FUTURE
   (ghost) nodes may ever be replanned.

NOW — TASK 0: SECURITY SCRUB AND FRESH GIT HISTORY.
This folder was copied from another laptop. The GitHub repo is private, but private is
not a security strategy — we scrub as if it were public:

1. Search the ENTIRE project for secrets and sensitive files. At minimum find and list:
   - any .env, .env.local, .env.* files anywhere
   - backend/secrets/ contents (google_oauth_client.json, google_token.json, etc.)
   - any .cache/ directories with cached LLM responses
   - files containing patterns: "SUPABASE_SERVICE_ROLE", "sk-", "API_KEY=", "BOT_TOKEN",
     "postgresql://", "eyJ" (JWT prefix)
   Show me the full list of findings.
2. Move ALL secret files into a new root folder `_local-secrets/` (gitignored,
   machine-only). Replace originals with `.example` placeholders (dummy values) so code
   structure still reads correctly.
3. If a .git folder exists (old laptop history), DELETE it entirely — fresh history, so
   no old commit can ever leak anything.
4. Create a thorough root .gitignore: _local-secrets/, .env*, backend/secrets/*.json,
   .cache/, __pycache__/, node_modules/, .next/, .vercel/, *.log, .DS_Store.
5. git init on branch main.
6. FINAL VERIFICATION before first commit: re-scan STAGED files for the secret patterns
   and explicitly confirm ZERO secrets staged.
7. git add -A → commit "chore: initial import — vizier rebirth, secrets scrubbed" →
   add remote origin https://github.com/tharungajula2/vizier-ai.git → push -u origin main.
```

**🖐️ MANUAL (before Prompt 0):** be logged into GitHub as `tharungajula2` so the push
authenticates. **After Prompt 0:** open the repo on GitHub and personally verify no
secrets/env/cache files exist. Trust, then verify.

---

## PROMPT 1 — THE GREAT SEPARATION: FREEZE MACHINES 1 & 2 INTO `agent-lab/`

```
TASK: Restructure so the BRAIN is the main project and the agentic system is a frozen
learning lab with an unfreeze-anytime door. Golden Rules apply.

Target root structure:

vizier-ai/
├── README.md            # rewritten — see step 5
├── brain/               # my learning notes (markdown, one file per node) — the heart
├── curriculum/          # NEW — the living node-graph syllabus engine
├── site/                # the D3 brain visualizer — the public face, deploys to Vercel
├── tools/               # build scripts + daily/AI scripts
├── docs/                # specs, progress logs, runbooks — consolidated
├── posts/               # NEW — my LinkedIn content archive
├── agent-lab/           # the frozen machines
│   ├── README.md
│   ├── backend/         # Machine 1, moved UNTOUCHED
│   └── web/             # Machine 2, moved UNTOUCHED
└── _local-secrets/      # gitignored (from Prompt 0)

Steps:
1. Move backend/ → agent-lab/backend/ and web/ → agent-lab/web/ with NO code changes.
2. Write agent-lab/README.md: "This is VIZIER's agentic engine (supervisor + specialists,
   RAG, memory, HITL proposal gate, injection scanner, evals, observability), built
   agentically and FROZEN as a study artifact. The curriculum's 🔩 deep-dive nodes read
   these files, and the floating RESURRECTION milestone deploys them by hand — which may
   happen ANY time I choose ('unfreeze agent-lab'), early or late." Include a map of key
   files (supervisor.py, specialists.py, proposer.py, scanner.py, evals.py, gateway.py,
   retrieve.py, memory.py, main.py, scheduler.py) with one-line descriptions of each.
3. Move loose root files (PROGRESS.md, SHOWCASE_REPORT.md, old specs, daily.ps1, stray
   index.html/vercel.json from the old layout) into docs/ or their correct new home.
   Root must be CLEAN.
4. Fix paths broken by the moves (site-build scripts etc.). Verify the site still builds
   and renders locally.
5. Rewrite root README.md: "VIZIER — a living, self-evolving second brain: a knowledge
   graph of real learning nodes, grown daily across a 250-day marathon from zero to
   frontier-level AI engineering. Lit nodes are an immutable ledger of what I actually
   learned; ghost nodes are a versioned plan that evolves with the field. The frozen
   agent-lab is both destination and textbook." Include structure map + local quickstart.
6. Commit: "chore(structure): the great separation — brain-first, agent-lab frozen" + push.
```

---

## PROMPT 2 — RETHEME: FROM LIFE-OS TO AI MASTERY

```
TASK: The brain currently uses life-OS domains (gut, mind, nutrition...). VIZIER is now
exclusively about mastering AI engineering. Retheme WITHOUT changing the visual design I
love. Plan first, commit at the end.

1. Replace the domain taxonomy (taxonomy.yaml and anywhere domains are defined) with
   exactly these 10 domains, ring-ordered (innermost = foundations):
   01 foundations         — how AI & LLMs actually work
   02 prompting-apis      — prompting, LLM APIs, tool calling
   03 rag-retrieval       — embeddings, vector search, RAG
   04 agents              — ReAct, LangGraph, single-agent systems
   05 multi-agent-mcp     — orchestration, MCP, agent protocols
   06 memory-knowledge    — agent memory, knowledge graphs, GraphRAG
   07 evals-observability — golden datasets, LLM-as-judge, tracing
   08 safety-security     — prompt injection, guardrails, HITL
   09 production          — FastAPI, deployment, databases, ops
   10 frontier-capstone   — the moving edge: whatever is frontier WHEN I GET THERE
   These 10 domains are the PERMANENT SPINE — nodes inside them may change over time;
   the rings themselves never do.
2. Distinct color per domain from the existing palette family (keep the dark cyberpunk
   aesthetic — teal/cyan primary, warm accents). Update the legend.
3. Update all site copy (index, brain page, about/capabilities) to the new story:
   "VIZIER — a living map of one human mastering AI in public. Nodes light up as real
   learning happens. The past is permanent. The future evolves with the field."
   Remove all life-OS references from copy and demo content.
4. Migrate any existing real notes' frontmatter to the new domain slugs (closest match
   or 'foundations').
5. Header counters become TWO honest numbers: "⚡ X / Y NODES LIT" (Y = current plan's
   node count, dynamic) and "DAY N OF 250" (marathon day, computed from a start_date in
   config — set it to the date of my first real note, or today if none).
6. Verify build + render. Commit: "feat(brain): AI Mastery taxonomy — permanent
   10-domain spine, node+marathon counters" + push.
```

---

## PROMPT 3 — THE LIVING GRAPH ENGINE (nodes, wikilinks, immutable past)

```
TASK: Build the curriculum system as a VERSIONED, EVOLVING NODE GRAPH. Plan first,
commit at end.

1. Parse curriculum/VIZIER_MASTERY_GRAPH.md (I placed it there) into
   curriculum/curriculum.json:
   {
     "version": "1.0.0",
     "updated_at": "<iso>",
     "marathon": { "days": 250, "start_date": null },
     "nodes": [ { "id": "<stable-slug>", "title", "domain", "cluster",
                  "type": "concept|build|deep-dive|synthesis|capstone|frontier",
                  "size": "S|M|L",   // S ≈ ≤1 day, M ≈ 1–2 days, L ≈ 3+ days
                  "summary", "requires": [ids], "locked": false } ],
     "milestones": [ ...parse the FLOATING MILESTONES section: id, title, description,
                     related_domains, status: "floating" ]
   }
   Parse ALL nodes exactly as listed in the file, including the explicit cross-domain
   links section (fold those into `requires`/related edges).
2. curriculum/CHANGELOG.md — starts with "v1.0.0 — baseline graph (<node count> nodes)".
   Every future replan appends: version, date, what changed, WHY (my stated reason).
3. NODE LIFECYCLE (implement in the build system):
   - ghost: no note exists.
   - charging: a note exists with status: in-progress (I started it; it may span days).
   - lit: note has status: learned → the node becomes locked: true and a snapshot is
     written to curriculum/.locked/<id>.json. Any script altering a locked node must
     FAIL THE BUILD loudly. The past is immutable — a feature, not a bug.
4. WIKILINKS & BACKLINKS (the daily rewiring):
   - Notes may contain [[node-id]] or [[Node Title]] wikilinks in their body.
   - Every build resolves wikilinks → graph edges (merged with curriculum `requires`
     edges and frontmatter `links:`), deduplicated.
   - Every node's inspector gets a BACKLINKS section: "linked from: ..." computed at
     build time. The graph visibly rewires every day I write.
5. Edge generation is DETERMINISTIC (no randomness): curriculum requires-edges +
   cluster-sequence edges + capstone→cluster edges + explicit cross-domain edges +
   wikilink edges. Target 2–6 edges per node.
6. Rename data modes across UI + build:
   - PREVIEW → "VISION": the full current-plan graph, all nodes ghosted. Banner:
     "THE LIVING MAP — plan v<version> · <count> nodes. The past is locked. The future
     evolves."
   - LIVE: same layout; lit nodes glow, charging nodes softly pulse, future nodes stay
     faint ghosts — visitors watch one brain wire itself up in real time.
7. Node inspector: ghosts show title, domain, cluster, size, "PLANNED (plan v<ver>)";
   charging shows started date + "IN PROGRESS"; lit shows completed date, my summary,
   tags, backlinks, and a VIEW NOTE button. Floating milestones render as distinct
   hexagonal nodes orbiting outside the rings, with status.
8. Stats panel: "X / <count> lit · Z charging", marathon "DAY N OF 250", current +
   longest daily streak, plan version, nodes, edges.
9. Verify: build runs; VISION shows the full graph + milestone hexes in correct rings;
   LIVE reflects any existing real notes. Commit: "feat(graph): living node graph —
   wikilinks, backlinks, immutable lit nodes" + push.
```

**🖐️ MANUAL (before Prompt 3):** copy `VIZIER_MASTERY_GRAPH.md` into `curriculum/`.

---

## PROMPT 4 — DAILY ENGINE: NODE RITUAL, DEEP LINKS, STREAKS

```
TASK: Build the daily ritual machinery around NODES, not days. Plan first, commit at end.

1. tools/next-node.js (`npm run next-node`):
   - Shows my current charging node(s) if any, plus the 3 best next ghost candidates
     (requires-edges satisfied, cluster order respected). I pick one (or continue).
   - Creates/opens brain/notes/<node-id>.md with frontmatter: id, title, domain, cluster,
     status: in-progress, started: <date>, completed: null, plan_version, tags: [],
     links: [] — plus template sections: "What I learned", "Feynman explanation (to a
     12-year-old)", "What I built / tried", "Aha moment", "Frontier check (anything new
     in the field worth a replan?)", "Wikilinks I noticed" (encouraging [[...]] usage).
2. `npm run finish-node` — marks the open note status: learned + completed: <date>,
   then rebuilds. Multiple finishes in one day are normal; zero finishes is also normal.
3. `npm run build-brain` — full rebuild: rescan notes → lock lit nodes → resolve
   wikilinks/backlinks → regenerate graph → update counters/stats/marathon day.
4. `npm run day:close` — THE ONE COMMAND I RUN EVERY SINGLE DAY of the marathon, whether
   or not a node finished: build-brain → git add -A → commit
   ("learn(<node-id>): <title>" if a node was lit today, otherwise
   "progress(day-N): daily work on <charging-node-id>") → push. Daily streak = days with
   a day:close commit. This makes asymmetric progress honest: charging days still count.
5. Deep links: /brain?node=<id> opens with that node selected, inspector open, camera
   eased onto it; selecting a node updates the URL. Critical for LinkedIn sharing.
6. "TODAY" pulse animation on nodes touched today (lit or charging).
7. Verify end-to-end with a TEMPORARY placeholder note (charge it, light it, deep-link
   it), then delete the placeholder and rebuild (allowed exception — not real learning).
   Commit: "feat(daily): node ritual — next-node, finish-node, day:close, streaks" + push.
```

---

## PROMPT 5 — THE REPLAN ENGINE (the graph's self-evolution, human-approved)

```
TASK: Build the mechanism that lets the node graph evolve with the AI field and with my
pace — while lit nodes stay locked. Plan first, commit at the end.

1. tools/ai/ — a small Gemini client reading GEMINI_API_KEY from _local-secrets/.env
   (add _local-secrets/.env.example documenting it). All AI scripts run LOCALLY only —
   the deployed site stays fully static, zero keys in it.
2. `npm run replan` — interactive flow:
   a. Asks me: "What changed?" (free text — e.g., "I resurrected Machine 1 this
      weekend", "New model family launched, I want a cluster on it", "This cluster felt
      shallow — deepen it").
   b. Sends Gemini: my reason + the GHOST (unlocked) portion of curriculum.json + the
      floating milestones + lit-node titles for context only.
   c. Gemini returns a PROPOSED DIFF over ghost nodes only: add / remove / retitle /
      resize / re-cluster / re-wire requires-edges — and for milestone triggers (like
      early Resurrection), marks the milestone completed and repurposes its now-redundant
      study nodes into deeper or newer topics. Adding nodes is EXPECTED — the graph is
      allowed to grow; mastery is finishing a living graph, not a fixed count.
   d. Render the diff as a clear before/after table. NOTHING is applied until I approve
      (y/n per change or approve-all). This human gate is non-negotiable — state in a
      code comment that it mirrors VIZIER's HITL philosophy.
   e. On approval: bump version (minor for swaps, major for structural), update
      curriculum.json (and its node count everywhere it's displayed), append
      CHANGELOG.md with my reason, rebuild the graph.
   f. HARD GUARANTEE: refuse — loudly — any diff touching a locked node.
3. `npm run frontier-scan` — lighter cousin: Gemini (with search grounding if the API
   supports it, otherwise from model knowledge with a dated caveat) lists 3–5 recent
   developments relevant to my next ~10 ghost nodes, each with "worth a replan?
   y/n + why". Saved to docs/frontier-scans/<date>.md. I decide; nothing auto-changes.
4. `npm run suggest-links` — reads the note I just finished + the existing graph,
   proposes 3–7 edges with one-line reasons; interactive y/n approval; approved links
   written to note frontmatter (wikilinks I wrote by hand are already picked up by the
   build — this adds the ones I missed).
5. `npm run draft-post` — reads a finished node's note → posts/<node-id>/ with three
   drafts: (a) text-post.md: Feynman-style for non-technical readers, one everyday
   Indian-life analogy, 2-line hook, under 200 words, ends with the node's deep link;
   (b) carousel-outline.md: 6 slides, title + one line each; (c) video-script.md:
   45-second spoken script with caption cues. Tone: warm, zero unexplained jargon.
6. Wire suggest-links + draft-post into `npm run finish-node` (run automatically after
   a node lights up), keeping day:close as the separate daily wrap.
7. Verify all flows with dry runs (temporary artifacts removed after). Commit:
   "feat(evolve): replan engine + frontier scan + content engine (human-gated)" + push.
```

**🖐️ MANUAL (before Prompt 5):** create your NEW Gemini API key (the old ones were
deleted) and put it in `_local-secrets/.env` as `GEMINI_API_KEY=...`.

---

## PROMPT 6 — THE PREMIUM PASS: MAKE THE BRAIN MESMERIZING

```
TASK: Elevate the brain's UI/UX to premium and cinematic WITHOUT changing its core
identity (dark space aesthetic, concentric rings, teal/cyan primary). Show me the plan
first, commit at the end.

1. Rings mode:
   - Smooth per-ring counter-rotation (adjacent rings in opposite directions at slightly
     different speeds; the existing speed slider becomes a master multiplier).
   - Depth: subtle parallax/scale so inner rings feel closer; soft radial vignette +
     faint starfield background.
   - Node states, visually distinct: lit = soft bloom halo in domain color; charging =
     slow heartbeat pulse at half brightness; ghost = dim ember. Milestone hexes get a
     slow breathing glow. Edges between lit nodes pulse gently; ghost edges are
     hairlines; wikilink edges get a subtly different stroke so organic connections read
     differently from planned ones.
   - The ignition: on LIVE load, lit nodes animate on in completion order over ~2.5s —
     a wave of light through the brain. Respect prefers-reduced-motion (skip animation).
2. Galaxy mode: gentle force settle (no chaotic jitter); domain-colored nebula tints
   behind clusters.
3. Interaction: hover = scale + label; click = camera ease + inspector; inspector layout
   gets domain chip, cluster chip, size chip, state badge, plan-version chip, backlinks
   list; ESC closes; sane zoom limits.
4. "TOUR" button: 20-second auto camera path (wide → dive to ring 1 → orbit → pull back)
   — built for screen-recorded demos.
5. Performance: canvas rendering, target 60fps with 300+ nodes and ~1000 edges on a mid
   laptop; report FPS before/after.
6. Mobile: pinch zoom, tap select, panels as bottom sheets.
7. Do NOT change: color language, LIVE/VISION toggle placement, left panel structure.
   Screenshot before/after. Commit: "feat(ui): premium cinematic pass — node states,
   bloom, ring choreography, tour mode" + push.
```

---

## PROMPT 7 — DEPLOY: VERCEL CONFIG + RITUAL DOCS

```
TASK: Prepare the repo for Vercel deployment of the SITE ONLY (repo is private; the
deployed site is public — that's intended). Plan first, commit at the end.

1. Configure the cleanest Vercel setup: root vercel.json building via the site-build
   pipeline and serving site/ as output — or document setting Root Directory to site/
   with the build command wired to tools/site-build. Choose the approach guaranteeing:
   (a) agent-lab/ is NEVER built or deployed, (b) every push to main rebuilds the brain
   from the latest notes + latest plan version (so day:close alone updates the public
   map daily).
2. Decide and implement ONE strategy for generated graph data (regenerated at deploy vs
   committed by day:close) and tell me which and why.
3. docs/DEPLOYMENT.md — exact one-time Vercel dashboard steps for me (private-repo
   import included).
4. docs/DAILY_RITUAL.md — my complete runbook:
   THE DAILY LOOP (every single day, ~10 min overhead): `npm run next-node` (pick or
   continue) → learn/build, write into the note, drop [[wikilinks]] as I think →
   `npm run finish-node` when a node is truly done (may be 0, 1, or 3 times a day) →
   `npm run day:close` ALWAYS, even on charging-only days.
   THE CONTENT LOOP: when a node lights, pick ONE generated draft, polish 15 min,
   schedule; the 1-in-4 format rule (carousel / text / infographic / video); Sunday
   batch session.
   THE EVOLUTION LOOP: `npm run frontier-scan` weekly; `npm run replan` whenever the
   field or my pace demands — never from restlessness alone; every capstone node
   includes a formal replan checkpoint.
   THE RULES: show up daily — day:close is the heartbeat; a charging day is a real day;
   Feynman section mandatory before finish-node; never backfill dishonestly; VISION
   shares the dream, LIVE shares the proof.
5. Final hygiene: clean root, accurate README, re-run Prompt-0 secret-scan patterns,
   fresh-clone build test in a temp folder.
6. Commit: "chore(deploy): vercel config + ritual docs" + push.
```

**🖐️ MANUAL (after Prompt 7):**
1. vercel.com → Add New Project → Import `tharungajula2/vizier-ai` (works with private
   repos — grant Vercel access when asked).
2. Set Root Directory / build command exactly per docs/DEPLOYMENT.md → Deploy.
3. You get `vizier-ai.vercel.app` (or similar) — the brain's new public home. The old
   `vizier-life-os.vercel.app` on the other account can be deleted later.

---

## PROMPT 8 — VERIFICATION + FIRST IGNITION

```
TASK: Full end-to-end verification, then help me light my first real node.

1. Verify the deployed URL: VISION shows the full node graph + milestone hexes; LIVE
   reflects current state; deep links work on the live site; mobile renders; no console
   errors. Fix anything broken.
2. Walk me through my first node LIVE, interactively: `npm run next-node`, show me the
   recommended starting node (foundations ring), wait while I genuinely learn and write
   my real note with at least one [[wikilink]], then run `npm run finish-node` and
   `npm run day:close` with me — I approve suggested links — and confirm the push
   deployed and the node is LIT with its backlink wiring visible on the public URL.
3. Final one-page summary: the repo map, the daily loop, the evolution loop
   (frontier-scan / replan), the three node states, what's frozen in agent-lab, and the
   exact phrase that unfreezes it.
```

---

## PROMPT 9 — (POCKET PROMPT — USE ANY DAY YOU'RE READY) UNFREEZE / EARLY RESURRECTION

The day you feel ready — week 2 or month 5, your call — paste this:

```
unfreeze agent-lab.
TASK: I am pulling the RESURRECTION milestone forward. Guide me — teaching, not doing —
through deploying Machine 1 (agent-lab/backend) and Machine 2 (agent-lab/web) with my
own hands: environment, database, migrations, OAuth, scheduler, approval gate,
dashboard. Explain every step like I'm completely new; I type the commands; you verify
results. When it runs, help me execute `npm run replan` with the reason "Resurrection
completed early" so the graph absorbs it: mark the milestone complete, repurpose the
now-redundant resurrection nodes into deeper or newer topics, and propose THE BRIDGE
(the deployed agent proposing brain nodes through its own approval gate) as the natural
next build. Re-freeze agent-lab afterward unless I say otherwise.
```

---

## THE FRAMEWORK (what you can teach & sell later) — "Learn → Node → Post, Evolving"

1. A **permanent spine** (10 domains) + a **versioned fluid node graph** (the ghost map).
2. A **node note protocol** — the atomic, immutable unit of proof, decoupled from the
   calendar; the 250-day marathon measures showing up, the graph measures mastery.
3. **Human-gated AI evolution** — Gemini proposes links, drafts, and replans; a human
   approves everything (the HITL philosophy inherited from the agent itself).
4. A **public, deep-linkable, self-rewiring visualization** — every daily commit rebuilds
   the wikilink/backlink wiring; every replan is a changelogged act of honesty.
5. A **content engine** where the learning artifact IS the content source.

Swap the graph and anyone — a UPSC aspirant, a med student, a designer — can run this
framework. That's the mentorship/product angle after Day 250.