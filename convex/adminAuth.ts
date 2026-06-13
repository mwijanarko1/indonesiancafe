/**
 * Admin authorization helpers using Clerk JWT identity.
 *
 * Every admin mutation/query calls requireAdmin() to verify:
 * 1. The JWT is valid (Clerk user authenticated by Convex auth)
 * 2. The Clerk user's `sub` (userId) exists in the `admins` table
 *
 * Import from convex/ directory:
 *   import { requireAdmin } from "./adminAuth";
 *   import type { QueryCtx, MutationCtx } from "./_generated/server";
 */

import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "./_generated/dataModel";

type AdminCtx = Pick<GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>, "auth" | "db">;

/**
 * Verifies the caller is authenticated and listed as an admin.
 * Returns the Clerk `subject` (userId) on success.
 * Throws on failure.
 */
export async function requireAdmin(ctx: AdminCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const { subject } = identity;
  if (!subject) {
    throw new Error("Invalid identity: missing subject");
  }

  const admin = await ctx.db
    .query("admins")
    .withIndex("by_userId", (q) => q.eq("userId", subject))
    .unique();

  if (!admin) {
    throw new Error("Not authorized");
  }

  return subject;
}
