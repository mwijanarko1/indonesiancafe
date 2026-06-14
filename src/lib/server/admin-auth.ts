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

export async function isClerkUserAdmin(token: string | null): Promise<boolean> {
  if (!token) {
    console.error("[admin-auth] No Clerk token; denying admin access.");
    return false;
  }

  const url = getConvexDeploymentUrl();
  if (!url) {
    console.error("[admin-auth] NEXT_PUBLIC_CONVEX_URL is not set; denying admin access.");
    return false;
  }

  try {
    const client = createNoStoreConvexClient(url);
    client.setAuth(token);
    return await client.mutation(api.admins.isAdmin);
  } catch (error) {
    console.error("[admin-auth] admins.isAdmin mutation failed; denying admin access.", error);
    return false;
  }
}
