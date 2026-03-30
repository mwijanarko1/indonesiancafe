/**
 * Site content admin is exposed only via Convex HTTP actions (`convex/http.ts`).
 * Set `MENU_ADMIN_SECRET` in the Convex dashboard and send `Authorization: Bearer <secret>`.
 * Never pass this token from browser code.
 */

export function assertBearerSiteAdmin(authorizationHeader: string | null): void {
  const expected = process.env.MENU_ADMIN_SECRET;
  if (expected === undefined || expected.length === 0) {
    throw new Error("Server misconfiguration: MENU_ADMIN_SECRET is not set");
  }
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authorizationHeader.slice("Bearer ".length).trim();
  if (token.length === 0 || token !== expected) {
    throw new Error("Unauthorized");
  }
}

/**
 * Allow absolute http(s) URLs or same-site path-only URLs (`/menu.jpg`).
 * Rejects `javascript:`, `data:`, `//evil.example`, etc.
 */
export function assertHttpOrHttpsUrl(url: string): void {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return;
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid image URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Image URL must use http or https");
  }
}

/** Defense in depth for public menu reads (stale bad data in DB). */
export function safeHttpOrHttpsUrl(url: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return url;
    }
  } catch {
    /* ignore */
  }
  return "";
}
