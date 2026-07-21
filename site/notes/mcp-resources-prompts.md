## ELI5
Most people know MCP as "standardized tools" and stop. The node summary insists on the rest: **beyond tools — the full spec.** MCP servers expose *three* primitives, and the two everyone ignores — **resources** and **prompts** — are where the protocol's real design elegance lives. Knowing all three separates someone who *uses* MCP from someone who *architects* with it, and it directly shapes how you'll design your Ch 16 brain server.

## The Real Explanation
**The three primitives, and the crucial distinction — who controls each.** This is the spec's key insight, and it's about *control*:
- **Tools** — *model-controlled*: the LLM decides when to call them (Vol 04 Ch 7). Actions with effects. The model is in the driver's seat.
- **Resources** — *application-controlled*: data the server exposes for the *host application* to read and decide what to do with (files, database records, live context). Read-only, GET-like, identified by URIs. The *app* (not the model) chooses what to load into context. Example: a brain server exposes each note as a resource; the host app can load a specific note's content into context *without the model deciding to call a tool* — data provisioning, not model action.
- **Prompts** — *user-controlled*: reusable prompt templates the server offers, typically surfaced to the *user* as slash-commands or menu options (e.g., a "summarize-this-note" prompt the user picks). The user invokes them deliberately.

The elegance: **three primitives for three controllers** — model (tools), app (resources), user (prompts). A well-designed server uses all three appropriately instead of forcing everything through tools. Forcing data-reads through tools (making the model "call" for content the app should just load) wastes model decisions and context; forcing user-templates through tools makes them invisible to users. Right primitive, right controller.

**Resources in depth.** URI-identified (`brain://notes/attention-transformers`), listable and readable, can be static or dynamic (templated URIs like `brain://domain/{domain}/notes`). The host decides what to read and when — which means resources are how a server provides *context* rather than *actions*. For RAG-flavored servers this is powerful: your brain server (Ch 16) can expose retrieved chunks as resources the host loads, separating "the app curates context" from "the model decides actions" — a cleaner architecture than cramming retrieval into a tool the model must remember to call. (Though note: exposing search *as a tool* is also valid when you *want* the model to decide when to search — the two designs serve different control philosophies, and choosing deliberately is the architect's job.)

**Prompts in depth.** Server-provided templates with arguments, surfaced to users. They let a server ship *expertise* — a database server offering a well-crafted "explain-this-query-plan" prompt, a brain server offering a "quiz-me-on-domain" prompt (Ch 16 could expose your Feynman-review method as a prompt any client's user can invoke). Prompts are how a server author packages *good prompting* (your entire Vol 02 skillset) for reuse across every client — the prompt-as-versioned-artifact idea (Vol 02 Ch 3), shipped over a protocol.

**Why the full spec matters for architecture.** The three-primitive model is a *separation-of-concerns* framework for AI capabilities: actions vs data vs interactions, each with its natural controller. When you design the brain server (Ch 16), this framework forces good questions: *which* brain capabilities are model-decided actions (search? propose-node?), *which* are app-loaded data (note content? domain lists?), *which* are user-invoked interactions (review-me? quiz-me?)? Answering those *is* the server's architecture — and getting it right makes your brain genuinely useful to any client, not just callable.

## Why It Matters
Where this appears in real systems and jobs: beyond tools — the full spec.

## Hands-On
Design-focused (concept node), pointed straight at Ch 16: (1) The control-mapping table — for your future brain server, list ~10 capabilities and assign each its primitive (tool/resource/prompt) *and* its controller (model/app/user), with a one-line justification. Which are actions? Which are data? Which are interactions? (This table is literally Ch 16's design doc, started early.) (2) Extend your Ch 9 utils server with *one resource* (expose a system config file as a readable resource) and *one prompt* (a "diagnose-slow-system" template) — small code, big understanding; connect with your Ch 11 client and access all three primitive types. (3) Write the paragraph: why is forcing everything through tools a design smell, and what does the three-controller model buy? The control table + the extended server + the paragraph = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three primitives and the controller of each — the model/app/user mapping.
2. What distinguishes a resource from a tool, mechanically and philosophically?
3. What do prompts let a server author ship, and how does that connect to Vol 02's prompt-as-artifact idea?
4. Give one brain-server capability for each primitive, justified by its controller.
5. Why is "everything through tools" a design smell?


---

## Wikilinks
[[mcp-fundamentals]]
[[build-mcp-server]]
[[build-brain-mcp-server]]
[[prompt-skeleton]]
[[citations-grounding]]

## Status log
- Started: 2026-07-21
- Finished: null