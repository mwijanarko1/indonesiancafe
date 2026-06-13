import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isClerkUserAdmin } from "@/lib/server/admin-auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isClerkUserAdmin(userId);
  if (!isAdmin) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-brand-cream-page">
      {/* Admin header — red bar matching brand */}
      <header className="sticky top-0 z-50 bg-brand-maroon shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-label)] min-w-0 shrink text-base font-bold uppercase tracking-[0.04em] text-brand-cream sm:text-lg"
          >
            Admin Dashboard
          </Link>

          <AdminLogoutButton />
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8">
        {children}
      </div>
    </div>
  );
}


