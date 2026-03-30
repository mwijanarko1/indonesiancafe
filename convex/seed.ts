import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const createdOrUpdated = v.union(v.literal("created"), v.literal("updated"));

/** Default site menu only (`npx convex run seed:seedMenu` / `--prod`). */
export const seedMenu = action({
  args: {},
  returns: createdOrUpdated,
  handler: async (ctx): Promise<"created" | "updated"> => {
    return await ctx.runMutation(internal.menu.applyDefaultSeed, {});
  },
});

/** Guest reviews only (`npx convex run seed:seedReviews` / `--prod`). */
export const seedReviews = action({
  args: {},
  returns: createdOrUpdated,
  handler: async (ctx): Promise<"created" | "updated"> => {
    return await ctx.runMutation(internal.reviews.applyDefaultSeed, {});
  },
});

/** Menu + reviews (`npx convex run seed:seedAll` / `--prod`). */
export const seedAll = action({
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
