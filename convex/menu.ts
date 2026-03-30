import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { type Infer, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import { defaultSiteMenuRow } from "./defaultSiteMenu";
import { menuCategory, menuCategoryPublic } from "./schema";
import {
  assertHttpOrHttpsUrl,
  safeHttpOrHttpsUrl,
} from "./siteAdmin";

type MutationCtx = GenericMutationCtx<DataModel>;
type QueryCtx = GenericQueryCtx<DataModel>;
type DbCtx = Pick<QueryCtx, "db">;

/** Nested menu payload (seed + `replace`); categories allow optional `isAvailable` per line. */
type MenuBody = Omit<typeof defaultSiteMenuRow, "key" | "categories"> & {
  categories: Infer<typeof menuCategory>[];
};

type PublicCategory =
  | {
      id: string;
      label: string;
      variant: "priced";
      subtitle?: string;
      items: { name: string; price: string; description?: string }[];
    }
  | {
      id: string;
      label: string;
      variant: "drinks";
      groups: {
        title: string;
        items: { name: string; hot: string | null; iced: string | null }[];
      }[];
    };

const siteMenuPublicReturn = v.union(
  v.null(),
  v.object({
    disclaimer: v.string(),
    footerTagline: v.string(),
    foodMenuImageUrl: v.string(),
    drinksMenuImageUrl: v.string(),
    categories: v.array(menuCategoryPublic),
  }),
);

async function clearMenu(ctx: MutationCtx): Promise<void> {
  for (const row of await ctx.db.query("menuDrinkItems").collect()) {
    await ctx.db.delete(row._id);
  }
  for (const row of await ctx.db.query("menuDrinkGroups").collect()) {
    await ctx.db.delete(row._id);
  }
  for (const row of await ctx.db.query("menuPricedItems").collect()) {
    await ctx.db.delete(row._id);
  }
  for (const row of await ctx.db.query("menuTabs").collect()) {
    await ctx.db.delete(row._id);
  }
  for (const row of await ctx.db.query("menuSettings").collect()) {
    await ctx.db.delete(row._id);
  }
}

async function insertMenuFromNested(ctx: MutationCtx, body: MenuBody): Promise<void> {
  await ctx.db.insert("menuSettings", {
    key: "default",
    disclaimer: body.disclaimer,
    footerTagline: body.footerTagline,
    foodMenuImageUrl: body.foodMenuImageUrl,
    drinksMenuImageUrl: body.drinksMenuImageUrl,
  });

  let tabOrder = 0;
  for (const cat of body.categories) {
    const tabId = await ctx.db.insert("menuTabs", {
      slug: cat.id,
      label: cat.label,
      variant: cat.variant,
      subtitle: cat.variant === "priced" ? cat.subtitle : undefined,
      sortOrder: tabOrder++,
    });

    if (cat.variant === "priced") {
      let i = 0;
      for (const item of cat.items) {
        await ctx.db.insert("menuPricedItems", {
          categoryId: tabId,
          name: item.name,
          price: item.price,
          ...(item.description !== undefined && item.description !== ""
            ? { description: item.description }
            : {}),
          isAvailable: item.isAvailable !== false,
          sortOrder: i++,
        });
      }
    } else {
      let gOrder = 0;
      for (const group of cat.groups) {
        const groupId = await ctx.db.insert("menuDrinkGroups", {
          categoryId: tabId,
          title: group.title,
          sortOrder: gOrder++,
        });
        let rOrder = 0;
        for (const row of group.items) {
          await ctx.db.insert("menuDrinkItems", {
            groupId,
            name: row.name,
            hot: row.hot,
            iced: row.iced,
            isAvailable: row.isAvailable !== false,
            sortOrder: rOrder++,
          });
        }
      }
    }
  }
}

async function buildPublicCategories(ctx: DbCtx): Promise<PublicCategory[]> {
  const out: PublicCategory[] = [];
  const tabs = await ctx.db
    .query("menuTabs")
    .withIndex("by_sort")
    .order("asc")
    .collect();

  for (const tab of tabs) {
    if (tab.variant === "priced") {
      const rows = await ctx.db
        .query("menuPricedItems")
        .withIndex("by_category_sort", (q) => q.eq("categoryId", tab._id))
        .order("asc")
        .collect();
      const items = rows
        .filter((r) => r.isAvailable)
        .map(({ name, price, description }) => ({
          name,
          price,
          ...(description !== undefined && description !== ""
            ? { description }
            : {}),
        }));
      if (items.length > 0) {
        out.push({
          id: tab.slug,
          label: tab.label,
          variant: "priced",
          subtitle: tab.subtitle,
          items,
        });
      }
    } else {
      const groupRows = await ctx.db
        .query("menuDrinkGroups")
        .withIndex("by_category_sort", (q) => q.eq("categoryId", tab._id))
        .order("asc")
        .collect();
      const drinkGroups: {
        title: string;
        items: { name: string; hot: string | null; iced: string | null }[];
      }[] = [];

      for (const g of groupRows) {
        const drinkRows = await ctx.db
          .query("menuDrinkItems")
          .withIndex("by_group_sort", (q) => q.eq("groupId", g._id))
          .order("asc")
          .collect();
        const items = drinkRows
          .filter((r) => r.isAvailable)
          .map(({ name, hot, iced }) => ({ name, hot, iced }));
        if (items.length > 0) {
          drinkGroups.push({ title: g.title, items });
        }
      }
      if (drinkGroups.length > 0) {
        out.push({
          id: tab.slug,
          label: tab.label,
          variant: "drinks",
          groups: drinkGroups,
        });
      }
    }
  }
  return out;
}

export const get = query({
  args: {},
  returns: siteMenuPublicReturn,
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("menuSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (!settings) {
      return null;
    }
    const categories = await buildPublicCategories(ctx);
    return {
      disclaimer: settings.disclaimer,
      footerTagline: settings.footerTagline,
      foodMenuImageUrl: safeHttpOrHttpsUrl(settings.foodMenuImageUrl),
      drinksMenuImageUrl: safeHttpOrHttpsUrl(settings.drinksMenuImageUrl),
      categories,
    };
  },
});

const replaceBody = {
  disclaimer: v.string(),
  footerTagline: v.string(),
  foodMenuImageUrl: v.string(),
  drinksMenuImageUrl: v.string(),
  categories: v.array(menuCategory),
} as const;

/** Called only from Convex HTTP admin routes (Bearer auth), not from clients. */
export const replaceInternal = internalMutation({
  args: replaceBody,
  returns: v.null(),
  handler: async (ctx, args) => {
    assertHttpOrHttpsUrl(args.foodMenuImageUrl);
    assertHttpOrHttpsUrl(args.drinksMenuImageUrl);
    await clearMenu(ctx);
    await insertMenuFromNested(ctx, args);
    return null;
  },
});

export const setPricedItemAvailableInternal = internalMutation({
  args: {
    itemId: v.id("menuPricedItems"),
    isAvailable: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, { itemId, isAvailable }) => {
    await ctx.db.patch(itemId, { isAvailable });
    return null;
  },
});

export const setDrinkItemAvailableInternal = internalMutation({
  args: {
    itemId: v.id("menuDrinkItems"),
    isAvailable: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, { itemId, isAvailable }) => {
    await ctx.db.patch(itemId, { isAvailable });
    return null;
  },
});

export const applyDefaultSeed = internalMutation({
  args: {},
  returns: v.union(v.literal("created"), v.literal("updated")),
  handler: async (ctx): Promise<"created" | "updated"> => {
    const had = await ctx.db
      .query("menuSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    await clearMenu(ctx);
    const { key: _k, ...rest } = defaultSiteMenuRow;
    await insertMenuFromNested(ctx, rest);
    return had ? "updated" : "created";
  },
});
