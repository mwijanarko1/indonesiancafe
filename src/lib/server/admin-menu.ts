import "server-only";

import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";

/**
 * Fetch the full menu tree (including unavailable items + DB _id) for the admin dashboard.
 * Uses Convex query function with Clerk JWT token for authorization.
 * Returns `null` when the request fails.
 */
export async function getAdminMenu(token: string): Promise<unknown> {
  try {
    return await fetchQuery(api.menu.getAdminMenu, {}, { token, skipConvexDeploymentUrlCheck: true });
  } catch (error) {
    console.error("[admin-menu] fetch failed", error);
    return null;
  }
}
