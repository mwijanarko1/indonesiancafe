# Code Context

## Files Retrieved
1. `src/components/admin/AdminSignInForm.tsx` (lines 1-165) — Clerk sign-in form, client component
2. `convex/adminAuth.ts` (lines 1-116) — `requireAdmin()`, `checkRateLimit()` (in-memory sliding window)
3. `convex/admins.ts` (lines 1-19) — `admins.isAdmin` query (checks Clerk JWT + admins table)
4. `src/lib/server/admin-auth.ts` (lines 1-39) — Server-side helper: `isClerkUserAdmin(token)` calls Convex via HTTP
5. `src/app/admin/layout.tsx` (lines 1-46) — Admin layout: checks Clerk auth + admin status, redirects to `/sign-in` on failure
6. `src/app/admin/page.tsx` (lines 1-112) — Admin dashboard page, repeats auth check
7. `convex/schema.ts` (lines 94-98) — `admins` table schema: `{ userId: string }`, indexed by `by_userId`
8. `convex/auth.config.ts` (lines 1-13) — Clerk JWT provider config for Convex

## Key Code

### AdminSignInForm.tsx — the sign-in entry point
- Calls `signIn.password({ identifier, password })` then `signIn.finalize()` (Clerk SDK)
- On Clerk password error: displays error message from Clerk (line 59-61)
- On success: redirects to `/admin` (line 67-68)
- **No server-side visibility into wrong-password attempts** — Clerk handles auth entirely client-side

### admin/layout.tsx — server-side gate
- Calls `auth()` (Clerk server SDK) → if no `userId`, redirect to `/sign-in` (line 16-18)
- Calls `isClerkUserAdmin(token)` → hits Convex `admins.isAdmin` → if false, redirect to `/sign-in` (line 25-27)
- The redirect back to `/sign-in` is the observable signal for "authenticated but not admin"

### convex/adminAuth.ts — existing rate limiting
- In-memory `Map<string, number[]>` per subject+scope (line 57)
- Two scopes: `admin-check` (30 req/60s), `admin-action` (20 req/60s)
- Only applied **after** successful identity+admin check (line 115-116)
- **Resets on Convex cold start** — not durable

## Architecture
```
User → [Client] AdminSignInForm
         │ signIn.password()  ← Clerk handles auth, returns error or success
         │ signIn.finalize()
         ▼
[Server] /admin/layout.tsx
         │ auth() → userId?
         │ isClerkUserAdmin(token)
         │   → Convex HTTP: admins.isAdmin (clerk JWT → db lookup)
         │   → if not admin, redirect /sign-in
         ▼
[Convex] admins.isAdmin / requireAdmin
         │ ctx.auth.getUserIdentity() → subject
         │ db.query("admins").withIndex("by_userId")...
         │ checkRateLimit(subject, scope) — in-memory only
```

## What Counts as "Wrong Auth Attempt" (observable in code)

| Attempt type | Where observable | App code can detect? |
|---|---|---|
| Wrong Clerk password | Client-side only (`AdminSignInForm.tsx` line 54-61) | **Indirectly** — Clerk error returned to client, never hits server |
| Valid Clerk login, not in admins table | Server-side (`layout.tsx` line 25-27, `adminAuth.ts` line 108-110) | **Yes** — redirect or `requireAdmin` throws |
| Missing/bad JWT | Server-side (`adminAuth.ts` line 98-100) | **Yes** — "Not authenticated" error |
| Direct Convex call without auth | Server-side (`adminAuth.ts` line 98-100) | **Yes** — same as above |

**Critical gap**: The most common attack vector (wrong password) is opaque to the server. Clerk never exposes failed password events to our backend — no webhook is configured (`convex/http.ts` is empty, no Clerk webhook endpoint exists).

## Start Here
`src/components/admin/AdminSignInForm.tsx` — This is where password attempts happen. To implement lockout, you must either:
1. Add a client-side check before calling `signIn.password()` that queries Convex for remaining attempts.
2. OR configure a Clerk Webhook (`session.created` / `sign_in.created`) to receive failed attempt signals server-side.

## Feasibility & Implementation Options

### Option A: Pure Convex mutation-based (recommended)
1. Create a Convex table `loginAttempts: defineTable({ identifier: v.string(), attempts: v.number(), lastAttempt: v.number(), blockedUntil: v.optional(v.number()) }).index("by_identifier", ["identifier"])`
2. Create a mutation `recordFailedAttempt` — called from client **before** `signIn.password()` OR from a Clerk webhook
3. Create a query `getLockoutStatus` — called by `AdminSignInForm` on mount to check if blocked
4. Escalation formula: `blockMs = 5*60*1000 * attemptCount` (5min, 15min, 25min, ... linear, or exponential)
5. Reset block on successful admin access (call from `requireAdmin()` after passing admin check)

**Constraints**: 
- Queries can't write — lockout check must be a query or client-side read
- Mutation calls require client-side RPC — works fine from `AdminSignInForm`
- In-memory rate limiting in `adminAuth.ts` is a separate, non-escalating layer

### Option B: Client-side only (weaker)
- Store attempt count in `localStorage` with timestamps
- Check before calling `signIn.password()`
- **Risk**: easily bypassed by clearing storage or using incognito

### Risks & Open Questions
1. **Wrong-password blindness**: Without a Clerk webhook, we cannot distinguish "wrong password" from "network error" on the server. The client-sent `recordFailedAttempt` approach relies on the client being honest (but a script-kiddie tool calling the Convex mutation directly wouldn't trigger the lockout).
2. **IP vs user identification**: The existing codebase never captures client IP. Lockout would need to key on `identifier` (username) or Clerk `userId` (only available after successful Clerk auth). Pre-auth, only the username `identifier` is known.
3. **Clerk rate limiting already exists**: Clerk itself rate-limits auth endpoints (not visible in this code). App-level lockout is defence-in-depth.
4. **Convex cold-start**: In-memory state in `adminAuth.ts` resets. A DB-backed approach avoids this.

### Suggested Files for Changes
- `convex/schema.ts` — add `loginAttempts` table
- `convex/adminAuth.ts` — add `recordFailedAttempt`, `getLockoutStatus`, `clearLockout` functions
- `src/components/admin/AdminSignInForm.tsx` — call lockout check before `signIn.password()`, call `recordFailedAttempt` on error
- `src/app/admin/layout.tsx` — call `clearLockout` on successful admin access
- `convex/http.ts` — optionally add Clerk webhook endpoint for server-side attempt visibility (stronger but optional)

### Needs parent: No
This scope is self-contained within Convex schema/mutations and the existing `AdminSignInForm` component. The implementer can proceed without parent orchestration.
