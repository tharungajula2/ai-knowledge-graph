## ELI5
The node summary is a principle stated as a warning: **capabilities, not keys to everything.** The principle of least privilege — give every component the *minimum* access it needs to do its job, and *nothing more* — is the oldest law in security, and it's the concrete engineering of the trifecta discipline (Ch 7): you bound the blast radius (Ch 1) by bounding what each agent *can do*. An agent that can only read your notes can't delete your files, no matter what an attacker tells it — because the capability simply isn't there. Least privilege turns "the agent was tricked" from "catastrophe" into "the agent tried something it couldn't do."

## The Real Explanation
**The principle, applied to agents.** Every agent (and every tool, every sub-agent) gets *exactly* the capabilities its task requires — no standing access to things it might *someday* need, no convenient over-provisioning, no "give it admin so it just works." Concretely: a research agent needs web-search and note-read; it does *not* need file-delete, email-send, or database-write — so it doesn't *have* them. The capability isn't restricted-by-prompt ("please don't delete files"); it's *absent* — the tool isn't in its toolbox (Vol 04 Ch 3), the API key it would need isn't provisioned. This is the difference between "the agent is instructed not to" (vigilance, defeatable by injection) and "the agent cannot" (architecture, defeat-proof) — Vol 04 Ch 7's "the model requests, you execute" combined with "you only gave it safe things to request."

**The granularity of privilege (least-privilege is more than fewer tools).** *Fewer tools* (the obvious layer — only the tools the task needs). *Scoped tools* (a tool that reads *only* the user's own data, not everyone's — the confused-deputy defense, Vol 05 Ch 13; a file tool confined to one directory, not the whole filesystem — Vol 05 Ch 9's path-confinement). *Scoped credentials* (the API key the agent uses has *read-only* permission, or access to *one* resource, not god-mode — so even if the key leaks, the blast radius is bounded; this is where least-privilege meets real infrastructure — IAM roles, scoped tokens, Vol 09's production territory). *Time-bounded / just-in-time access* (grant a capability only for the duration it's needed, revoke after — advanced, but the deepest version). *Per-agent, not per-system* (in multi-agent systems, each specialist gets *its own* minimal privileges — the researcher can't do what the writer can't do what the gate-holder can — Vol 05's isolation as least-privilege). Least privilege is a *design dimension*, not a single switch.

**Why least-privilege is the trifecta's engineering (the connection).** Ch 7 said "remove an ingredient"; least-privilege is *how* you remove two of them: removing *private-data access* is scoping the agent's read capabilities to nothing sensitive; removing *exfil paths* is not giving it network/send/write tools. Least-privilege is the concrete, per-capability implementation of the trifecta discipline — and it's why the two chapters are adjacent. Every capability you *don't* grant is an attack you've made *impossible* rather than merely *unlikely*. The mental habit: for every tool you're about to give an agent, ask "does this task *require* it, and what's the blast radius if this capability is turned against me?" — and grant the minimum, scoped, that answers.

**The tension — capability vs security (the honest tradeoff).** Least privilege *constrains* the agent — an agent with fewer, scoped tools can do less, and there's a real pull toward over-provisioning ("just give it access to everything so it can handle anything"). Resist it: over-provisioning is how a single injection becomes a catastrophe (the agent *could* do the harmful thing because you gave it the capability "just in case"). The discipline: start with *nothing*, add each capability *deliberately* when the task provably needs it (allowlist, not denylist — default-deny is the security default), scope it as tightly as function allows, and re-audit as tasks change (capabilities accrete; prune them). The most secure agent is the least-capable one that still does its job — and finding that minimum is the least-privilege craft.

## Why It Matters
Where this appears in real systems and jobs: capabilities, not keys to everything.

## Hands-On
Audit and minimize your agents' privileges (concept node, concrete): (1) For each agent, list every tool/capability it *has* vs every tool it *needs* for its actual task — the gap is your over-provisioning (there will be some; over-provisioning is the default). (2) For each capability it keeps, assess scoping: is the credential minimal? Is the tool confined (path, data-scope, permission)? Could it be tighter without breaking function? (3) Remove or scope the worst over-grant, and connect it to the trifecta: which ingredient did minimizing this capability remove or reduce? The privilege audit + the scoping assessment + the trifecta connection = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the principle, and the difference between "instructed not to" and "cannot."
2. Name the five granularities of least privilege beyond "fewer tools."
3. How is least-privilege the concrete engineering of the trifecta's "remove an ingredient"?
4. Why is default-deny (allowlist) the security default, and what's the over-provisioning temptation?
5. State the tension and the discipline that resolves it — the "least-capable that still works" craft.


---

## Wikilinks
[[lethal-trifecta]]
[[designing-tools]]
[[mcp-security]]
[[add-the-gate]]
[[sandboxing-isolation]]

## Status log
- Started: 2026-07-21
- Finished: null