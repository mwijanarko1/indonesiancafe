import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { defaultSiteOpeningHoursRow } from "./defaultOpeningHours";
import { requireAdmin } from "./adminAuth";

type MutationCtx = GenericMutationCtx<DataModel>;

const openingHoursDay = v.object({
  day: v.string(),
  time: v.string(),
});

const siteOpeningHoursPublic = v.object({
  hours: v.array(openingHoursDay),
  footnote: v.string(),
});

async function writeDefaultSiteOpeningHours(
  ctx: MutationCtx,
): Promise<"created" | "updated"> {
  const existing = await ctx.db
    .query("siteOpeningHours")
    .withIndex("by_key", (q) => q.eq("key", "default"))
    .unique();
  if (existing) {
    await ctx.db.replace("siteOpeningHours", existing._id, defaultSiteOpeningHoursRow);
    return "updated";
  }
  await ctx.db.insert("siteOpeningHours", defaultSiteOpeningHoursRow);
  return "created";
}

/** Public read — no auth. */
export const get = query({
  args: {},
  returns: v.union(v.null(), siteOpeningHoursPublic),
  handler: async (ctx) => {
    const row = await ctx.db
      .query("siteOpeningHours")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (!row) {
      return null;
    }
    return {
      hours: row.hours,
      footnote: row.footnote,
    };
  },
});

/* ------------------------------------------------------------------ */
/*  Input size limits for admin opening-hours payload                 */
/* ------------------------------------------------------------------ */

const MAX_HOURS_ENTRIES = 14;
const MAX_DAY_LENGTH = 30;
const MAX_TIME_LENGTH = 100;
const MAX_FOOTNOTE_LENGTH = 1000;

const replacePayload = {
  hours: v.array(openingHoursDay),
  footnote: v.string(),
} as const;

/** Called only from admin functions (JWT auth), not from clients. */
export const replaceInternal = internalMutation({
  args: replacePayload,
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx, args) => {
    // Boundary validation
    if (args.hours.length > MAX_HOURS_ENTRIES) {
      throw new Error(`hours exceeds ${MAX_HOURS_ENTRIES} entries`);
    }
    if (args.footnote.length > MAX_FOOTNOTE_LENGTH) {
      throw new Error(`footnote exceeds ${MAX_FOOTNOTE_LENGTH} characters`);
    }
    for (const h of args.hours) {
      if (h.day.length > MAX_DAY_LENGTH) {
        throw new Error(`day string exceeds ${MAX_DAY_LENGTH} characters`);
      }
      if (h.time.length > MAX_TIME_LENGTH) {
        throw new Error(`time string exceeds ${MAX_TIME_LENGTH} characters`);
      }
    }

    const doc = { key: "default" as const, ...args };
    const existing = await ctx.db
      .query("siteOpeningHours")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (existing) {
      await ctx.db.replace("siteOpeningHours", existing._id, doc);
      return "updated";
    }
    await ctx.db.insert("siteOpeningHours", doc);
    return "created";
  },
});

/** Called from `internal.seed.seedAll` and admin functions only. */
export const applyDefaultSeed = internalMutation({
  args: {},
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx) => writeDefaultSiteOpeningHours(ctx),
});

/* ------------------------------------------------------------------ */
/*  Public admin mutations — authenticated via Clerk JWT               */
/* ------------------------------------------------------------------ */

/**
 * Replace opening hours. Requires admin auth.
 */
export const replaceOpeningHours = mutation({
  args: replacePayload,
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx, args): Promise<any> => {
    await requireAdmin(ctx);
    return await ctx.runMutation(internal.openingHours.replaceInternal as any, args);
  },
});
