import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const createdOrUpdated = v.union(v.literal("created"), v.literal("updated"));

/**
 * Default site menu only. Not callable from the public Convex API.
 * CLI: `npx convex run internal.seed.seedMenu` (add `--prod` for production).
 */
export const seedMenu = internalAction({
  args: {},
  returns: createdOrUpdated,
  handler: async (ctx): Promise<"created" | "updated"> => {
    return await ctx.runMutation(internal.menu.applyDefaultSeed, {});
  },
});

/**
 * Guest reviews only.
 * CLI: `npx convex run internal.seed.seedReviews` / `--prod`.
 */
export const seedReviews = internalAction({
  args: {},
  returns: createdOrUpdated,
  handler: async (ctx): Promise<"created" | "updated"> => {
    return await ctx.runMutation(internal.reviews.applyDefaultSeed, {});
  },
});

/**
 * Menu + reviews.
 * CLI: `npx convex run internal.seed.seedAll` / `--prod`.
 */
/**
 * Opening hours only.
 * CLI: `npx convex run internal.seed.seedOpeningHours` / `--prod`.
 */
export const seedOpeningHours = internalAction({
  args: {},
  returns: createdOrUpdated,
  handler: async (ctx): Promise<"created" | "updated"> => {
    return await ctx.runMutation(internal.openingHours.applyDefaultSeed, {});
  },
});

export const seedAll = internalAction({
  args: {},
  returns: v.object({
    menu: createdOrUpdated,
    reviews: createdOrUpdated,
    openingHours: createdOrUpdated,
  }),
  handler: async (
    ctx,
  ): Promise<{
    menu: "created" | "updated";
    reviews: "created" | "updated";
    openingHours: "created" | "updated";
  }> => {
    const menu = await ctx.runMutation(internal.menu.applyDefaultSeed, {});
    const reviews = await ctx.runMutation(internal.reviews.applyDefaultSeed, {});
    const openingHours = await ctx.runMutation(internal.openingHours.applyDefaultSeed, {});
    return { menu, reviews, openingHours };
  },
});

/**
 * Add a Clerk user ID to the admins table.
 *
 * CLI:
 *   npx convex run internal.seed.addAdmin '{"userId": "user_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
 *
 * Add `--prod` for production:
 *   npx convex run internal.seed.addAdmin '{"userId": "user_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}' --prod
 */
export const addAdmin = internalMutation({
  args: {
    userId: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      return `Admin user ${userId.slice(0, 12)}... is already registered.`;
    }

    await ctx.db.insert("admins", { userId });
    return `Admin user ${userId.slice(0, 12)}... added successfully.`;
  },
});
