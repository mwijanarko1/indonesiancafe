import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import { defaultSiteReviewsRow } from "./defaultGuestReviews";
import { guestReview } from "./schema";

type MutationCtx = GenericMutationCtx<DataModel>;

async function writeDefaultSiteReviews(ctx: MutationCtx): Promise<"created" | "updated"> {
  const existing = await ctx.db
    .query("siteReviews")
    .withIndex("by_key", (q) => q.eq("key", "default"))
    .unique();
  if (existing) {
    await ctx.db.replace("siteReviews", existing._id, defaultSiteReviewsRow);
    return "updated";
  }
  await ctx.db.insert("siteReviews", defaultSiteReviewsRow);
  return "created";
}

const siteReviewsPublic = v.object({
  reviews: v.array(guestReview),
  featuredAuthorOrder: v.array(v.string()),
});

/** Public read — no auth. */
export const get = query({
  args: {},
  returns: v.union(v.null(), siteReviewsPublic),
  handler: async (ctx) => {
    const row = await ctx.db
      .query("siteReviews")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (!row) {
      return null;
    }
    return {
      reviews: row.reviews,
      featuredAuthorOrder: row.featuredAuthorOrder,
    };
  },
});

const replacePayload = {
  reviews: v.array(guestReview),
  featuredAuthorOrder: v.array(v.string()),
} as const;

/** Called only from Convex HTTP admin routes (Bearer auth), not from clients. */
export const replaceInternal = internalMutation({
  args: replacePayload,
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx, args) => {
    const doc = { key: "default" as const, ...args };
    const existing = await ctx.db
      .query("siteReviews")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (existing) {
      await ctx.db.replace("siteReviews", existing._id, doc);
      return "updated";
    }
    await ctx.db.insert("siteReviews", doc);
    return "created";
  },
});

/** Called from `internal.seed.seedAll` and HTTP admin only. */
export const applyDefaultSeed = internalMutation({
  args: {},
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx) => writeDefaultSiteReviews(ctx),
});

