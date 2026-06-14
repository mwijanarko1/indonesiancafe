/**
 * Admin authorization helpers using Clerk JWT identity.
 *
 * Every admin mutation/query calls requireAdmin() to verify:
 * 1. The JWT is valid (Clerk user authenticated by Convex auth)
 * 2. The Clerk user's `sub` (userId) exists in the `admins` table
 * 3. The subject is not currently locked out (DB-backed lockout)
 *
 * Lockout escalation (DB-backed, per subject):
 *   < 3 failed attempts  → no lockout
 *   3 failed attempts     → 5 minute block
 *   4 failed attempts     → 15 minute block
 *   5 failed attempts     → 25 minute block
 *   …arithmetic: lockoutMinutes = 5 + 10 * (failedAttempts - 3)
 *
 * Failed attempts are recorded only when the subject is NOT currently
 * in an active lockout window (i.e. only "post-block" attempts escalate).
 * On successful admin auth the lockout row is deleted.
 *
 * Because Convex queries cannot write, lockout RECORDING happens in the
 * `admins.isAdmin` mutation (the primary Next.js gate). The read-only
 * `requireAdmin` helper performs a read-only lockout check so that
 * queries and mutations both reject locked-out subjects early.
 *
 * App-level rate limiting is applied keyed by Clerk subject.
 * Uses an in-memory sliding window (no DB writes needed), so it
 * works safely in both query and mutation contexts. Counters reset
 * on Convex cold starts — acceptable for soft defence-in-depth.
 *
 * Import from convex/ directory:
 *   import { requireAdmin, checkRateLimit, getLockoutRecord } from "./adminAuth";
 *   import type { QueryCtx, MutationCtx } from "./_generated/server";
 */

import { ConvexError } from "convex/values";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Doc } from "./_generated/dataModel";

type AdminCtx = Pick<GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>, "auth" | "db">;

/* ------------------------------------------------------------------ */
/*  Rate limiting                                                      */
/*                                                                     */
/*  In-memory sliding-window counters keyed by Clerk subject.          */
/*  No DB writes → safe from both query and mutation contexts.         */
/*  Thresholds are per-subject, per-scope.                             */
/* ------------------------------------------------------------------ */

interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
}

/**
 * Per-subject rate limit thresholds.
 *
 * - `admin-check`: 30 req / 60 s — `admins.isAdmin` is called on every
 *   admin page navigation (layout mount + page load = 2 calls).
 * - `admin-action`: 20 req / 60 s — dashboard load performs a few
 *   admin-action queries; user actions (toggles, edits, orders) are occasional.
 */
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "admin-check": { windowMs: 60_000, maxRequests: 30 },
  "admin-action": { windowMs: 60_000, maxRequests: 20 },
};

/** In-memory store — survives within a single Convex server process. */
const requestLog = new Map<string, number[]>();

/**
 * Throws a `ConvexError` if `subject` has exceeded the rate limit
 * for the given `scope`. Safe to call from queries (no writes).
 *
 * @param subject - Clerk `subject` from the authenticated identity.
 * @param scope   - Key into `RATE_LIMITS` (e.g. `"admin-check"`).
 */
export function checkRateLimit(subject: string, scope: string): void {
  const config = RATE_LIMITS[scope];
  /* c8 ignore next 3 */
  if (!config) {
    return; // unknown scope – fail open rather than unexpectedly block
  }

  const key = `rl:${subject}:${scope}`;
  const now = Date.now();
  const cutoff = now - config.windowMs;

  let timestamps = requestLog.get(key) ?? [];
  // Prune entries outside the current window
  timestamps = timestamps.filter((t) => t > cutoff);

  if (timestamps.length >= config.maxRequests) {
    throw new ConvexError(`Rate limit exceeded for ${scope}. Try again later.`);
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
}

/* ------------------------------------------------------------------ */
/*  Lockout helpers (read-only — safe for queries and mutations)       */
/* ------------------------------------------------------------------ */

/**
 * Fetch the lockout document for `subject`, or null.
 * Safe from queries (read-only).
 */
export async function getLockoutRecord(
  ctx: AdminCtx,
  subject: string,
): Promise<Doc<"adminLockouts"> | null> {
  return await ctx.db
    .query("adminLockouts")
    .withIndex("by_subject", (q) => q.eq("subject", subject))
    .unique();
}

/**
 * Throw a `ConvexError` if `subject` is currently locked out.
 * Safe from queries (read-only).
 */
export async function checkSubjectLockout(
  ctx: AdminCtx,
  subject: string,
): Promise<void> {
  const lockout = await getLockoutRecord(ctx, subject);
  if (lockout && lockout.lockedUntil > Date.now()) {
    const remaining = Math.ceil((lockout.lockedUntil - Date.now()) / 60_000);
    throw new ConvexError(
      `Too many failed admin attempts. Try again in ${remaining} minute(s).`,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Admin authorisation                                                */
/* ------------------------------------------------------------------ */

/**
 * Verifies the caller is authenticated, not locked out, and listed as
 * an admin. Returns the Clerk `subject` (userId) on success.
 * Throws on failure.
 *
 * **Read-only** — does not write to the DB, so it works in both query
 * and mutation contexts. Lockout recording is handled by the
 * `admins.isAdmin` mutation (the Next.js gate).
 *
 * Rate-limited under the `"admin-action"` scope after identity
 * and admin membership are confirmed.
 */
export async function requireAdmin(ctx: AdminCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }

  const { subject } = identity;
  if (!subject) {
    throw new ConvexError("Invalid identity: missing subject");
  }

  // Defence-in-depth: read-only lockout check
  await checkSubjectLockout(ctx, subject);

  const admin = await ctx.db
    .query("admins")
    .withIndex("by_userId", (q) => q.eq("userId", subject))
    .unique();

  if (!admin) {
    throw new ConvexError("Not authorized");
  }

  // Rate limit after successful authorisation
  checkRateLimit(subject, "admin-action");

  return subject;
}
