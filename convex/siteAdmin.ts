/** Shared secret for content mutations (menu, reviews). Set in Convex env as `MENU_ADMIN_SECRET`. */
export function assertMenuAdminSecret(provided: string): void {
  const expected = process.env.MENU_ADMIN_SECRET;
  if (expected === undefined || expected.length === 0) {
    throw new Error("Server misconfiguration: MENU_ADMIN_SECRET is not set");
  }
  if (provided !== expected) {
    throw new Error("Unauthorized");
  }
}
