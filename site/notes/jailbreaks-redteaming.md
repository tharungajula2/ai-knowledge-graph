## ELI5
You cannot defend a system you've only ever used as intended — you have to *attack* it, think like the adversary, actively try to break it. The node summary: **thinking like the attacker.** Red-teaming is the discipline of adversarial testing — deliberately trying to make your own system misbehave, so you find the holes before an attacker does. And jailbreaks are the creative art of circumventing an AI's safety constraints. This chapter installs the attacker's mindset, which is the prerequisite for every defense and the whole point of the ring's Part III.

## The Real Explanation
**The red-team mindset — the mental flip.** A builder asks "how do I make this work?"; a red-teamer asks "how do I make this *fail* in a way that helps me?" The flip is deliberate and uncomfortable: you stop being the system's advocate and become its adversary, assuming bad faith, probing for the gap between what the system *intends* and what it *permits*. Every defense has an assumption; the red-teamer's job is to find and violate it. This mindset is *learnable and essential* — the builder who can't red-team ships holes they never imagined, because their own good-faith usage never touches the adversarial edges. (And it connects to Vol 07: red-teaming is *eval for security* — adversarial golden sets, measured, the rigor of Ring 7 aimed at attacks.)

**The jailbreak taxonomy (the creative attack catalog — evolving, but the *categories* endure).** *Role-play / persona* (Ch 2's DAN — a character with no rules). *Hypothetical framing* ("in a fictional world where...", "for a novel I'm writing..." — wrapping the forbidden in fiction). *Instruction hierarchy attacks* (forged system messages, "the developer said it's okay"). *Incremental / crescendo* (start benign, escalate gradually so no single step trips the guard — the payload-splitting cousin). *Encoding / obfuscation* (base64, ciphers, other languages, token-splitting — evading pattern filters). *Context overflow* (bury the safety instructions under so much text they lose influence — lost-in-the-middle, Vol 01 Ch 8, weaponized). *Prompt leaking → targeted attack* (extract the system prompt, then craft attacks against its specific rules). *Many-shot* (fill the context with examples of the model complying with bad requests, exploiting in-context learning — Vol 02 Ch 4's few-shot, inverted). The specific tricks churn (defenses close, attackers innovate — an arms race); the *categories* and the *mindset* are what you learn, because they generalize to whatever's novel when you read this.

**Red-teaming as a practice — how it's done well.** *Systematic, not random*: work the threat model (Ch 1) — attack each entry point, target each capability, pursue each objective. *Creative and persistent*: the best attacks are the ones the builder didn't imagine, so brainstorm widely, combine techniques, iterate on near-misses. *Documented*: every attack (successful or not) recorded — successes become fixes (Ch 16) and permanent tests (Ch 17); failures map the defended perimeter. *Adversarially honest*: don't pull punches on your own system (the temptation to defend your baby is the red-teamer's enemy — Vol 06 Ch 16's self-honesty, in security clothes). *Measured*: attack success rate as a metric (Vol 07) — track it over time as you patch, and watch it drop. Professional red-teaming (internal teams, external firms, bug bounties, automated red-teaming tools) all follow this shape; you'll do it to your own agent in Ch 15.

**The arms-race reality — the honest frame.** Jailbreaks and defenses co-evolve: every defense gets circumvented eventually, every circumvention gets patched, forever (Vol 02 Ch 12, Vol 05 Ch 14's frontier honesty). This means: security is a *process*, not a state (you're never "done" — you're continuously testing and patching); *defense in depth* matters precisely because any single defense will fall (Ch 19); and the goal isn't *impregnable* (impossible) but *raising cost and bounding damage* — make attacks expensive enough that most attackers give up, and architect so that the ones who succeed can't do much (Ch 7, Ch 8). Red-teaming is how you *stay* in the race, not how you win it once.

## Why It Matters
Where this appears in real systems and jobs: thinking like the attacker.

## Hands-On
Become the attacker (concept node, concrete): (1) Red-team your own agent systematically — work your Ch 1 threat model, and for each entry point/capability, try the jailbreak taxonomy. Aim for *20 distinct attack attempts*, documented (attack, technique, result). Be adversarially honest — *try* to break it. (2) Find your best success (the attack that worked, or came closest) and understand *why* it worked — which assumption did it violate? (3) Compute your agent's attack-success-rate on your battery — a baseline security metric you'll watch drop as you patch (Ch 16). The 20 documented attacks + the best-success analysis + the baseline success-rate = the note; this is Ch 15's red-team build, in miniature.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the red-team mental flip, and why can't a builder-only mindset find the holes?
2. Name six jailbreak categories, and why do you learn categories rather than specific tricks?
3. Recite the five properties of red-teaming done well.
4. Why is "adversarially honest about your own system" the hardest and most important property?
5. Explain the arms-race reality — what's the realistic goal if impregnable is impossible?


---

## Wikilinks
[[direct-injection]]
[[agent-threat-model]]
[[build-redteam-my-agent]]
[[why-evals-rule]]
[[lethal-trifecta]]

## Status log
- Started: 2026-07-21
- Finished: null