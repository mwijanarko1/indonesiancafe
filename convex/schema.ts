import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Nested priced item (used by menu replace payload and seed JSON). */
const pricedItem = v.object({
  name: v.string(),
  price: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
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
  image: v.optional(v.string()),
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
  image: v.optional(v.string()),
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
  image: v.optional(v.string()),
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

const openingHoursDay = v.object({
  day: v.string(),
  time: v.string(),
});

export default defineSchema({
  /** Clerk users allowed to access the admin dashboard. Add rows manually in Convex. */
  admins: defineTable({
    userId: v.string(),
  }).index("by_userId", ["userId"]),

  /**
   * Escalating lockout for failed admin auth/authorization attempts.
   * One row per Clerk `subject` (userId) that has failed admin checks.
   *
   * Thresholds (documented in adminAuth.ts):
   *   < 3 failures        → no lockout
   *   3 failures           → 5 min lockout
   *   4 failures (post-5m) → 15 min lockout
   *   5 failures           → 25 min lockout
   *   …arithmetic: 5 + 10*(failures-3) minutes.
   */
  adminLockouts: defineTable({
    subject: v.string(),
    failedAttempts: v.number(),
    lockedUntil: v.number(),
  }).index("by_subject", ["subject"]),

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
    image: v.optional(v.string()),
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
    image: v.optional(v.string()),
    isAvailable: v.boolean(),
    sortOrder: v.number(),
  }).index("by_group_sort", ["groupId", "sortOrder"]),

  siteReviews: defineTable({
    key: v.literal("default"),
    reviews: v.array(guestReview),
    featuredAuthorOrder: v.array(v.string()),
  }).index("by_key", ["key"]),

  /** Singleton: weekly opening hours and footnote for visit page, footer, and LLM docs. */
  siteOpeningHours: defineTable({
    key: v.literal("default"),
    hours: v.array(openingHoursDay),
    footnote: v.string(),
  }).index("by_key", ["key"]),

  /** One row per order placed by staff. */
  orders: defineTable({
    tableNumber: v.optional(v.number()),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    total: v.number(),
    createdAt: v.number(),
    createdBy: v.string(),
    notes: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"]),

  /** One row per line item within an order. */
  orderItems: defineTable({
    orderId: v.id("orders"),
    menuItemName: v.string(),
    priceAtOrder: v.number(),
    quantity: v.number(),
    notes: v.optional(v.string()),
    sortOrder: v.number(),
  }).index("by_orderId", ["orderId"]),
});
