import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { defaultSiteReviewsRow } from "./defaultGuestReviews";
import { guestReview } from "./schema";
import { requireAdmin } from "./adminAuth";

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

/* ------------------------------------------------------------------ */
/*  Input size limits for admin review payloads                       */
/* ------------------------------------------------------------------ */

const MAX_REVIEWS = 200;
const MAX_FEATURED_ORDER = 200;
const MAX_AUTHOR_LENGTH = 200;
const MAX_QUOTE_LENGTH = 5000;
const MAX_EXCERPT_LENGTH = 1000;

const replacePayload = {
  reviews: v.array(guestReview),
  featuredAuthorOrder: v.array(v.string()),
} as const;

/** Called only from admin functions (JWT auth), not from clients. */
export const replaceInternal = internalMutation({
  args: replacePayload,
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx, args) => {
    // Boundary validation
    if (args.reviews.length > MAX_REVIEWS) {
      throw new Error(`reviews exceeds ${MAX_REVIEWS}`);
    }
    if (args.featuredAuthorOrder.length > MAX_FEATURED_ORDER) {
      throw new Error(`featuredAuthorOrder exceeds ${MAX_FEATURED_ORDER}`);
    }
    for (const r of args.reviews) {
      if (r.author.length > MAX_AUTHOR_LENGTH) {
        throw new Error(`review author exceeds ${MAX_AUTHOR_LENGTH} characters`);
      }
      if (r.quote.length > MAX_QUOTE_LENGTH) {
        throw new Error(`review quote exceeds ${MAX_QUOTE_LENGTH} characters`);
      }
      if (r.homeExcerpt !== undefined && r.homeExcerpt.length > MAX_EXCERPT_LENGTH) {
        throw new Error(`review homeExcerpt exceeds ${MAX_EXCERPT_LENGTH} characters`);
      }
    }

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

/** Called from `internal.seed.seedAll` and admin functions only. */
export const applyDefaultSeed = internalMutation({
  args: {},
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx) => writeDefaultSiteReviews(ctx),
});

/* ------------------------------------------------------------------ */
/*  Public admin mutations — authenticated via Clerk JWT               */
/* ------------------------------------------------------------------ */

/**
 * Replace all reviews. Requires admin auth.
 */
export const replaceReviews = mutation({
  args: replacePayload,
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx, args): Promise<any> => {
    await requireAdmin(ctx);
    return await ctx.runMutation(internal.reviews.replaceInternal as any, args);
  },
});

/**
 * Seed reviews with defaults. Requires admin auth.
 */
export const seedDefaultReviews = mutation({
  args: {},
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx): Promise<any> => {
    await requireAdmin(ctx);
    return await ctx.runMutation(internal.reviews.applyDefaultSeed as any, {});
  },
});

