"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const clerk = useClerk();
  const router = useRouter();

  function handleLogout() {
    clerk.signOut({ redirectUrl: "/sign-in" });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-brand-cream/30 bg-transparent px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-brand-cream/85 transition hover:bg-brand-cream/10 hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:px-6 sm:text-xs"
    >
      Logout
    </button>
  );
}
