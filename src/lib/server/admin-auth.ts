import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

function getConvexDeploymentUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  return url ? url : null;
}

function createNoStoreConvexClient(url: string): ConvexHttpClient {
  return new ConvexHttpClient(url, {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        cache: "no-store",
      }),
  });
}

export async function isClerkUserAdmin(userId: string): Promise<boolean> {
  const url = getConvexDeploymentUrl();
  if (!url) {
    console.error("[admin-auth] NEXT_PUBLIC_CONVEX_URL is not set; denying admin access.");
    return false;
  }

  try {
    return await createNoStoreConvexClient(url).query(api.admins.isAdmin, { userId });
  } catch (error) {
    console.error("[admin-auth] admins.isAdmin query failed; denying admin access.", error);
    return false;
  }
}
