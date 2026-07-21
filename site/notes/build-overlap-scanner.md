## ELI5
Indirect injection is the dangerous one — instructions hidden in content your agent processes *on someone else's behalf* (Vol 02 Ch 12, Vol 04 Ch 14). The node summary is a specific, clever detection approach: **build a security scanner that parses payloads for override keywords and correlates thread checkpoints to detect untrusted data overlap; verify with custom injection attacks.** This is your agent-lab's injection scanner, rebuilt as its rightful author — and it's a *layered* detector: keyword-scanning for known attack patterns, *plus* the subtler "overlap" detection that catches when untrusted data bleeds into instruction-space. A real defensive build, verified by attacking it yourself.

## The Real Explanation
**The threat this defends — indirect injection, precisely.** An attacker plants instructions in content your agent will *read but didn't author*: a web page your research agent fetches (Vol 04 Ch 14), a document in your RAG index (Vol 03), an email your agent triages, a tool result, an MCP resource (Vol 05). The victim user never sees the payload; the *model* does, and may obey it — and combined with tools (Ch 7's lethal trifecta), obeying means attacker-directed *actions*. The scanner's job: detect injection *before* the content influences the model, or detect when it *has*.

**Layer 1 — Override-keyword parsing (the pattern detector).** Scan untrusted content for the linguistic signatures of injection: override phrases ("ignore previous/above instructions," "disregard your rules," "new instructions:"), role-manipulation ("you are now," "pretend you are," "act as"), instruction-injection markers (fake "[SYSTEM]:" / "[ADMIN]:" tags in data), exfiltration language ("send to," "forward to," "include your system prompt"), and encoding red-flags (unexpected base64 blobs, unusual unicode). This is a classifier (Vol 01 Ch 12 — precision/recall apply: too aggressive flags benign content mentioning "instructions"; too lax misses attacks — the defender's dilemma, Vol 02 Ch 12), and it catches the *obvious* attacks cheaply. Its limit (be honest): pattern-matching misses novel phrasings, paraphrases, and clever encodings — which is why it's *layer one*, not the whole defense.

**Layer 2 — Thread-checkpoint overlap correlation (the clever part, and the node's distinctive move).** The deeper detection: correlate the *untrusted data* entering the agent against the agent's *thread state / checkpoints* (Vol 04 Ch 6) to detect *overlap* — when content from an untrusted source starts appearing in *instruction-space* (the agent's decisions, its emitted actions) where it shouldn't. The intuition: legitimately, untrusted data should be *processed* (summarized, analyzed) but should *not* become the source of the agent's *instructions* or *actions*. If text that entered as a fetched web page's content shows up driving a tool call or altering the agent's goal, that overlap is the injection's fingerprint. By checkpointing thread state and correlating what-came-from-untrusted-sources against what's-now-influencing-decisions, you catch injection *by its effect* even when the payload's *phrasing* evaded the keyword scanner. This is detection-by-consequence rather than detection-by-pattern — more robust, and the reason this scanner is more than a regex.

**The scanner's integration and honest role.** It sits in the agent's input path (scanning untrusted content before it enters context) and can also monitor the decision path (the overlap correlation). On detection: flag, quarantine the content (treat as pure data, Ch 6 spotlighting), block the influenced action (route to the gate, Ch 9), or refuse — *policy you choose*. And the honest framing (Vol 02 Ch 12, always): the scanner *raises the bar, guarantees nothing* — it's one layer of defense in depth (Ch 19), valuable for catching known and effect-visible attacks, insufficient alone. Its precision/recall (Vol 01 Ch 12) should be *measured* (Vol 07 — safety is evaluable): a scanner you haven't measured is a scanner you can't trust, and its false-positive rate matters (flagging benign content degrades the product) as much as its recall (missing attacks defeats the purpose).

**Verification — custom injection attacks, per the node.** Author a battery of injection payloads: keyword-obvious ones (should be caught by layer 1), paraphrased/novel ones (test layer 1's limits), encoded ones (test detection of encoding), and *effect-based* ones (payloads whose phrasing is subtle but which *do* try to redirect actions — test layer 2's overlap detection). Measure precision/recall (Vol 07 Ch 3's rigor): against your attack battery *plus* a set of benign-but-suspicious content (documents that legitimately discuss instructions, security, override — the false-positive trap). Report both numbers. The scanner that catches 100% of attacks by flagging everything is useless; the honest metric is the precision/recall balance.

## Why It Matters
Where this appears in real systems and jobs: Build a security scanner that parses payloads for override keywords and correlates thread checkpoints to detect untrusted data overlap; verify with custom injection attacks.

## Hands-On
Build it (est. 1 day): layer 1 (override-keyword parser with the pattern taxonomy) → layer 2 (thread-checkpoint overlap correlation — checkpoint what entered from untrusted sources, correlate against what's influencing decisions) → integration into your agent's input/decision path with a configurable response policy → the attack battery (keyword-obvious, paraphrased, encoded, effect-based) + a benign-suspicious set → measure precision/recall for both layers, report both. Then the homecoming: open agent-lab's injection scanner and compare — annotate what it does that yours does, what yours does better, and the honest precision/recall of each. Tag `safety-v0.1`. The two-layer scanner + the attack battery results + the precision/recall + the agent-lab comparison = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is indirect injection more dangerous than direct? Who's the victim, and what's the nightmare combination?
2. What does layer 1 detect, and what are its structural limits?
3. Explain layer 2's overlap correlation — detection-by-consequence vs detection-by-pattern, and why it's more robust.
4. Why must the scanner's precision/recall be measured, and why does the false-positive rate matter?
5. What is the scanner's honest role in the overall defense, and what does it *not* guarantee?


---

## Wikilinks
[[injection-first-look]]
[[langgraph-checkpointers]]
[[classical-ml-fundamentals]]
[[spotlighting-delimiters]]
[[build-injection-suite]]

## Status log
- Started: 2026-07-21
- Finished: null