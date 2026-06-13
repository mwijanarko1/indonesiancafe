import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminDashboardTabs } from "@/components/admin/AdminDashboardTabs";
import { AdminMenuDashboard } from "@/components/admin/AdminMenuDashboard";
import { isClerkUserAdmin } from "@/lib/server/admin-auth";
import { getAdminMenu } from "@/lib/server/admin-menu";
import { getSiteOpeningHours } from "@/lib/server/site-content";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const isAdmin = await isClerkUserAdmin(userId);
  if (!isAdmin) redirect("/sign-in");

  const token = await getToken({ template: "convex" });
  if (!token) redirect("/sign-in");

  const menuData = await getAdminMenu(token);
  const openingHoursContent = await getSiteOpeningHours();

  const menuContent = menuData ? (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    <AdminMenuDashboard data={menuData as any} />
  ) : (
    <div className="rounded-xl border border-dashed border-gray-300 bg-brand-cream px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-gray-700">No menu data found</h2>
      <p className="mt-2 text-sm text-gray-500">
        Seed the menu via the Convex dashboard or the{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">convex:seed</code>{" "}
        npm script, then refresh this page.
      </p>
    </div>
  );

  return (
    <AdminDashboardTabs
      menuContent={menuContent}
      openingHours={openingHoursContent.hours}
      openingHoursFootnote={openingHoursContent.footnote}
    />
  );
}
