import { ConvexError, v } from "convex/values";
import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";
import { requireAdmin } from "./adminAuth";
import type { Doc, Id } from "./_generated/dataModel";

const MAX_TABLE_NUMBER = 999;
const MAX_ORDER_TOTAL = 1_000_000;

/** Shared order embed shape used by multiple queries. */
const orderItemFields = v.object({
  _id: v.id("orderItems"),
  menuItemName: v.string(),
  priceAtOrder: v.number(),
  quantity: v.number(),
  notes: v.optional(v.string()),
  sortOrder: v.number(),
});

/**
 * Place a new order from staff dashboard.
 * Items are inserted as orderItems rows; total is calculated server-side.
 */
export const placeOrder = mutation({
  args: {
    items: v.array(
      v.object({
        menuItemName: v.string(),
        priceAtOrder: v.number(),
        quantity: v.number(),
        notes: v.optional(v.string()),
      }),
    ),
    tableNumber: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    const createdBy = await requireAdmin(ctx);

    if (args.items.length === 0) {
      throw new ConvexError("Order must contain at least one item");
    }

    // Calculate total server-side, do not trust client
    let total = 0;
    for (const item of args.items) {
      if (!Number.isFinite(item.priceAtOrder) || item.priceAtOrder < 0) {
        throw new ConvexError("Invalid item price");
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 999) {
        throw new ConvexError("Invalid item quantity");
      }
      if (item.menuItemName.trim().length === 0) {
        throw new ConvexError("Item name cannot be empty");
      }
      total += item.priceAtOrder * item.quantity;
    }
    total = Math.round(total * 100) / 100; // 2 decimal places

    if (total > MAX_ORDER_TOTAL) {
      throw new ConvexError("Order total exceeds maximum allowed");
    }

    if (args.tableNumber !== undefined) {
      if (!Number.isInteger(args.tableNumber) || args.tableNumber < 1 || args.tableNumber > MAX_TABLE_NUMBER) {
        throw new ConvexError("Invalid table number");
      }
    }

    if (args.notes !== undefined && args.notes.length > 500) {
      throw new ConvexError("Order notes too long");
    }

    const now = Date.now();

    const orderId = await ctx.db.insert("orders", {
      tableNumber: args.tableNumber,
      status: "pending",
      total,
      createdAt: now,
      createdBy,
      notes: args.notes,
    });

    let sortOrder = 0;
    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        menuItemName: item.menuItemName,
        priceAtOrder: item.priceAtOrder,
        quantity: item.quantity,
        notes: item.notes,
        sortOrder,
      });
      sortOrder++;
    }

    return orderId;
  },
});

/** Helper: fetch and shape items for a given order. */
async function getOrderItems(
  ctx: QueryCtx | MutationCtx,
  orderId: Id<"orders">,
) {
  const items = await ctx.db
    .query("orderItems")
    .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
    .collect();
  return items.map((item) => ({
    _id: item._id,
    menuItemName: item.menuItemName,
    priceAtOrder: item.priceAtOrder,
    quantity: item.quantity,
    notes: item.notes,
    sortOrder: item.sortOrder,
  }));
}

const orderItemInputs = v.array(
  v.object({
    menuItemName: v.string(),
    priceAtOrder: v.number(),
    quantity: v.number(),
    notes: v.optional(v.string()),
  }),
);

const orderWithItemsFields = v.object({
  _id: v.id("orders"),
  _creationTime: v.number(),
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
  items: v.array(orderItemFields),
});

/**
 * List all orders (most recent first), each with embedded items.
 */
export const getOrders = query({
  args: {},
  returns: v.array(orderWithItemsFields),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const orders = await ctx.db
      .query("orders")
      .order("desc")
      .collect();

    const result = [];
    for (const order of orders) {
      const items = await getOrderItems(ctx, order._id);
      result.push({ ...order, items });
    }

    return result;
  },
});

/**
 * Fetch orders for a specific day (UTC-based range).
 */
export const getOrdersByDay = query({
  args: {
    dateStart: v.number(),
    dateEnd: v.number(),
  },
  returns: v.array(orderWithItemsFields),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_createdAt", (q) =>
        q.gte("createdAt", args.dateStart).lt("createdAt", args.dateEnd),
      )
      .order("desc")
      .collect();

    const result = [];
    for (const order of orders) {
      const items = await getOrderItems(ctx, order._id);
      result.push({ ...order, items });
    }

    return result;
  },
});

type OrderDoc = Doc<"orders">;

/** Helper: compute stats for a set of orders. */
async function computeStats(ctx: QueryCtx | MutationCtx, orders: OrderDoc[]) {
  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  let totalRevenue = 0;
  const itemCounts = new Map<string, { quantity: number; revenue: number }>();

  for (const order of activeOrders) {
    const items = await getOrderItems(ctx, order._id);
    for (const item of items) {
      const lineTotal = item.priceAtOrder * item.quantity;
      totalRevenue += lineTotal;
      const existing = itemCounts.get(item.menuItemName) ?? {
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += item.quantity;
      existing.revenue += lineTotal;
      itemCounts.set(item.menuItemName, existing);
    }
  }

  totalRevenue = Math.round(totalRevenue * 100) / 100;

  const itemsSold = Array.from(itemCounts.entries())
    .map(([menuItemName, data]) => ({
      menuItemName,
      quantity: data.quantity,
      revenue: Math.round(data.revenue * 100) / 100,
    }))
    .sort((a, b) => b.quantity - a.quantity);

  return {
    totalOrders: activeOrders.length,
    totalRevenue,
    itemsSold,
  };
}

/**
 * Aggregate stats for all time (today + all-time).
 */
export const getOrdersForStats = query({
  args: {},
  returns: v.object({
    totalOrders: v.number(),
    totalRevenue: v.number(),
    todayOrders: v.number(),
    todayRevenue: v.number(),
    itemsSold: v.array(
      v.object({
        menuItemName: v.string(),
        quantity: v.number(),
        revenue: v.number(),
      }),
    ),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    // Use index for today's orders; full scan for all-time
    const todayOrders = await ctx.db
      .query("orders")
      .withIndex("by_createdAt", (q) =>
        q.gte("createdAt", todayStart).lt("createdAt", todayEnd),
      )
      .order("desc")
      .collect();

    const allOrders = await ctx.db.query("orders").order("desc").collect();

    const allStats = await computeStats(ctx, allOrders);
    const todayStats = await computeStats(ctx, todayOrders);

    return {
      totalOrders: allStats.totalOrders,
      totalRevenue: allStats.totalRevenue,
      todayOrders: todayStats.totalOrders,
      todayRevenue: todayStats.totalRevenue,
      itemsSold: allStats.itemsSold,
    };
  },
});

/**
 * Stats for a specific month (by year, month).
 */
export const getMonthlyStats = query({
  args: {
    year: v.number(),
    month: v.number(), // 0-indexed (0=Jan)
  },
  returns: v.object({
    totalOrders: v.number(),
    totalRevenue: v.number(),
    itemsSold: v.array(
      v.object({
        menuItemName: v.string(),
        quantity: v.number(),
        revenue: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const monthStart = new Date(args.year, args.month, 1).getTime();
    const monthEnd = new Date(args.year, args.month + 1, 1).getTime();

    const monthOrders = await ctx.db
      .query("orders")
      .withIndex("by_createdAt", (q) =>
        q.gte("createdAt", monthStart).lt("createdAt", monthEnd),
      )
      .order("desc")
      .collect();

    return await computeStats(ctx, monthOrders);
  },
});

/**
 * Yearly stats: per-month breakdown for a given year.
 */
export const getYearlyStats = query({
  args: {
    year: v.number(),
  },
  returns: v.array(
    v.object({
      month: v.number(), // 0-indexed
      totalOrders: v.number(),
      totalRevenue: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const yearStart = new Date(args.year, 0, 1).getTime();
    const yearEnd = new Date(args.year + 1, 0, 1).getTime();

    const yearOrders = await ctx.db
      .query("orders")
      .withIndex("by_createdAt", (q) =>
        q.gte("createdAt", yearStart).lt("createdAt", yearEnd),
      )
      .order("desc")
      .collect();

    const monthBuckets: {
      month: number;
      totalOrders: number;
      totalRevenue: number;
    }[] = [];
    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(args.year, m, 1).getTime();
      const monthEnd = new Date(args.year, m + 1, 1).getTime();
      const bucket = yearOrders.filter(
        (o) => o.createdAt >= monthStart && o.createdAt < monthEnd,
      );
      const s = await computeStats(ctx, bucket);
      monthBuckets.push({
        month: m,
        totalOrders: s.totalOrders,
        totalRevenue: s.totalRevenue,
      });
    }

    return monthBuckets;
  },
});

/**
 * Update the status of an order (pending → completed/cancelled).
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});

/**
 * Edit an existing non-cancelled order: replace items, update table/notes, recalculate total.
 * Only allowed for pending or completed orders.
 */
export const editOrder = mutation({
  args: {
    orderId: v.id("orders"),
    items: orderItemInputs,
    tableNumber: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
      ),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const _admin = await requireAdmin(ctx);

    const existing = await ctx.db.get(args.orderId);
    if (!existing) throw new ConvexError("Order not found");
    if (existing.status === "cancelled") {
      throw new ConvexError("Cannot edit a cancelled order");
    }

    if (args.items.length === 0) {
      throw new ConvexError("Order must contain at least one item");
    }

    // Validate and recalculate total
    let total = 0;
    for (const item of args.items) {
      if (!Number.isFinite(item.priceAtOrder) || item.priceAtOrder < 0) {
        throw new ConvexError("Invalid item price");
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 999) {
        throw new ConvexError("Invalid item quantity");
      }
      if (item.menuItemName.trim().length === 0) {
        throw new ConvexError("Item name cannot be empty");
      }
      total += item.priceAtOrder * item.quantity;
    }
    total = Math.round(total * 100) / 100;
    if (total > MAX_ORDER_TOTAL) {
      throw new ConvexError("Order total exceeds maximum allowed");
    }

    if (args.tableNumber !== undefined) {
      if (!Number.isInteger(args.tableNumber) || args.tableNumber < 1 || args.tableNumber > MAX_TABLE_NUMBER) {
        throw new ConvexError("Invalid table number");
      }
    }

    if (args.notes !== undefined && args.notes.length > 500) {
      throw new ConvexError("Order notes too long");
    }

    // Delete old order items
    const oldItems = await ctx.db
      .query("orderItems")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();
    for (const oldItem of oldItems) {
      await ctx.db.delete(oldItem._id);
    }

    // Insert new order items
    let sortOrder = 0;
    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId: args.orderId,
        menuItemName: item.menuItemName,
        priceAtOrder: item.priceAtOrder,
        quantity: item.quantity,
        notes: item.notes,
        sortOrder,
      });
      sortOrder++;
    }

    // Update order fields (only include when explicitly provided to avoid wiping)
    const patch: Record<string, unknown> = {
      total,
    };
    if (args.tableNumber !== undefined) {
      patch.tableNumber = args.tableNumber;
    }
    if (args.notes !== undefined) {
      patch.notes = args.notes;
    }
    if (args.status !== undefined) {
      patch.status = args.status;
    }
    await ctx.db.patch(args.orderId, patch);
  },
});

/**
 * Delete an order and all its order items.
 */
export const deleteOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.orderId);
  },
});
