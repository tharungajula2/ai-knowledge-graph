## ELI5
"It works on my machine" is the oldest lie in software — and the node summary names the cure: **containerize a small service myself.** Docker packages your application *with its entire environment* — the exact Python version, every dependency, the system libraries, the config — into a *container* that runs identically everywhere: your laptop, a teammate's machine, the cloud. You met Docker glancingly (Vol 03 Ch 8's pgvector, Vol 08 Ch 14's sandboxing); this build makes you fluent, because containers are how modern software *ships*, and every deployment node ahead assumes them.

## The Real Explanation
**What Docker solves — reproducible environments (Vol 01 Ch 14's venv, taken to its logical end).** A venv isolates Python packages; Docker isolates *everything* — the OS libraries, the Python runtime, the packages, the files, the config — into an *image* (a snapshot of a complete environment). A container is a *running instance* of an image. The guarantee: the container runs the same everywhere because it *carries its whole world with it*. This is Vol 07 Ch 11's reproducibility (pin code, data, environment) achieved for the environment vertex completely: the image *is* the pinned environment, byte-for-byte identical across machines. No more "works on my machine" — if it works in the container, it works everywhere the container runs.

**The Dockerfile — the recipe.** An image is built from a `Dockerfile` — a sequence of instructions:
```dockerfile
FROM python:3.12-slim              # start from a base image (Python pre-installed)
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt   # install deps (Vol 01 Ch 14, in the image)
COPY . .                           # copy your code in
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]   # how to run it
```
Each instruction is a *layer* (cached — unchanged layers rebuild instantly, the key to fast iteration). `docker build` produces the image; `docker run` starts a container from it. The mental model: the Dockerfile is a reproducible script for building your app's entire environment, and the image is the frozen result.

**AI-specific containerization concerns (the node's "for AI").** *Image size* (AI dependencies are *huge* — torch, transformers, CUDA libraries can make images gigabytes; use slim base images, multi-stage builds to discard build-time deps, and `.dockerignore` to exclude junk — a bloated image is slow to push/pull/deploy). *GPU access* (if you self-serve models, the container needs GPU passthrough — NVIDIA's container runtime — a real complexity for AI, though API-based systems like yours mostly avoid it). *Secrets* (Vol 08 — *never* bake API keys into the image, which is a distributable artifact; inject them at *runtime* via environment variables — Ch 24's secrets management; a key baked into an image is a key leaked to everyone who has the image). *Layer caching for iteration* (copy `requirements.txt` and install *before* copying code, so code changes don't invalidate the dependency-install layer — the fast-iteration trick). *Model weights* (if bundling models, they bloat the image — often better to load from storage at runtime).

**Verification.** Containerize a small service (your Ch 1 FastAPI backend, or a slice): write the Dockerfile, build the image, run the container, and hit its endpoint — confirm it works *in the container*. Then the reproducibility proof: run it on a *different* environment (a clean directory, a teammate's machine, a cloud sandbox) and confirm identical behavior. Check the image size (and optimize it — multi-stage, slim base). Confirm secrets are *not* baked in (inspect the image, confirm no keys). The containerized-service-running + the size optimization + the secrets-not-baked check = proof.

## Why It Matters
Where this appears in real systems and jobs: containerize a small service myself.

## Hands-On
Build it (est. 1 day): write a Dockerfile for your FastAPI backend (Ch 1) → build the image → run the container, hit the endpoint, confirm it works → optimize (slim base, layer ordering for cache, `.dockerignore`, check the size) → prove reproducibility (run in a clean/different environment) → confirm runtime secret injection (keys via env, not baked). This is the packaging for every deployment ahead (Ch 20, 34). Tag `prod-v0.4`. The Dockerfile + the running container + the size optimization + the reproducibility proof = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does Docker isolate that a venv doesn't, and what guarantee does that provide?
2. Walk a Dockerfile's instructions and what "layers" and "caching" mean for iteration.
3. Name three AI-specific containerization concerns and how each is handled.
4. Why must secrets be injected at runtime, not baked into the image?
5. What's the layer-ordering trick for fast iteration, and why does it work?


---

## Wikilinks
[[python-environments]]
[[sandboxing-isolation]]
[[data-versioning-reproducibility]]
[[build-container-deployment]]
[[secrets-cost-engineering]]

## Status log
- Started: 2026-07-21
- Finished: null