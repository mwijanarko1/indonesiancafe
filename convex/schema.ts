import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Nested priced item (used by menu replace payload and seed JSON). */
const pricedItem = v.object({
  name: v.string(),
  price: v.string(),
  description: v.optional(v.string()),
  isAvailable: v.optional(v.boolean()),
});

const pricedCategory = v.object({
  id: v.string(),
  label: v.string(),
  variant: v.literal("priced"),
  subtitle: v.optional(v.string()),
  items: v.array(pricedItem),
});

const drinkRow = v.object({
  name: v.string(),
  hot: v.union(v.string(), v.null()),
  iced: v.union(v.string(), v.null()),
  isAvailable: v.optional(v.boolean()),
});

const drinkGroup = v.object({
  title: v.string(),
  items: v.array(drinkRow),
});

const drinksCategory = v.object({
  id: v.string(),
  label: v.string(),
  variant: v.literal("drinks"),
  groups: v.array(drinkGroup),
});

/** Input shape for menu replace (HTTP admin) and seed source. */
export const menuCategory = v.union(pricedCategory, drinksCategory);

const pricedItemPublic = v.object({
  name: v.string(),
  price: v.string(),
  description: v.optional(v.string()),
});

const pricedCategoryPublic = v.object({
  id: v.string(),
  label: v.string(),
  variant: v.literal("priced"),
  subtitle: v.optional(v.string()),
  items: v.array(pricedItemPublic),
});

const drinkRowPublic = v.object({
  name: v.string(),
  hot: v.union(v.string(), v.null()),
  iced: v.union(v.string(), v.null()),
});

const drinkGroupPublic = v.object({
  title: v.string(),
  items: v.array(drinkRowPublic),
});

const drinksCategoryPublic = v.object({
  id: v.string(),
  label: v.string(),
  variant: v.literal("drinks"),
  groups: v.array(drinkGroupPublic),
});

/** API shape for `menu.get` (only available lines). */
export const menuCategoryPublic = v.union(pricedCategoryPublic, drinksCategoryPublic);

export const guestReview = v.object({
  author: v.string(),
  quote: v.string(),
  homeExcerpt: v.optional(v.string()),
});

export default defineSchema({
  /** Singleton: disclaimer, image URLs, footer. */
  menuSettings: defineTable({
    key: v.literal("default"),
    disclaimer: v.string(),
    footerTagline: v.string(),
    foodMenuImageUrl: v.string(),
    drinksMenuImageUrl: v.string(),
  }).index("by_key", ["key"]),

  /** One row per menu tab (Breakfast, Mains, Drinks, …). */
  menuTabs: defineTable({
    slug: v.string(),
    label: v.string(),
    variant: v.union(v.literal("priced"), v.literal("drinks")),
    subtitle: v.optional(v.string()),
    sortOrder: v.number(),
  }).index("by_sort", ["sortOrder"]),

  /** One row per priced line; toggle `isAvailable` in the dashboard. */
  menuPricedItems: defineTable({
    categoryId: v.id("menuTabs"),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
    isAvailable: v.boolean(),
    sortOrder: v.number(),
  }).index("by_category_sort", ["categoryId", "sortOrder"]),

  /** Drink sub-section (Coffee, Non-coffee, …). */
  menuDrinkGroups: defineTable({
    categoryId: v.id("menuTabs"),
    title: v.string(),
    sortOrder: v.number(),
  }).index("by_category_sort", ["categoryId", "sortOrder"]),

  /** One row per drink row in the table UI. */
  menuDrinkItems: defineTable({
    groupId: v.id("menuDrinkGroups"),
    name: v.string(),
    hot: v.union(v.string(), v.null()),
    iced: v.union(v.string(), v.null()),
    isAvailable: v.boolean(),
    sortOrder: v.number(),
  }).index("by_group_sort", ["groupId", "sortOrder"]),

  siteReviews: defineTable({
    key: v.literal("default"),
    reviews: v.array(guestReview),
    featuredAuthorOrder: v.array(v.string()),
  }).index("by_key", ["key"]),
});
