## ELI5
You can armor your agent perfectly against every prompt attack — and still be owned, because the *dependency you installed* was already compromised. The node summary: **poisoned packages, models, and MCP servers.** Supply-chain attacks target what you *build on* rather than what you build — the packages, models, datasets, and servers your system trusts implicitly. And in AI, the supply chain is *stranger and larger* than in traditional software, because it includes trusting *model weights* and *natural-language tool descriptions* you didn't write. This chapter maps the risks and the discipline of trusting deliberately.

## The Real Explanation
**The traditional supply chain (still applies, now with AI stakes).** Your code depends on packages (pip, npm — Vol 01 Ch 14), which depend on more packages, transitively, dozens deep — and *any* of them, if compromised, runs in *your* process with *your* privileges. Attack vectors: *malicious packages* (typosquatting — `requsts` instead of `requests`; a popular package's maintainer account compromised; a dependency that was benign then turned malicious in an update — the rug-pull, Vol 05 Ch 13), *dependency confusion* (a public package shadowing your private one). Defenses (classical, still essential): pin versions (Vol 01 Ch 14's `requirements.txt`, Vol 07 Ch 11's reproducibility — pinned deps can't silently change under you), audit dependencies (know what you're installing, minimize the count — every dependency is trust extended), use lockfiles and hash-verification, and scan for known vulnerabilities (automated tools). The AI stakes: an agent's compromised dependency doesn't just leak — it can wield the agent's *capabilities* (Ch 1's blast radius).

**The AI-specific supply chain — the new, stranger risks.** (1) *Poisoned models* — you download open-weights (Vol 01 Ch 11) or a fine-tune from a model hub; how do you know it wasn't *backdoored*? A model can be trained with a hidden trigger (a specific phrase that makes it misbehave — a "sleeper" behavior invisible in normal use, activated by the attacker's key), or subtly biased, or trained to exfiltrate. You can't easily *inspect* weights for backdoors (they're inscrutable numbers, Vol 01 Ch 2) — so trust must come from *provenance* (who published it, verified checksums, reputable sources) not inspection. (2) *Poisoned training data* — if you fine-tune (a future domain) on scraped or third-party data, poisoned examples can implant backdoors or biases; data provenance matters (Vol 07 Ch 11). (3) *Poisoned MCP servers* — Vol 05 Ch 13's whole subject: a malicious server with tool-poisoned descriptions or rug-pulled behavior; adding an MCP server is extending *execution* trust, and the defenses are supply-chain defenses (vet, pin, minimize). (4) *Poisoned RAG sources* — a document planted in a corpus you index (Vol 03) is a supply-chain attack on your *knowledge* (indirect injection, Ch 3, meets supply chain).

**The unifying principle — trust is a decision, make it deliberately.** Every dependency — package, model, server, data source — is *trust extended to something you didn't build*, and the supply-chain discipline is: *make trust deliberate, minimal, and verified*. Concretely: *minimize* (fewer dependencies = smaller attack surface — the least-dependency principle, sibling to least-privilege Ch 8); *verify provenance* (reputable sources, checksums, signatures — trust the publisher, verify the artifact); *pin* (Vol 01 Ch 14, Vol 07 Ch 11 — pinned things can't rug-pull); *isolate* (a dependency you must use but don't fully trust runs sandboxed, Ch 14 — blast-radius containment); and *monitor* (Vol 07's observability — watch for the behavioral change that signals a compromised dependency turned malicious). The deepest version: *assume any dependency could be compromised, and architect so that when one is, the damage is bounded* (defense in depth, Ch 19, applied to the supply chain — the same "security is architecture" law).

## Why It Matters
Where this appears in real systems and jobs: poisoned packages, models, and MCP servers.

## Hands-On
Audit your own supply chain (concept node, concrete): (1) Inventory your agent's full dependency tree — packages (and their transitive deps — count them; the number will surprise you), models (which weights/APIs, from where), MCP servers (Vol 05 — what have you connected?), and RAG/data sources (Vol 03/06 — what's in your indexes?). Each is trust extended. (2) For each, assess: how did I decide to trust this? Is it pinned? What's its blast radius if compromised? Which would hurt most? (3) Apply one improvement: pin an unpinned critical dependency, remove an unnecessary one (minimize), or add provenance verification for a model/server. The dependency inventory + the trust assessment + the one hardening = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does a compromised dependency in an *agent* matter more than in traditional software?
2. Name the four AI-specific supply-chain risks (models, data, servers, RAG sources) and why each is hard to defend.
3. Why can't you inspect model weights for backdoors, and what must trust rest on instead?
4. State the unifying principle, and recite the five-part supply-chain discipline.
5. What's the deepest supply-chain stance, and how does it echo "security is architecture"?


---

# PART II — THE DEFENSES
*9 chapters. The layered controls: spotlighting untrusted content, the lethal trifecta, least-privilege tools, the proposal gate, idempotency & audit, guardrails, PII redaction, refusals, and sandboxing.*

---

## Wikilinks
[[python-environments]]
[[mcp-security]]
[[model-landscape]]
[[data-versioning-reproducibility]]
[[sandboxing-isolation]]

## Status log
- Started: 2026-07-21
- Finished: null