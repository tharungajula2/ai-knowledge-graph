## ELI5
Now you build the pipeline for real. The node summary: **write and run a GitHub Actions YAML workflow that lints Python code, executes pytest runs, builds a container image, and deploys it to staging; verify with commit triggers.** GitHub Actions is the most accessible CI/CD platform (it's built into GitHub, where your code already lives — Vol 01 Ch 19), and this build turns Ch 21's concepts into a working pipeline: push code, and it's automatically linted, tested, built, and deployed. The manual deployment (Ch 19) you understood by hand is now automated by a pipeline you wrote.

## The Real Explanation
**The workflow file — pipeline as code.** GitHub Actions pipelines are YAML files in `.github/workflows/` — *pipeline as code* (versioned with your repo, Vol 01 Ch 19, reviewed like any code). The structure: *triggers* (`on: [push, pull_request]` — Ch 21's trigger events), *jobs* (the stages), each running on a *runner* (Ch 21's fresh container — GitHub provides them), with *steps* (the actual commands). A skeleton:
```yaml
on:
  push: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4        # get the code
      - run: pip install -r requirements.txt
      - run: ruff check .                # lint (Vol 01 Ch 21)
      - run: pytest                      # test (Vol 01 Ch 21)
  deploy:
    needs: test                          # only if test passed — the gate (Vol 07 Ch 9)
    runs-on: ubuntu-latest
    steps:
      - run: # build image, push, deploy to staging (Ch 19, automated)
```
The `needs: test` is the gate (Ch 21, Vol 07 Ch 9) — deploy runs *only if* test passed, so broken code can't reach staging.

**The four stages the node names.** *Lint* (`ruff`/`flake8` — code-quality checks, Vol 01 Ch 21, catching style and simple errors automatically). *Pytest* (your test suite — Vol 01 Ch 21 — the correctness gate; and this is where your evals Vol 07 Ch 9 and security suite Vol 08 Ch 17 plug in, as test stages). *Build* (Ch 5 — `docker build` the image in the pipeline, tagged with the commit SHA for traceability Vol 07 Ch 11). *Deploy to staging* (Ch 19's steps, automated — push to registry, deploy to the *staging* environment: a production-like environment that *isn't* production, where you verify before promoting — the safety buffer between "merged" and "live to users"). Staging-not-production is deliberate: automated deploy to staging is safe (a bad deploy hits staging, not users); promotion to production stays gated (Ch 32's careful rollout).

**The secrets and the security (Vol 08 in the pipeline).** The pipeline needs credentials (registry push, cloud deploy — Ch 24) — stored as *GitHub Secrets* (encrypted, injected into the runner at runtime, never in the YAML — Ch 5/24's never-in-code rule, for pipelines). And the pipeline *itself* is an attack surface (Vol 08's supply chain, Ch 5 — a compromised action or a leaked pipeline secret is a breach): pin action versions (Vol 08 Ch 5's supply-chain pinning), scope the pipeline's credentials minimally (Vol 08 Ch 8 — the deploy credential can deploy, not admin-everything), and protect the secrets. A CI/CD pipeline with cloud-deploy credentials is powerful and therefore guarded.

**Verification — commit triggers, per the node.** Push a commit and watch the pipeline *run automatically*: lint runs, tests run, and *if they pass*, build and deploy-to-staging run — the staging environment updates with your change. Test the gate: push a commit with a *failing test*, and confirm the pipeline *stops* (deploy doesn't run — broken code didn't ship). Test that secrets inject correctly (the deploy authenticates). The commit-triggers-full-pipeline and the failing-test-blocks-deploy are the proofs.

## Why It Matters
Where this appears in real systems and jobs: Write and run a GitHub Actions YAML workflow that lints Python code, executes pytest runs, builds a container image, and deploys it to staging; verify with commit triggers.

## Hands-On
Build it (est. 1 day): the workflow YAML (triggers, jobs, steps) → lint stage (`ruff`) → test stage (`pytest`, plus your evals Vol 07 and security suite Vol 08 as stages) → build stage (Docker image, SHA-tagged) → deploy-to-staging stage (gated on tests, Ch 19 automated) → GitHub Secrets for credentials (Ch 24) → supply-chain hygiene (pinned actions, scoped credentials, Vol 08 Ch 5/8) → verify (push → full pipeline runs → staging updates; failing-test → deploy blocked). This automates the path to RESURRECTION (Ch 34). Tag `prod-v0.13`. The working pipeline + the commit-triggers-deploy demo + the failing-test-blocks-deploy proof = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is "pipeline as code," and why version the workflow with your repo?
2. Walk the four stages (lint, test, build, deploy-staging) and where evals/security plug in.
3. What does `needs: test` do, and why does it prevent broken code from shipping?
4. Why deploy to *staging* not production, and what's the safety buffer for?
5. Why is the pipeline itself an attack surface, and how do you secure it (secrets, pinning, scoped credentials)?


---

## Wikilinks
[[cicd-fundamentals]]
[[ci-gates-for-ai]]
[[build-injection-suite]]
[[build-container-deployment]]
[[secrets-cost-engineering]]

## Status log
- Started: 2026-07-21
- Finished: null