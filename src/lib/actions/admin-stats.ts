"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";

export type MonthStatsResult = {
  totalOrders: number;
  totalRevenue: number;
  itemsSold: { menuItemName: string; quantity: number; revenue: number }[];
} | null;

export type YearMonthRow = {
  month: number;
  totalOrders: number;
  totalRevenue: number;
};

/**
 * Fetch monthly stats for a given year and month (0-indexed).
 * Called from the client via server action.
 */
export async function fetchMonthlyStatsAction(
  year: number,
  month: number,
): Promise<MonthStatsResult> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) return null;

  try {
    const data = await fetchQuery(
      api.orders.getMonthlyStats,
      { year, month },
      { token, skipConvexDeploymentUrlCheck: true },
    );
    return data as MonthStatsResult;
  } catch (error) {
    console.error("[admin-stats] fetchMonthlyStatsAction failed", error);
    return null;
  }
}

/**
 * Fetch yearly per-month breakdown for a given year.
 * Called from the client via server action.
 */
export async function fetchYearlyStatsAction(year: number): Promise<YearMonthRow[]> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) return [];

  try {
    const data = await fetchQuery(
      api.orders.getYearlyStats,
      { year },
      { token, skipConvexDeploymentUrlCheck: true },
    );
    return (data as YearMonthRow[]) ?? [];
  } catch (error) {
    console.error("[admin-stats] fetchYearlyStatsAction failed", error);
    return [];
  }
}

/**
 * Fetch orders by day, used by client-side date navigation.
 */
export async function fetchOrdersByDayAction(
  dateStart: number,
  dateEnd: number,
): Promise<unknown> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) return [];

  try {
    const data = await fetchQuery(
      api.orders.getOrdersByDay,
      { dateStart, dateEnd },
      { token, skipConvexDeploymentUrlCheck: true },
    );
    return data ?? [];
  } catch (error) {
    console.error("[admin-stats] fetchOrdersByDayAction failed", error);
    return [];
  }
}
