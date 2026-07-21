## ELI5
Your agent-lab reads your Gmail and Calendar (Ch 8) — but how does it get *permission* to, securely, without you handing it your Google password? The node summary: **build a Google OAuth2 client with flow initialization, token storage/rotation, and local redirection handlers; verify with a web authentication login.** OAuth is how modern apps get *scoped, revocable, delegated access* to your accounts on other services — "let this app read my calendar" without giving it your password or full account. This build is the authentication foundation for every third-party integration, and it's a rite of passage every backend engineer goes through.

## The Real Explanation
**What OAuth solves — delegated authorization without password sharing.** The old, terrible way: give the app your Google password (it can now do *anything*, forever, and if it's breached your Google account is breached — Vol 08's nightmare). OAuth's way: you authorize the app to do *specific things* (read calendar, read email — *scopes*, Vol 08 Ch 8's least-privilege as a protocol), it gets a *token* (not your password) that grants *only those scopes*, and you can *revoke* it anytime without changing your password. It's least-privilege, delegation, and revocability, standardized — exactly the security principles of Vol 08, applied to account access.

**The OAuth2 flow — the dance (the "flow initialization" and "redirection handlers").** The authorization-code flow, step by step: (1) your app redirects the user to Google's consent screen, requesting specific scopes; (2) the user logs in *to Google* (never to your app — your app never sees the password) and approves the scopes; (3) Google redirects *back* to your app's *redirect handler* with a temporary *authorization code*; (4) your app exchanges that code (server-to-server, with your app's client secret) for an *access token* (short-lived, grants API access) and a *refresh token* (long-lived, used to get new access tokens); (5) your app uses the access token to call Google APIs (Ch 8). The redirect handler (step 3) is the piece that catches Google's callback — a specific endpoint in your FastAPI app (Ch 1). Understanding this dance is understanding how *all* OAuth works (GitHub, Slack, every "Sign in with X" — same flow).

**Token storage and rotation (the "token storage/rotation" — the security-critical part).** Tokens are *credentials* (Vol 08 — as sensitive as passwords): *store them securely* (encrypted, in your database, scoped to the user — never in code, never in logs, never in the image Ch 5); *rotate them* (access tokens *expire* — minutes to an hour — so you use the *refresh token* to get a new access token automatically when the old expires — "rotation"; a well-built client refreshes transparently, so API calls never fail from expiration); *handle revocation* (the user revokes access at Google — your tokens stop working — handle it gracefully, prompt re-auth); *protect the refresh token especially* (it's the long-lived key — its leak is the serious breach). This is Vol 08 Ch 10's credential handling, made concrete for OAuth.

**Verification — web authentication login, per the node.** The full flow works end to end: (1) the user clicks "connect Google," gets redirected to consent; (2) approves; (3) your redirect handler catches the callback, exchanges the code for tokens; (4) tokens are stored securely; (5) an API call succeeds with the access token; (6) rotation works (expire the access token, confirm auto-refresh); (7) revocation is handled (revoke, confirm graceful re-auth prompt). Test the security: tokens never appear in logs, storage is encrypted, the refresh token is protected.

## Why It Matters
Where this appears in real systems and jobs: Build a Google OAuth2 client with flow initialization, token storage/rotation, and local redirection handlers; verify with a web authentication login.

## Hands-On
Build it (est. 1-1.5 days): register an OAuth app in Google Cloud Console (client ID/secret, redirect URI, scopes) → the flow-init endpoint (redirect to consent) → the redirect handler (catch callback, exchange code for tokens — a FastAPI route, Ch 1) → secure token storage (encrypted, per-user, in your DB Ch 4) → transparent rotation (auto-refresh on expiry) → revocation handling → the full-login test + the security checks (no tokens in logs, encrypted storage). This is RESURRECTION's auth foundation and the gate to Ch 8's readers. Tag `prod-v0.5`. The working OAuth login + the rotation demo + the token-security audit = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does OAuth solve, and why is it vastly safer than password-sharing? Connect to Vol 08's least-privilege.
2. Walk the OAuth2 authorization-code flow's five steps, and what the redirect handler does.
3. Why does the app never see the user's password, and why does that matter?
4. Explain token rotation — access vs refresh tokens, and why rotation makes API calls not fail on expiry.
5. Why is the refresh token especially sensitive, and what are the token-storage security rules?


---

## Wikilinks
[[authn-vs-authz]]
[[gmail-calendar-read]]
[[secrets-cost-engineering]]
[[build-fastapi-backend]]
[[least-privilege-tools]]

## Status log
- Started: 2026-07-21
- Finished: null