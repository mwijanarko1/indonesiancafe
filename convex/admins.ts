import { v } from "convex/values";
import { query } from "./_generated/server";

export const isAdmin = query({
  args: {
    userId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return admin !== null;
  },
});
