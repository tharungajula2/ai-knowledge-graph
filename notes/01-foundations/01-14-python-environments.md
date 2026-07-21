---
id: python-environments
title: "Environments & Packages"
domain: foundations
ring: 1
cluster: "The Engineer's Floor"
type: build
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["terminal-fluency", "git-mastery", "python-craft-professional"]
tags: [foundations]
---

## ELI5
Project A needs library version 1.0; Project B needs version 2.0. Install both into one shared Python and they fight — the infamous "works on my machine" disease. A **virtual environment** gives every project its own private toolbox: its own Python, its own installed packages, zero crosstalk. Professionals never install project packages globally. Ever.

## The Real Explanation
```bash
python3 -m venv .venv              # create the private toolbox (a folder named .venv)
source .venv/bin/activate          # step inside (Windows: .venv\Scripts\activate)
which python                       # verify: path now points INSIDE .venv
pip install requests               # installs land in the toolbox only
pip freeze > requirements.txt      # snapshot exact versions — the reproducibility contract
deactivate                         # step outside
```
The mental model: `activate` just edits your shell's PATH so `python` and `pip` resolve to the `.venv` copies. `requirements.txt` is how a teammate (or a server, or Docker in a later domain) rebuilds your exact toolbox: `pip install -r requirements.txt`. Two habits that mark professionals: `.venv/` goes in `.gitignore` (you commit the *recipe*, never the toolbox itself), and one project = one venv, created the minute the project folder is born. (Later you'll meet `uv` — a fast modern replacement doing the same jobs; the concepts transfer 1:1.)

## Why It Matters
Where this appears in real systems and jobs: venv, pip, running scripts like a pro.

## Hands-On
Create a folder `vizier-floor/`, and inside it a venv. Activate, prove isolation with `which python`, install `requests`, write `main.py` that imports requests and fetches any URL's status code, run it, freeze requirements. Then the real test: `deactivate`, delete `.venv` entirely, recreate it from `requirements.txt` alone, and run `main.py` again. If it runs, you've proven reproducibility — the entire point.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What disease do venvs cure? Describe the two-projects conflict precisely.
2. What does `activate` mechanically do to your shell?
3. Why commit `requirements.txt` but gitignore `.venv/`?
4. Write from memory: create, activate, install, freeze, deactivate.
5. Your script works locally, fails on the server with `ModuleNotFoundError`. First two things you check?


---

## Wikilinks
[[terminal-fluency]]
[[git-mastery]]
[[python-craft-professional]]

## Status log
- Started: 2026-07-21
- Finished: null
