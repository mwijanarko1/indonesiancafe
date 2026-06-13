import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin } from "./adminAuth";

export const generateUploadUrlInternal = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getPhotoUrlInternal = internalQuery({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

/* ------------------------------------------------------------------ */
/*  Public admin functions — authenticated via Clerk JWT               */
/* ------------------------------------------------------------------ */

/**
 * Generate a Convex storage upload URL. Requires admin auth.
 */
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx): Promise<any> => {
    await requireAdmin(ctx);
    return await ctx.runMutation(internal.menuPhotos.generateUploadUrlInternal as any, {});
  },
});

/**
 * Get a photo URL from a storage ID. Requires admin auth.
 */
export const getPhotoUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args): Promise<any> => {
    await requireAdmin(ctx);
    return await ctx.runQuery(internal.menuPhotos.getPhotoUrlInternal as any, args);
  },
});
