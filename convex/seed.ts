import { v } from "convex/values";
import { internalAction } from "./_generated/server";
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
export const seedAll = internalAction({
  args: {},
  returns: v.object({
    menu: createdOrUpdated,
    reviews: createdOrUpdated,
  }),
  handler: async (
    ctx,
  ): Promise<{ menu: "created" | "updated"; reviews: "created" | "updated" }> => {
    const menu = await ctx.runMutation(internal.menu.applyDefaultSeed, {});
    const reviews = await ctx.runMutation(internal.reviews.applyDefaultSeed, {});
    return { menu, reviews };
  },
});
