import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { type Infer, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { defaultSiteMenuRow } from "./defaultSiteMenu";
import { menuCategory, menuCategoryPublic } from "./schema";
import {
  assertAllowedImageUrl,
  safeImageUrl,
} from "./siteAdmin";
import { requireAdmin } from "./adminAuth";

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
    if (cat.label.length > MAX_CATEGORY_LABEL_LENGTH) {
      throw new Error(`category label exceeds ${MAX_CATEGORY_LABEL_LENGTH} characters`);
    }
    if (cat.variant === "priced" && cat.subtitle && cat.subtitle.length > MAX_CATEGORY_SUBTITLE_LENGTH) {
      throw new Error(`category subtitle exceeds ${MAX_CATEGORY_SUBTITLE_LENGTH} characters`);
    }
    if (cat.variant === "priced" && cat.items.length > MAX_ITEMS_PER_CATEGORY) {
      throw new Error(`items per category exceeds ${MAX_ITEMS_PER_CATEGORY}`);
    }
    if (cat.variant === "drinks" && cat.groups.length > MAX_ITEMS_PER_CATEGORY) {
      throw new Error(`drink groups per category exceeds ${MAX_ITEMS_PER_CATEGORY}`);
    }

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
        if (item.name.length > MAX_ITEM_NAME_LENGTH) {
          throw new Error(`item name exceeds ${MAX_ITEM_NAME_LENGTH} characters`);
        }
        if (item.price.length > MAX_ITEM_PRICE_LENGTH) {
          throw new Error(`item price exceeds ${MAX_ITEM_PRICE_LENGTH} characters`);
        }
        if (item.description !== undefined && item.description.length > MAX_ITEM_DESC_LENGTH) {
          throw new Error(`item description exceeds ${MAX_ITEM_DESC_LENGTH} characters`);
        }
        if (item.image !== undefined && item.image.length > MAX_IMAGE_URL_LENGTH) {
          throw new Error(`item image URL exceeds ${MAX_IMAGE_URL_LENGTH} characters`);
        }
        if (item.image !== undefined && item.image !== "") {
          assertAllowedImageUrl(item.image);
        }

        await ctx.db.insert("menuPricedItems", {
          categoryId: tabId,
          name: item.name,
          price: item.price,
          ...(item.description !== undefined && item.description !== ""
            ? { description: item.description }
            : {}),
          ...(item.image !== undefined && item.image !== ""
            ? { image: item.image }
            : {}),
          isAvailable: item.isAvailable !== false,
          sortOrder: i++,
        });
      }
    } else {
      // drinks variant (group count already validated above)
      let gOrder = 0;
      for (const group of cat.groups) {
        if (group.title.length > MAX_GROUP_TITLE_LENGTH) {
          throw new Error(`group title exceeds ${MAX_GROUP_TITLE_LENGTH} characters`);
        }
        const groupId = await ctx.db.insert("menuDrinkGroups", {
          categoryId: tabId,
          title: group.title,
          sortOrder: gOrder++,
        });
        let rOrder = 0;
        for (const row of group.items) {
          if (row.name.length > MAX_ITEM_NAME_LENGTH) {
            throw new Error(`drink name exceeds ${MAX_ITEM_NAME_LENGTH} characters`);
          }
          if (row.hot !== null && row.hot.length > MAX_ITEM_PRICE_LENGTH) {
            throw new Error(`drink hot price exceeds ${MAX_ITEM_PRICE_LENGTH} characters`);
          }
          if (row.iced !== null && row.iced.length > MAX_ITEM_PRICE_LENGTH) {
            throw new Error(`drink iced price exceeds ${MAX_ITEM_PRICE_LENGTH} characters`);
          }
          if (row.image !== undefined && row.image.length > MAX_IMAGE_URL_LENGTH) {
            throw new Error(`drink image URL exceeds ${MAX_IMAGE_URL_LENGTH} characters`);
          }
          if (row.image !== undefined && row.image !== "") {
            assertAllowedImageUrl(row.image);
          }

          await ctx.db.insert("menuDrinkItems", {
            groupId,
            name: row.name,
            hot: row.hot,
            iced: row.iced,
            ...(row.image !== undefined && row.image !== ""
              ? { image: row.image }
            : {}),
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
        .map(({ name, price, description, image }) => {
          const safeImage = image !== undefined && image !== "" ? safeImageUrl(image) : undefined;
          return {
            name,
            price,
            ...(description !== undefined && description !== ""
              ? { description }
              : {}),
            ...(safeImage !== undefined && safeImage !== "" ? { image: safeImage } : {}),
          };
        });
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
          .map(({ name, hot, iced, image }) => {
            const safeImage = image !== undefined && image !== "" ? safeImageUrl(image) : undefined;
            return {
              name,
              hot,
              iced,
              ...(safeImage !== undefined && safeImage !== "" ? { image: safeImage } : {}),
            };
          });
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
      foodMenuImageUrl: safeImageUrl(settings.foodMenuImageUrl),
      drinksMenuImageUrl: safeImageUrl(settings.drinksMenuImageUrl),
      categories,
    };
  },
});

/* ------------------------------------------------------------------ */
/*  Admin query — includes unavailable items + DB _id for toggles    */
/* ------------------------------------------------------------------ */

const adminPricedItem = v.object({
  _id: v.id("menuPricedItems"),
  name: v.string(),
  price: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  isAvailable: v.boolean(),
  sortOrder: v.number(),
  categoryId: v.id("menuTabs"),
});

const adminPricedCategory = v.object({
  _id: v.id("menuTabs"),
  slug: v.string(),
  label: v.string(),
  variant: v.literal("priced"),
  subtitle: v.optional(v.string()),
  sortOrder: v.number(),
  items: v.array(adminPricedItem),
});

const adminDrinkItem = v.object({
  _id: v.id("menuDrinkItems"),
  name: v.string(),
  hot: v.union(v.string(), v.null()),
  iced: v.union(v.string(), v.null()),
  image: v.optional(v.string()),
  isAvailable: v.boolean(),
  sortOrder: v.number(),
  groupId: v.id("menuDrinkGroups"),
});

const adminDrinkGroup = v.object({
  _id: v.id("menuDrinkGroups"),
  title: v.string(),
  sortOrder: v.number(),
  items: v.array(adminDrinkItem),
});

const adminDrinksCategory = v.object({
  _id: v.id("menuTabs"),
  slug: v.string(),
  label: v.string(),
  variant: v.literal("drinks"),
  sortOrder: v.number(),
  groups: v.array(adminDrinkGroup),
});

const adminCategory = v.union(adminPricedCategory, adminDrinksCategory);

const menuAdminReturn = v.union(
  v.null(),
  v.object({
    disclaimer: v.string(),
    footerTagline: v.string(),
    foodMenuImageUrl: v.string(),
    drinksMenuImageUrl: v.string(),
    categories: v.array(adminCategory),
  }),
);

/** Returns full menu including unavailable items with DB _id for toggle forms.
 * Internal-only — accessible only from Convex HTTP routes or other internal functions.
 */
export const getAllAdmin = internalQuery({
  args: {},
  returns: menuAdminReturn,
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("menuSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (!settings) return null;

    const categories: unknown[] = [];
    const tabs = await ctx.db
      .query("menuTabs")
      .withIndex("by_sort")
      .order("asc")
      .collect();

    for (const tab of tabs) {
      if (tab.variant === "priced") {
        const items = await ctx.db
          .query("menuPricedItems")
          .withIndex("by_category_sort", (q) => q.eq("categoryId", tab._id))
          .order("asc")
          .collect();

        categories.push({
          _id: tab._id,
          slug: tab.slug,
          label: tab.label,
          variant: "priced" as const,
          subtitle: tab.subtitle,
          sortOrder: tab.sortOrder,
          items: items.map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
            isAvailable: item.isAvailable,
            sortOrder: item.sortOrder,
            categoryId: item.categoryId,
          })),
        });
      } else {
        const groups = await ctx.db
          .query("menuDrinkGroups")
          .withIndex("by_category_sort", (q) => q.eq("categoryId", tab._id))
          .order("asc")
          .collect();

        const drinkGroups: unknown[] = [];
        for (const g of groups) {
          const items = await ctx.db
            .query("menuDrinkItems")
            .withIndex("by_group_sort", (q) => q.eq("groupId", g._id))
            .order("asc")
            .collect();

          drinkGroups.push({
            _id: g._id,
            title: g.title,
            sortOrder: g.sortOrder,
            items: items.map((item) => ({
              _id: item._id,
              name: item.name,
              hot: item.hot,
              iced: item.iced,
              image: item.image,
              isAvailable: item.isAvailable,
              sortOrder: item.sortOrder,
              groupId: item.groupId,
            })),
          });
        }

        categories.push({
          _id: tab._id,
          slug: tab.slug,
          label: tab.label,
          variant: "drinks" as const,
          sortOrder: tab.sortOrder,
          groups: drinkGroups,
        });
      }
    }

    return {
      disclaimer: settings.disclaimer,
      footerTagline: settings.footerTagline,
      foodMenuImageUrl: settings.foodMenuImageUrl,
      drinksMenuImageUrl: settings.drinksMenuImageUrl,
      categories,
      // TS: runtime validator handles the shape; cast is safe for admin-only code.
    } as any;
  },
});

/* ------------------------------------------------------------------ */
/*  Input size limits (defence-in-depth for admin functions)   */
/* ------------------------------------------------------------------ */

const MAX_DISCLAIMER_LENGTH = 2000;
const MAX_TAGLINE_LENGTH = 200;
const MAX_MENU_URL_LENGTH = 2000;
const MAX_CATEGORIES = 50;
const MAX_ITEMS_PER_CATEGORY = 200;
const MAX_CATEGORY_LABEL_LENGTH = 200;
const MAX_CATEGORY_SUBTITLE_LENGTH = 500;
const MAX_GROUP_TITLE_LENGTH = 200;
const MAX_ITEM_NAME_LENGTH = 200;
const MAX_ITEM_PRICE_LENGTH = 20;
const MAX_ITEM_DESC_LENGTH = 2000;
const MAX_IMAGE_URL_LENGTH = 2000;

function validateReplaceBody(body: {
  disclaimer: string;
  footerTagline: string;
  foodMenuImageUrl: string;
  drinksMenuImageUrl: string;
  categories: unknown[];
}): void {
  if (body.disclaimer.length > MAX_DISCLAIMER_LENGTH) {
    throw new Error(`disclaimer exceeds ${MAX_DISCLAIMER_LENGTH} characters`);
  }
  if (body.footerTagline.length > MAX_TAGLINE_LENGTH) {
    throw new Error(`footerTagline exceeds ${MAX_TAGLINE_LENGTH} characters`);
  }
  if (body.foodMenuImageUrl.length > MAX_MENU_URL_LENGTH) {
    throw new Error(`foodMenuImageUrl exceeds ${MAX_MENU_URL_LENGTH} characters`);
  }
  if (body.drinksMenuImageUrl.length > MAX_MENU_URL_LENGTH) {
    throw new Error(`drinksMenuImageUrl exceeds ${MAX_MENU_URL_LENGTH} characters`);
  }
  if (body.categories.length > MAX_CATEGORIES) {
    throw new Error(`categories exceeds ${MAX_CATEGORIES}`);
  }
}

const replaceBody = {
  disclaimer: v.string(),
  footerTagline: v.string(),
  foodMenuImageUrl: v.string(),
  drinksMenuImageUrl: v.string(),
  categories: v.array(menuCategory),
} as const;

/** Called only from admin functions (JWT auth), not from clients. */
export const replaceInternal = internalMutation({
  args: replaceBody,
  returns: v.null(),
  handler: async (ctx, args) => {
    validateReplaceBody(args);
    assertAllowedImageUrl(args.foodMenuImageUrl);
    assertAllowedImageUrl(args.drinksMenuImageUrl);
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

/* ------------------------------------------------------------------ */
/*  Edit & Delete mutations                                             */
/* ------------------------------------------------------------------ */

export const editPricedItemInternal = internalMutation({
  args: {
    itemId: v.id("menuPricedItems"),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    clearImage: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, { itemId, name, price, description, image, clearImage }) => {
    // Boundary input validation
    if (name.length > MAX_ITEM_NAME_LENGTH || price.length > MAX_ITEM_PRICE_LENGTH) {
      throw new Error("name or price exceeds maximum length");
    }
    if (description !== undefined && description.length > MAX_ITEM_DESC_LENGTH) {
      throw new Error("description exceeds maximum length");
    }
    if (image !== undefined && image.length > MAX_IMAGE_URL_LENGTH) {
      throw new Error("image URL exceeds maximum length");
    }
    if (image !== undefined && image !== "") {
      assertAllowedImageUrl(image);
    }

    const patch: {
      name: string;
      price: string;
      description?: string;
      image?: string;
    } = { name, price };

    // Allow empty string to clear the description, undefined to leave unchanged
    if (description !== undefined) {
      patch.description = description;
    }

    if (clearImage) {
      patch.image = undefined;
    } else if (image !== undefined && image !== "") {
      patch.image = image;
    }

    await ctx.db.patch(itemId, patch);
    return null;
  },
});

export const editDrinkItemInternal = internalMutation({
  args: {
    itemId: v.id("menuDrinkItems"),
    name: v.string(),
    hot: v.union(v.string(), v.null()),
    iced: v.union(v.string(), v.null()),
    image: v.optional(v.string()),
    clearImage: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, { itemId, name, hot, iced, image, clearImage }) => {
    // Boundary input validation
    if (name.length > MAX_ITEM_NAME_LENGTH) {
      throw new Error("name exceeds maximum length");
    }
    if (hot !== null && hot.length > MAX_ITEM_PRICE_LENGTH) {
      throw new Error("hot price exceeds maximum length");
    }
    if (iced !== null && iced.length > MAX_ITEM_PRICE_LENGTH) {
      throw new Error("iced price exceeds maximum length");
    }
    if (image !== undefined && image.length > MAX_IMAGE_URL_LENGTH) {
      throw new Error("image URL exceeds maximum length");
    }
    if (image !== undefined && image !== "") {
      assertAllowedImageUrl(image);
    }

    const patch: {
      name: string;
      hot: string | null;
      iced: string | null;
      image?: string;
    } = { name, hot, iced };

    if (clearImage) {
      patch.image = undefined;
    } else if (image !== undefined && image !== "") {
      patch.image = image;
    }

    await ctx.db.patch(itemId, patch);
    return null;
  },
});

export const deletePricedItemInternal = internalMutation({
  args: {
    itemId: v.id("menuPricedItems"),
  },
  returns: v.null(),
  handler: async (ctx, { itemId }) => {
    await ctx.db.delete(itemId);
    return null;
  },
});

export const deleteDrinkItemInternal = internalMutation({
  args: {
    itemId: v.id("menuDrinkItems"),
  },
  returns: v.null(),
  handler: async (ctx, { itemId }) => {
    await ctx.db.delete(itemId);
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
    const { key, ...rest } = defaultSiteMenuRow;
    void key;
    await insertMenuFromNested(ctx, rest);
    return had ? "updated" : "created";
  },
});

/* ------------------------------------------------------------------ */
/*  Public admin query/mutations — authenticated via Clerk JWT        */
/* ------------------------------------------------------------------ */

/**
 * Get full menu including unavailable items and DB _id.
 * Requires Clerk JWT auth + admins table membership.
 */
export const getAdminMenu = query({
  args: {},
  returns: menuAdminReturn,
  handler: async (ctx): Promise<any> => {
    await requireAdmin(ctx);
    // Delegate to the existing internal query
    return await ctx.runQuery(internal.menu.getAllAdmin as any, {});
  },
});

/**
 * Replace the entire menu. Requires admin auth.
 */
export const replaceMenu = mutation({
  args: replaceBody,
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.replaceInternal, args as any);
    return null;
  },
});

/**
 * Toggle priced item availability. Requires admin auth.
 */
export const setPricedItemAvailable = mutation({
  args: {
    itemId: v.id("menuPricedItems"),
    isAvailable: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.setPricedItemAvailableInternal, args);
    return null;
  },
});

/**
 * Toggle drink item availability. Requires admin auth.
 */
export const setDrinkItemAvailable = mutation({
  args: {
    itemId: v.id("menuDrinkItems"),
    isAvailable: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.setDrinkItemAvailableInternal, args);
    return null;
  },
});

/**
 * Edit a priced menu item. Requires admin auth.
 */
export const editPricedItem = mutation({
  args: {
    itemId: v.id("menuPricedItems"),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    clearImage: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.editPricedItemInternal, args as any);
    return null;
  },
});

/**
 * Edit a drink menu item. Requires admin auth.
 */
export const editDrinkItem = mutation({
  args: {
    itemId: v.id("menuDrinkItems"),
    name: v.string(),
    hot: v.union(v.string(), v.null()),
    iced: v.union(v.string(), v.null()),
    image: v.optional(v.string()),
    clearImage: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.editDrinkItemInternal, args as any);
    return null;
  },
});

/**
 * Delete a priced menu item. Requires admin auth.
 */
export const deletePricedItem = mutation({
  args: {
    itemId: v.id("menuPricedItems"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.deletePricedItemInternal, args);
    return null;
  },
});

/**
 * Delete a drink menu item. Requires admin auth.
 */
export const deleteDrinkItem = mutation({
  args: {
    itemId: v.id("menuDrinkItems"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.runMutation(internal.menu.deleteDrinkItemInternal, args);
    return null;
  },
});
