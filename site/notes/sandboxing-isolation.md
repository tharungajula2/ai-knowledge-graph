## ELI5
The node summary names the mindset: **blast-radius thinking for tools.** When an agent runs code, executes a tool, or processes untrusted content, the question isn't only "will it misbehave?" but "*if* it misbehaves, how much damage can it do?" Sandboxing is the discipline of *containing* an agent's operations so that when something goes wrong — a malicious payload succeeds, a tool is exploited, generated code is harmful — the damage is *bounded* to an isolated environment. It's defense in depth's foundation: assume breach, contain the blast.

## The Real Explanation
**The blast-radius mindset — assume breach.** Every other defense tries to *prevent* the bad thing; sandboxing accepts that prevention sometimes fails (the arms race, Ch 4) and asks "when it fails, what's the damage?" — then works to *minimize* that damage. This is the mature security posture (Vol 02 Ch 12's "assume-breach thinking," now central): you can't guarantee no attack succeeds, but you *can* guarantee that a successful attack is *contained* — the agent that gets injected can only harm its sandbox, the generated code that's malicious can only affect its isolated environment, the exploited tool can only reach what its sandbox permits. Blast-radius thinking turns "catastrophe if breached" into "contained incident if breached" — the difference between a bounded mess and an unbounded disaster.

**What needs sandboxing (the high-risk operations).** *Code execution* (the sharpest — an agent that runs generated or user-provided code is running *arbitrary code*, Vol 01 Ch 20's power with Vol 08's stakes; a code-interpreter tool is a remote-code-execution surface by design). *Untrusted content processing* (the quarantine agent, Ch 7's Rule of Two — the agent handling web pages/documents runs isolated, with no private data and no exfil, so injection can't escape). *Tool execution* generally (a tool that touches the filesystem, network, or external systems — confine it, Vol 05 Ch 9's path-confinement generalized). *Third-party/MCP servers* (Vol 05 Ch 13 — a server you don't fully trust runs isolated). The rule: *the higher the operation's risk and the lower your trust in what it processes, the tighter the sandbox.*

**The isolation techniques (the containment spectrum).** *Process isolation* (run the risky operation in a separate process — a crash or compromise doesn't take down the main system). *Container isolation* (Docker and kin, Vol 09's territory — the operation runs in a container with limited filesystem, network, and resources; the standard for code execution — a container the generated code can trash is thrown away, blast contained). *VM/microVM isolation* (stronger — gVisor, Firecracker — for higher-risk code execution; the boundary is harder to escape). *Network isolation* (the sandbox has no network, or only an allowlist — removes the exfil path, Ch 7, at the infrastructure level — injected code can't phone home). *Resource limits* (CPU, memory, time caps — Vol 04 Ch 17's budgets as *security* controls: an operation that can't consume unbounded resources can't be a denial-of-service, Ch 1's cost-attack). *Filesystem confinement* (the operation sees only a scoped, ephemeral filesystem — nothing sensitive, nothing persistent). The technique matches the risk: a low-risk tool gets process isolation, arbitrary code execution gets container-plus-no-network-plus-resource-limits.

**The unifying principle — isolation makes the trifecta and least-privilege physical.** Sandboxing is where Ch 7's "remove exfil paths" and Ch 8's "scope capabilities" become *infrastructure*: a network-isolated sandbox *physically* removes the exfil path (not "the agent shouldn't send data out" but "there is no network to send it through"); a filesystem-confined sandbox *physically* removes private-data access (not "the agent shouldn't read secrets" but "the secrets aren't in this filesystem"). Sandboxing turns the *policy* of least-privilege and the *discipline* of the trifecta into *physical, enforced boundaries* — the strongest form of "security is architecture," because the architecture is now the actual runtime environment, not just the code. And it's the foundation of defense in depth (Ch 19): even if every other layer fails and the attacker fully controls the agent, the sandbox bounds what "fully controlling the agent" can achieve. Assume breach; contain the blast; sleep at night.

## Why It Matters
Where this appears in real systems and jobs: blast-radius thinking for tools.

## Hands-On
Apply blast-radius thinking (concept node, concrete): (1) For each risky operation in your systems (does any agent run code? process untrusted web content? call filesystem/network tools?), assess the current blast radius: if this operation were fully compromised, what's the damage? (2) Design the sandbox for the riskiest one: which isolation techniques (process/container/network/resource/filesystem) would contain it, and how does each map to removing a trifecta ingredient (Ch 7) or scoping a privilege (Ch 8)? (3) If you have a code-execution or untrusted-content operation, prototype one isolation layer (a network-less container, a resource-limited subprocess, a confined filesystem) and verify the containment (try to make the sandboxed operation reach outside — confirm it can't). The blast-radius assessment + the sandbox design + the containment verification = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the blast-radius mindset — how does it differ from prevention, and what's the assume-breach posture?
2. Name the high-risk operations that need sandboxing, and the rule for how tight.
3. Recite the isolation techniques from process to filesystem confinement, matched to risk.
4. How does sandboxing make the trifecta and least-privilege *physical* rather than policy?
5. Why is sandboxing the foundation of defense in depth — what does it bound even in total compromise?


---

# PART III — PROVE IT
*6 chapters. The ring's proof: attack your own agent, fix what broke, lock it with a permanent test suite, understand responsible shipping, synthesize defense in depth, and close.*

---

## Wikilinks
[[lethal-trifecta]]
[[least-privilege-tools]]
[[terminal-fluency]]
[[cost-latency-budgets]]
[[synthesis-safety]]

## Status log
- Started: 2026-07-21
- Finished: null