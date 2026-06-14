import "server-only";

import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";

/**
 * Fetch order stats (admin auth via JWT token).
 * Returns null on failure.
 */
export async function getOrderStats(token: string): Promise<unknown> {
  try {
    return await fetchQuery(
      api.orders.getOrdersForStats,
      {},
      { token, skipConvexDeploymentUrlCheck: true },
    );
  } catch (error) {
    console.error("[admin-orders] getOrderStats fetch failed", error);
    return null;
  }
}

/**
 * Fetch orders for a specific day (start/end timestamps).
 */
export async function getOrdersByDay(
  token: string,
  dateStart: number,
  dateEnd: number,
): Promise<unknown> {
  try {
    return await fetchQuery(
      api.orders.getOrdersByDay,
      { dateStart, dateEnd },
      { token, skipConvexDeploymentUrlCheck: true },
    );
  } catch (error) {
    console.error("[admin-orders] getOrdersByDay fetch failed", error);
    return null;
  }
}

/**
 * Fetch monthly stats for a given year/month.
 */
export async function getMonthlyStats(
  token: string,
  year: number,
  month: number,
): Promise<unknown> {
  try {
    return await fetchQuery(
      api.orders.getMonthlyStats,
      { year, month },
      { token, skipConvexDeploymentUrlCheck: true },
    );
  } catch (error) {
    console.error("[admin-orders] getMonthlyStats fetch failed", error);
    return null;
  }
}

/**
 * Fetch yearly per-month breakdown for a given year.
 */
export async function getYearlyStats(
  token: string,
  year: number,
): Promise<unknown> {
  try {
    return await fetchQuery(
      api.orders.getYearlyStats,
      { year },
      { token, skipConvexDeploymentUrlCheck: true },
    );
  } catch (error) {
    console.error("[admin-orders] getYearlyStats fetch failed", error);
    return null;
  }
}
