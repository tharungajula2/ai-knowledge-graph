## ELI5
Two words people constantly confuse, and confusing them causes breaches. The node summary: **Authentication vs Authorization, JWT validation, custom API key tables, and credential authorization roles.** *Authentication* (authN) is *who are you?*; *authorization* (authZ) is *what are you allowed to do?* — two distinct questions, two distinct mechanisms, and getting the boundary right is foundational security (Vol 08). This chapter is the identity-and-access layer every multi-user production system needs.

## The Real Explanation
**AuthN vs AuthZ — the fundamental distinction.** *Authentication* establishes *identity*: proving you are who you claim (login with password, OAuth Ch 7, an API key). It answers "who is this request from?" *Authorization* establishes *permissions*: what that identity is allowed to do (can this user access this resource? take this action? — Vol 08 Ch 8's least-privilege). It answers "is this identity allowed to do this?" The order matters: authenticate *first* (establish identity), then authorize (check that identity's permissions). Confusing them is dangerous: authenticating without authorizing (anyone logged in can do anything — the missing-authZ breach, where a valid user accesses *other* users' data because you checked *who* they were but not *what* they're allowed); authorizing without authenticating (checking permissions on an unverified identity — meaningless). Both, in order, always.

**JWT — stateless authentication (the common mechanism).** A JWT (JSON Web Token) is a signed token proving identity: on login, the server issues a JWT (containing the user's identity and claims, *signed* by the server); the client sends it with each request; the server *validates the signature* (proving it's genuine and unmodified — Vol 08 Ch 10's tamper-evidence) and reads the identity from it — *without* a database lookup (the token is self-contained — stateless, scalable Ch 28). The node's "JWT validation" is this signature-check-and-claims-read. Critical security (Vol 08): validate the signature *always* (an unvalidated JWT is trivially forged — the classic auth bypass), check expiry (Ch 7's token rotation), and never put secrets in a JWT (it's readable by anyone — signed, not encrypted). JWTs are how most modern APIs authenticate statelessly.

**API keys — machine authentication (the node's "custom API key tables").** For *programmatic* access (a script, a service, another system calling your API — not a human logging in), *API keys* are the mechanism (Vol 02 Ch 1 — the keys you *used*, now the keys you *issue*). You maintain an *API key table*: each key maps to an identity, a set of permissions (authZ — Vol 08 Ch 8's scoped capabilities: this key can read, that key can write), a rate limit (Ch 27, per-key), and metadata (created, last-used, revocable). Issuing, scoping, rotating, and revoking API keys is how you give programmatic clients *authenticated, authorized, bounded* access — least-privilege (Vol 08 Ch 8) as an API-key system. The "credential authorization roles" the node names: keys (and users) get *roles* (bundles of permissions — admin, read-only, agent-runner) so authZ is manageable (assign a role, not individual permissions).

**Putting it together — the auth layer for your system.** Your agent-lab's auth: *humans* authenticate via login/OAuth (Ch 7) → get a JWT → each request's JWT is validated (authN) → their role/permissions are checked per action (authZ, Vol 08 Ch 8). *Programmatic clients* authenticate via API keys → the key's identity and permissions are looked up → authorized per action. *Every consequential action* (Vol 08 Ch 9's gate) checks authZ (is this identity allowed?). And it composes with multi-tenancy (Ch 25 — the authenticated identity determines the tenant, RLS enforces isolation) and rate limiting (Ch 27 — per-identity limits). Auth is the foundation the whole multi-user, secure, multi-tenant system stands on — get it right, and identity-and-permission flows correctly through everything; get it wrong, and it's the breach.

## Why It Matters
Where this appears in real systems and jobs: Authentication vs Authorization, JWT validation, custom API key tables, and credential authorization roles.

## Hands-On
Build/design the auth layer (concept node, concrete): (1) Implement JWT authentication for your API (Ch 1): issue on login, validate signature and expiry on each request, extract identity — and test the security (a forged/expired JWT is rejected — the auth-bypass prevented). (2) Build an API key table (identity, scoped permissions, role, rate limit, revocable) and authenticate a programmatic client with it. (3) Add authZ: role-based permission checks on actions (Vol 08 Ch 8), and confirm a user *can't* do what their role forbids (the missing-authZ breach, prevented). The JWT auth + the API key table + the authZ-enforcement demo = the note; this underpins multi-tenancy (Ch 25) and the gate (Vol 08 Ch 9).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish authentication from authorization — the two questions, and why order matters.
2. What's the missing-authZ breach (authenticated but not authorized), and why is it dangerous?
3. How does JWT enable stateless auth, and why must the signature always be validated?
4. What's in an API key table, and how does it implement least-privilege for programmatic access?
5. How does the auth layer compose with multi-tenancy and rate limiting?


---

## Wikilinks
[[google-oauth-flow]]
[[least-privilege-tools]]
[[multi-tenancy-design]]
[[build-proposal-gate]]
[[rate-limiting-logs]]

## Status log
- Started: 2026-07-21
- Finished: null