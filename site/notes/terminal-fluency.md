## ELI5
The terminal is where all serious tools live — Git, pip, Docker, SSH, every deploy script. GUIs are menus at a restaurant; the terminal is the kitchen. The fear dissolves with exactly one realization: it's a *conversation*. You type a sentence (command + options + target), the computer answers. ~15 verbs cover 95% of an engineer's day.

## The Real Explanation
**Moving & seeing:** `pwd` (where am I) · `ls -la` (what's here, including hidden dotfiles like `.venv` and `.git`) · `cd path` / `cd ..` / `cd ~` · `mkdir -p a/b/c` · `cp`, `mv` (also = rename), `rm -r` (no trash can — respect it) · `cat f` (print file) · `less f` (page through, `q` quits) · `head`/`tail` (`tail -f log` = watch a log live — you'll use this the rest of your life).

**The two superpowers.** *Pipes:* `|` sends one command's output into the next — `cat access.log | grep ERROR | wc -l` reads as a sentence: "print the log, keep only ERROR lines, count them." Small tools composed into pipelines *is* the Unix philosophy, and it's why the terminal beats any GUI for real work. *Redirection:* `>` writes output to a file (overwrite), `>>` appends — `python run.py > out.txt 2>&1` captures normal output *and* errors (stream 2) into one file, the exact incantation for capturing a crash to send or grep.

**`grep` deserves its own paragraph:** `grep -r "TODO" .` (search every file under here) · `-i` ignore case · `-n` show line numbers · `-v` invert (everything *except*). Finding where a function is defined in a strange codebase — `grep -rn "def build_index" .` — is daily bread.

**Quality of life that turns dread into home:** Tab completes paths (stop typing full names — this alone changes your life), ↑ replays history, `Ctrl+R` searches history, `Ctrl+C` kills the running thing, `history` shows everything, `man cmd` or `cmd --help` when stuck. Environment variables round it out: `export ANTHROPIC_API_KEY=...`, read by every SDK — you'll set these forever, and later domains put them in `.env` files.

## Why It Matters
Where this appears in real systems and jobs: navigate, pipe, grep — no more fear.

## Hands-On
No mouse for this entire exercise. From home: create `terminal-dojo/logs/`, `cd` in, generate a fake log with `for i in $(seq 1 50); do echo "line $i $( [ $((i % 7)) -eq 0 ] && echo ERROR || echo OK )"; done > app.log`, then: count ERROR lines with a pipe, extract them to `errors.txt` with redirection, watch the file with `tail -f` in one command while appending a line from another, `grep -rn` for a string across the folder, and finish with `history | tail -20 > proof.txt`. That proof file is the artifact.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Translate to English: `cat app.log | grep -i error | wc -l`
2. Difference between `>`, `>>`, and `2>&1` — and the full incantation to capture a crash?
3. You're dropped into an unknown repo: which three commands orient you in 30 seconds?
4. What do Tab and Ctrl+R do, and why do they matter more than memorizing commands?
5. How does a program get your API key from the environment, and which command puts it there?


---

## Wikilinks
[[git-mastery]]
[[python-environments]]
[[python-craft-professional]]

## Status log
- Started: 2026-07-21
- Finished: null