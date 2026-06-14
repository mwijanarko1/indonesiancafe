"use server";

import { auth } from "@clerk/nextjs/server";
import {
  type AdminAccessResult,
  verifyAdminAccess,
} from "@/lib/server/admin-auth";

export async function checkAdminAccessAction(): Promise<AdminAccessResult> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  return verifyAdminAccess(token);
}
