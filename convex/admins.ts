import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { checkRateLimit, checkSubjectLockout, getLockoutRecord } from "./adminAuth";

/**
 * Check whether the authenticated Clerk user is a registered admin.
 *
 * **Mutation** (not query) because it records failed-attempt lockout state
 * in the `adminLockouts` table for subjects with a valid Clerk JWT who
 * are NOT in the `admins` table.
 *
 * Lockout escalation (per subject):
 *   < 3 failed attempts  → no lockout
 *   3 failed attempts     → 5 minute block
 *   4 failed attempts     → 15 minute block
 *   5 failed attempts     → 25 minute block
 *   … 5 + 10*(failedAttempts - 3) minutes
 *
 * Only attempts when NOT in an active lockout window increment the
 * counter, so rapid retries during a block do not escalate further.
 * Successful auth clears the lockout row entirely.
 */
export const isAdmin = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const { subject } = identity;
    if (!subject) {
      throw new ConvexError("Invalid identity: missing subject");
    }

    // Read-only lockout gate — reject early if currently blocked
    await checkSubjectLockout(ctx, subject);

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", subject))
      .unique();

    if (admin) {
      // Successful auth — clear any previous lockout records
      const existing = await getLockoutRecord(ctx, subject);
      if (existing) {
        await ctx.db.delete(existing._id);
      }
      // Soft secondary rate-limit for successful checks
      checkRateLimit(subject, "admin-check");
      return true;
    }

    // Failed attempt — record / escalate lockout
    const lockout = await getLockoutRecord(ctx, subject);
    const fails = (lockout?.failedAttempts ?? 0) + 1;

    let lockedUntil = 0;
    if (fails >= 3) {
      // arithmetic: 5 + 10*(fails-3) minutes, capped at 24 h safety
      const minutes = Math.min(5 + 10 * (fails - 3), 24 * 60);
      lockedUntil = Date.now() + minutes * 60_000;
    }

    if (lockout) {
      await ctx.db.patch(lockout._id, { failedAttempts: fails, lockedUntil });
    } else {
      await ctx.db.insert("adminLockouts", { subject, failedAttempts: fails, lockedUntil });
    }

    checkRateLimit(subject, "admin-check");
    return false;
  },
});
