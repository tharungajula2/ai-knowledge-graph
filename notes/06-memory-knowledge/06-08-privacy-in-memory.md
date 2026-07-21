---
id: privacy-in-memory
title: "Privacy in Memory"
domain: memory-knowledge
ring: 6
cluster: "Agent Memory"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["memory-extraction", "retrieval-and-decay", "mcp-security", "personalization-via-memory", "temporal-knowledge"]
tags: [memory-knowledge]
---

## ELI5
Everything this ring built — remembering facts, tracking history, personalizing behavior — is powerful, and power over people's data is responsibility. The node summary is a line in the sand: **what should never be remembered.** An assistant that remembers everything is not just a bloated store (Ch 4) — it's a liability, a breach waiting to happen, and potentially a violation of law and trust. This chapter is the ethics and engineering of *restraint* — and it's not a soft add-on; it's a hard design constraint that reshapes the whole memory architecture.

## The Real Explanation
**What should never be stored — the never-remember categories.** Some things extraction (Ch 3) must filter *before* storage, not clean up after: *secrets and credentials* (passwords, API keys, tokens the user pastes — never persist these, a security absolute); *sensitive personal data* (health, financial, legal, sexual, religious, political — special-category data under privacy law, requiring explicit consent and often best not stored at all); *third-party data* (things about *other* people the user mentioned — you didn't get *their* consent); and *ephemeral emotional states* misread as durable facts (Ch 3's false extraction, with privacy stakes — storing "user is depressed" from one frustrated message is both wrong and harmful). The extractor is the first line of defense: a *privacy filter in the extraction prompt* ("never extract credentials, health, financial, or third-party personal information") stops sensitive data at the door, which is far safer than storing-then-scrubbing (you can't un-leak what you stored).

**The user's rights — control as a design requirement, not a feature.** Privacy regulation (GDPR, CCPA, and the global trend) grants rights that memory systems must *architect for*, not bolt on: *access* (users can see what's remembered about them — so the store must be inspectable, not opaque, Ch 5's ownership axis); *rectification* (users can correct wrong memories — Ch 12's update path, now a legal requirement); *erasure* — the right to be forgotten (users can demand deletion — and it must *actually work*, which is why Ch 4 insisted deletion be designed in). Here the Ch 4 warning comes due with full force: once a memory is *embedded* (in a vector store), *summarized into other memories* (Ch 6's compaction entangled it), and *woven into a knowledge graph* (Part II), "delete this one fact" becomes genuinely hard — the fact's influence is smeared across derived artifacts. **A memory system that can't cleanly honor "forget me" is a legal and ethical liability**, and the only reliable fix is designing for deletion from the start: provenance tracking (Ch 1 — every derived memory traces to its sources, so deleting a source can trigger re-deriving what it touched), avoiding irreversible entanglement of sensitive data, and treating erasure as a first-class operation the architecture supports, tested like any other.

**Consent, transparency, and the trust contract.** Beyond the legal minimum, there's the trust relationship (Ch 7's creepiness, at its root): users should *know* memory is happening (transparency — "I'll remember this for next time" beats silent surveillance), *consent* to it (opt-in for sensitive personalization, not opt-out-if-you-notice), and *control* it (see/edit/delete — the antidote to creepy, Ch 7). The design principle: **memory should feel like a helpful friend's recall, not a surveillance system's dossier** — and the difference is entirely consent, transparency, and control. An assistant that remembers *with* you (visible, controllable) is delightful; one that remembers *about* you (silent, opaque) is creepy, regardless of identical underlying tech.

**The engineering imperatives — privacy as architecture (the ring's final "security is architecture" echo).** Concretely: *extract with a privacy filter* (stop sensitive data at the door — Ch 3); *encrypt memories at rest* (they're personal data); *scope access* (a user's memories are theirs — a multi-user system must isolate them, no cross-user leakage — Vol 05 Ch 13's confused-deputy risk, at the memory layer); *design for deletion* (Ch 4, non-negotiable); *minimize by default* (store the least that serves the purpose — the least-storage principle, sibling to least-privilege, least-autonomy; every fact not stored is a fact that can't leak); and *audit* (log what's remembered and why — the provenance habit, now a compliance tool). Privacy isn't a constraint bolted onto memory; it's a design dimension woven through every chapter of this ring — and getting it right is part of what separates a shippable memory system from a demo.

## Why It Matters
Where this appears in real systems and jobs: what should never be remembered.

## Hands-On
Harden your memory system (~30 lines + design): (1) Add the privacy filter to your extraction prompt (never-remember categories) and test it: feed conversations containing a pasted password, a health disclosure, and a third-party's info — assert *none* get stored. The door-filter, verified. (2) Implement erasure: a `forget(subject)` operation that deletes a user's memories *and* handles the entanglement — find memories derived from the deleted ones (via provenance, Ch 1) and re-derive or delete them too. Test that a deleted fact truly stops surfacing, even through compacted/derived memories. (3) Write the privacy design doc for your system: the never-remember list, the consent/transparency model, the deletion architecture, the access-scoping. The filter test + the working erasure + the privacy doc = the note — and this doc is genuinely portfolio-worthy (privacy-aware memory design is a senior signal most people skip).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the never-remember categories and why the extraction filter (not post-hoc scrubbing) is the right defense.
2. Recite the three user rights privacy law grants, and how each becomes an architecture requirement.
3. Why does "forget me" get hard once memories are embedded/compacted/graphed, and how does provenance help?
4. State the "helpful friend vs surveillance dossier" principle — what actually distinguishes them?
5. Recite the privacy engineering imperatives, and name the least-storage principle's siblings.


---

# PART II — KNOWLEDGE GRAPHS
*5 chapters. Knowledge stops being a pile and becomes a graph: the fundamentals, extracting entities from your notes, GraphRAG done properly, facts that change over time, and your own brain formalized as the knowledge graph it was always shaped to be.*

---

## Wikilinks
[[memory-extraction]]
[[retrieval-and-decay]]
[[mcp-security]]
[[personalization-via-memory]]
[[temporal-knowledge]]

## Status log
- Started: 2026-07-21
- Finished: null
