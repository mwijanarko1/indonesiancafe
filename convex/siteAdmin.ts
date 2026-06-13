/**
 * Admin helpers.
 * Image URL allowlist used by menu mutations (defence-in-depth).
 */

/* ------------------------------------------------------------------ */
/*  Image URL allowlist                                                */
/*                                                                     */
/*  Allowed:                                                           */
/*    - Same-site paths: `/menu-food.jpeg`                             */
/*    - Convex cloud storage: `https://*.convex.cloud/...`             */
/*    - Empty string (optional image fields)                           */
/*                                                                     */
/*  Rejected: arbitrary https hosts, `javascript:`, `data:`, `//`, …  */
/* ------------------------------------------------------------------ */

const ALLOWED_IMAGE_HOST_SUFFIXES = [".convex.cloud"];

function isAllowedImageUrlHost(hostname: string): boolean {
  return ALLOWED_IMAGE_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

/**
 * Validate an image URL against the allowlist. Throws on invalid.
 * Empty string is accepted (for optional fields).
 */
export function assertAllowedImageUrl(url: string): void {
  if (url === "") return;
  // Same-site absolute path (but not protocol-relative `//`)
  if (url.startsWith("/") && !url.startsWith("//")) {
    return;
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid image URL");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Image URL must use https for external hosts");
  }
  if (!isAllowedImageUrlHost(parsed.hostname)) {
    throw new Error("Image URL host is not in the allowlist");
  }
}

/**
 * Defense-in-depth for public menu reads (stale/wrong data in DB).
 * Returns the URL if allowed, empty string otherwise.
 */
export function safeImageUrl(url: string): string {
  if (url === "") return "";
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  try {
    const u = new URL(url);
    if (u.protocol === "https:" && isAllowedImageUrlHost(u.hostname)) {
      return url;
    }
  } catch {
    /* ignore */
  }
  return "";
}
