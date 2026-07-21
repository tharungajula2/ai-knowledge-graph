## ELI5
Once you're in the cloud (Ch 17), you must choose *how* your code runs — and the options span a spectrum from "the cloud handles everything" to "you handle everything." The node summary: **serverless containers vs virtual machines vs managed Kubernetes clusters; structural trade-offs.** This is the compute-model decision (Ch 6's hosting axes, now the cloud-native version), and choosing well means matching the compute model to your system's actual needs rather than defaulting to what's trendy or what a tutorial used.

## The Real Explanation
**The three models, on the control-vs-convenience spectrum.**
1. *Serverless containers* (Cloud Run, AWS Fargate/App Runner, and kin — the convenience end): you provide a container (Ch 5), the platform runs it *on demand*, *scales it automatically* (including to zero — Ch 6's scale-to-zero), and you manage *no servers*. You pay per use, get autoscaling free, and have near-zero ops burden. Limits: less control (the platform's constraints — request timeouts Ch 6, cold starts), and can get expensive at very high steady load. *The sweet spot for most API backends*, and almost certainly right for your agent-lab (Ch 20 deploys here) — managed, cheap-when-idle, scales when needed.
2. *Virtual Machines* (EC2, Compute Engine — the control end): a raw virtual computer you fully control — install anything, run anything, tune everything. Maximum flexibility and control, but *maximum ops burden* (you manage the OS, security patches, scaling, uptime — Vol 08's whole threat surface is now yours to patch). Right when you need full control, special software, or steady predictable high load where always-on is economical. For a solo builder shipping fast, usually *more than you need* (the ops burden competes with building).
3. *Managed Kubernetes* (GKE, EKS — the orchestration end, Ch 21): a system for orchestrating *many* containers across *many* machines at scale — powerful, industry-standard for large systems, and *complex*. Right when you have many services, need sophisticated orchestration, and have the scale (and team) to justify the complexity. For a solo agent-lab, *overkill* (you'd spend your 45 days on Kubernetes YAML instead of agents — Ch 21 teaches it conceptually precisely so you know when *not* to reach for it).

**The structural trade-offs (the decision framework).** *Ops burden* (serverless: minimal → VMs: high → k8s: high-but-abstracted-at-scale) — how much of your time goes to infrastructure vs building. *Control* (serverless: constrained → VMs: total → k8s: extensive) — how much you can customize. *Scaling* (serverless: automatic → VMs: manual/you-build-it → k8s: sophisticated-automatic) — how growth is handled. *Cost shape* (serverless: per-use, cheap-idle → VMs: fixed, wasteful-idle → k8s: fixed-cluster + scaling). *Complexity* (serverless: low → VMs: medium → k8s: high). The judgment, consistent with every ladder in this curriculum: *least infrastructure that meets your needs* (least-ops — the sibling of least-autonomy, least-privilege). For your agent-lab: serverless containers win (managed, scales-to-zero for a mostly-idle portfolio project, minimal ops so you build agents not infrastructure) — and knowing *why* the fancier options are wrong *for this case* is the senior judgment.

**The AI-workload lens (matching compute to AI needs).** Your workload shapes the choice: *API-calling agents* (like yours — the compute is lightweight, you're calling models not running them) fit serverless perfectly (light CPU, spiky traffic, scale-to-zero). *Self-hosted models* (GPU-heavy, Vol 01 Ch 11) need VMs or specialized GPU services (serverless GPU is limited/expensive) — a different world. *Background workers* (Ch 27) need persistent processes (serverless request/response doesn't fit long background loops — you'd use a worker service or a VM). *High-scale multi-service systems* justify k8s. The lesson: there's no universal answer; the *workload's shape* (compute intensity, traffic pattern, statefulness, scale) picks the model — and for your agent-lab's shape, serverless is the clear, deliberate choice.

## Why It Matters
Where this appears in real systems and jobs: Serverless containers vs virtual machines vs managed Kubernetes clusters; structural trade-offs.

## Hands-On
Make the compute decision (concept node, concrete): (1) For your agent-lab, evaluate all three models against the structural trade-offs (ops, control, scaling, cost, complexity) — and write the reasoned choice (serverless, almost certainly) *with* the explicit reason the other two are wrong *for this case*. (2) The workload analysis: characterize your agent-lab's workload (API-calling, spiky, mostly-idle, has background work) and show how its shape picks the model. (3) The counterfactual: name a change to your system that *would* justify VMs or k8s (self-hosting a model → VM/GPU; many services at scale → k8s) — so you know the boundaries of your choice. The three-model evaluation + the workload analysis + the counterfactual = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Place the three compute models on the control-vs-convenience spectrum with each one's core trade.
2. Recite the five structural trade-offs (ops, control, scaling, cost, complexity).
3. Why is serverless the right choice for your agent-lab, and why are VMs and k8s wrong *for this case*?
4. How does workload shape (compute, traffic, state, scale) pick the compute model?
5. Name a change that would justify each of VMs and Kubernetes.


---

## Wikilinks
[[deploying-backends]]
[[docker-for-ai]]
[[kubernetes-essentials]]
[[build-container-deployment]]
[[cloud-fundamentals]]

## Status log
- Started: 2026-07-21
- Finished: null