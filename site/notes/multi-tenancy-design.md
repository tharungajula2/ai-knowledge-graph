## ELI5
One user is easy; *many* users sharing one system, each seeing only their own data, is where real product architecture begins. The node summary: **tenant isolation strategies, Row Level Security (RLS) policies, and per-tenant rate/resource limits.** Multi-tenancy is how one deployed system serves many customers (tenants) *safely* — each tenant's data, usage, and experience isolated from the others. Get it right and one system scales to thousands of users; get it wrong and one user sees another's data (the catastrophic breach that ends products).

## The Real Explanation
**What multi-tenancy is — one system, many isolated tenants.** A *tenant* is an isolated customer (a user, a team, an organization) in a shared system. Multi-tenancy means *one* deployed application and (usually) *one* database serving *all* tenants, with each tenant's data and experience *isolated* — tenant A never sees tenant B's data, never affects tenant B's performance, never exceeds their share of resources. The alternative (one deployment per tenant) doesn't scale (thousands of deployments to manage); multi-tenancy (shared infrastructure, logical isolation) is how SaaS works. The core challenge: *isolation without separation* — everyone shares the infrastructure, but each is walled off logically.

**The isolation strategies (the spectrum from shared to separated).** *Row-level (shared everything)*: all tenants' data in the same tables, with a `tenant_id` column and *every query filtered by it* — cheapest, most scalable, but isolation depends on *never* forgetting the filter (one query missing `WHERE tenant_id = ...` leaks all tenants' data — the catastrophic bug). *Schema-level*: each tenant gets their own schema (set of tables) in the shared database — more isolation, more overhead. *Database-level*: each tenant gets their own database — strong isolation, least sharing, most overhead. The judgment (Vol 05 Ch 4's shared-state tax, for tenants): more sharing = cheaper and more scalable but weaker isolation; more separation = stronger isolation but more overhead. Most SaaS uses row-level with *enforced* filtering (below) because it scales best — *if* the enforcement is architectural, not manual.

**RLS — making row-level isolation architectural (Ch 9's crown feature, cashing in).** The danger of row-level is the forgotten filter (vigilance — one bad query breaches everyone). Row-Level Security (Ch 9) removes the danger by enforcing the filter *in the database*: an RLS policy (`tenant_id = current_tenant()`) means the database *itself* refuses to return other tenants' rows — *even if the application query forgets the filter*. This is Vol 08's "security is architecture, not vigilance" as the multi-tenancy foundation: isolation you *can't forget* because it's enforced below the application. RLS turns "every developer must remember to filter every query correctly forever" (impossible) into "the database enforces isolation structurally" (reliable). For multi-tenant systems, RLS isn't a nice-to-have — it's the difference between isolation you can trust and isolation one bug away from a breach.

**Per-tenant limits — the noisy-neighbor problem.** Isolation isn't just data — it's *resources*. Without limits, one tenant can starve the others: a tenant hammering your API (Ch 28's rate limiting) slows everyone; a tenant running expensive agents (Vol 04 Ch 17) burns shared budget; a tenant's huge dataset degrades shared queries. The "noisy neighbor" must be contained with *per-tenant limits*: rate limits (Ch 28 — per-tenant request caps), resource quotas (compute, storage), and cost caps (Ch 23 — per-tenant budgets, so one tenant can't run up your whole bill). This is fairness-by-architecture — each tenant gets their bounded share, and one tenant's behavior can't degrade another's experience (the isolation promise, extended from data to performance to cost).

## Why It Matters
Where this appears in real systems and jobs: Tenant isolation strategies, Row Level Security (RLS) policies, and per-tenant rate/resource limits.

## Hands-On
Design multi-tenancy for your system (concept node, concrete): (1) If your agent-lab served many users, design the isolation: which strategy (row-level with RLS, almost certainly), the `tenant_id` model, and the RLS policies that enforce data isolation *architecturally*. (2) Test the architecture (Ch 9): with RLS on, write a query that *forgets* the tenant filter and confirm the database *still* isolates (the "forgotten filter can't breach" proof — the whole point of RLS). (3) Design per-tenant limits: rate, resource, and cost caps (Ch 23/28) that contain the noisy neighbor. The isolation design + the RLS-catches-forgotten-filter proof + the per-tenant-limits design = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is a tenant, and what's the core challenge of multi-tenancy (isolation without separation)?
2. Recite the isolation strategies (row/schema/database) and the sharing-vs-isolation trade.
3. How does RLS make row-level isolation architectural, and what catastrophic bug does it prevent?
4. Why is "security is architecture, not vigilance" the multi-tenancy foundation?
5. Explain the noisy-neighbor problem and the three per-tenant limits that contain it.


---

## Wikilinks
[[supabase-deep-dive]]
[[least-privilege-tools]]
[[rate-limiting-logs]]
[[secrets-cost-engineering]]
[[authn-vs-authz]]

## Status log
- Started: 2026-07-21
- Finished: null