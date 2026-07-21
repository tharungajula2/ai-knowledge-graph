## ELI5
Git is a time machine with parallel universes. Every **commit** is a snapshot you can return to forever; every **branch** is a parallel universe where you experiment without endangering the main timeline; **merge** brings a successful experiment home. You already *use* the ritual daily — this chapter is about finally *understanding* the machine, so nothing Git does ever scares you again.

## The Real Explanation
**The three rooms.** Every file change moves through: **working directory** (your messy desk) → `git add` → **staging area** (the photo studio — *choose* what enters the next snapshot) → `git commit` → **repository** (the permanent album). Staging exists so one desk of changes can become several clean, single-purpose commits — the difference between a readable history and an archaeology dig. `git status` tells you which room everything is in; when lost, `status` first, always.

**The daily ten, understood not memorized:** `status` / `diff` (what changed) / `add -p` (stage by hunk — the pro move) / `commit -m` / `log --oneline --graph` (the timeline map) / `branch` / `switch -c feature-x` (new universe) / `merge` / `push` / `pull`. A branch is just a movable sticker pointing at a commit — creating one is free and instant, which is why the pro habit is: *never* experiment on `main`; every idea gets a branch; merge when proven, delete after.

**The undo table — memorize this and lose all fear:** unstage a file → `git restore --staged f`; discard uncommitted mess → `git restore f` (careful: gone-gone); fix the last commit's message or add a forgotten file → `git commit --amend`; *safely* undo a pushed commit → `git revert <sha>` (adds an anti-commit; history stays true); move your branch pointer back in time → `git reset` (fine locally, dangerous on shared history); "I deleted my work!!" → `git reflog`, the secret journal of everywhere HEAD has been — commits are almost never truly lost. Rule of thumb: `revert` for public history, `reset` for private.

**Merge conflicts, demystified.** A conflict is not an error — it's Git honestly saying "both universes edited the same lines; a human must choose." The `<<<<<<< ======= >>>>>>>` markers show both versions; you edit to the truth, `add`, `commit`. That's all a conflict has ever been.

**Why this is load-bearing:** your brain's own laws (lit nodes immutable, changelog-gated replans) are Git-shaped thinking; your milestone plan starts with tagging (`git tag pre-brain-simplification`) — Chapter 24's capstone will have you tagging releases of your own knowledge.

## Why It Matters
Where this appears in real systems and jobs: branches, commits, history — understand my own daily ritual.

## Hands-On
In `vizier-floor/`, run the full drama: `git init`, commit `main.py`, branch `experiment`, change a line, commit, switch back to `main`, change the *same* line differently, commit, merge `experiment` → hit the conflict on purpose → resolve it, commit. Then time-travel: `log --oneline`, `revert` the merge, watch the file change back, then `reflog` and observe your whole journey recorded. Screenshot the graph — artifact done.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three rooms and what `add` and `commit` each move between them.
2. What *is* a branch, physically, and why does that make branching free?
3. Revert vs reset — which for shared history and why?
4. A merge conflict appears. Narrate your exact steps, unafraid.
5. What is reflog, and what fear does it delete?


---

## Wikilinks
[[terminal-fluency]]
[[python-environments]]
[[capstone-foundations]]

## Status log
- Started: 2026-07-21
- Finished: null