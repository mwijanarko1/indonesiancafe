import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

export type AdminAccessFailureReason =
  | "no-token"
  | "no-convex-url"
  | "not-admin"
  | "locked-out"
  | "rate-limited"
  | "error";

export type AdminAccessResult =
  | { ok: true }
  | { ok: false; reason: AdminAccessFailureReason; message: string };

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

function getConvexErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    if ("data" in error && typeof error.data === "string") {
      return error.data;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return "Unable to verify admin access.";
}

function classifyAdminAccessError(message: string): AdminAccessFailureReason {
  const normalized = message.toLowerCase();

  if (normalized.includes("too many failed admin attempts")) {
    return "locked-out";
  }

  if (normalized.includes("rate limit exceeded")) {
    return "rate-limited";
  }

  if (
    normalized.includes("not authenticated") ||
    normalized.includes("invalid identity")
  ) {
    return "no-token";
  }

  return "error";
}

export async function verifyAdminAccess(
  token: string | null,
): Promise<AdminAccessResult> {
  if (!token) {
    console.error("[admin-auth] No Clerk token; denying admin access.");
    return {
      ok: false,
      reason: "no-token",
      message:
        "Your sign-in session is missing the Convex token. Sign out, sign back in, and confirm the Clerk JWT template named \"convex\" exists.",
    };
  }

  const url = getConvexDeploymentUrl();
  if (!url) {
    console.error("[admin-auth] NEXT_PUBLIC_CONVEX_URL is not set; denying admin access.");
    return {
      ok: false,
      reason: "no-convex-url",
      message: "Admin access is unavailable because NEXT_PUBLIC_CONVEX_URL is not configured.",
    };
  }

  try {
    const client = createNoStoreConvexClient(url);
    client.setAuth(token);
    const isAdmin = await client.mutation(api.admins.isAdmin);

    if (isAdmin) {
      return { ok: true };
    }

    return {
      ok: false,
      reason: "not-admin",
      message:
        "You are signed in, but this account is not registered as an admin. Ask an existing admin to add your Clerk user ID to the admins table.",
    };
  } catch (error) {
    const message = getConvexErrorMessage(error);
    const reason = classifyAdminAccessError(message);
    console.error("[admin-auth] admins.isAdmin mutation failed; denying admin access.", error);

    if (reason === "locked-out") {
      return { ok: false, reason, message };
    }

    if (reason === "rate-limited") {
      return {
        ok: false,
        reason,
        message: "Too many admin checks in a short period. Wait a minute, then try again.",
      };
    }

    if (reason === "no-token") {
      return {
        ok: false,
        reason,
        message:
          "Convex rejected the Clerk session token. Sign out, sign back in, and confirm the Clerk JWT template named \"convex\" matches your Convex CLERK_JWT_ISSUER setting.",
      };
    }

    return {
      ok: false,
      reason: "error",
      message:
        "Admin verification failed. If you just deployed, push the latest Convex functions with `npx convex dev` or `npx convex deploy`, then try again.",
    };
  }
}

export async function isClerkUserAdmin(token: string | null): Promise<boolean> {
  const access = await verifyAdminAccess(token);
  return access.ok;
}

export function adminAccessErrorMessage(
  reason: AdminAccessFailureReason | string | null | undefined,
): string | null {
  switch (reason) {
    case "no-token":
      return "Your sign-in session is missing the Convex token. Sign out, sign back in, and confirm the Clerk JWT template named \"convex\" exists.";
    case "no-convex-url":
      return "Admin access is unavailable because NEXT_PUBLIC_CONVEX_URL is not configured.";
    case "not-admin":
      return "You are signed in, but this account is not registered as an admin.";
    case "locked-out":
      return "Too many failed admin attempts. Wait for the lockout to expire, then try again.";
    case "rate-limited":
      return "Too many admin checks in a short period. Wait a minute, then try again.";
    case "error":
      return "Admin verification failed. Push the latest Convex functions, then try again.";
    default:
      return null;
  }
}
