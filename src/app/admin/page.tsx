import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminDashboardTabs } from "@/components/admin/AdminDashboardTabs";
import { AdminMenuDashboard } from "@/components/admin/AdminMenuDashboard";
import { AdminOrderDashboard } from "@/components/admin/AdminOrderDashboard";
import { AdminStatsPanel } from "@/components/admin/AdminStatsPanel";
import { isClerkUserAdmin } from "@/lib/server/admin-auth";
import { getAdminMenu } from "@/lib/server/admin-menu";
import {
  getOrderStats,
  getOrdersByDay,
} from "@/lib/server/admin-orders";
import { getSiteOpeningHours } from "@/lib/server/site-content";
import { DEFAULT_SITE_MENU, type MenuCategory } from "@/lib/cafe-menu";

export const metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

function todayStart(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export default async function AdminDashboardPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken({ template: "convex" });
  const isAdmin = await isClerkUserAdmin(token);
  if (!isAdmin) redirect("/sign-in");
  if (!token) redirect("/sign-in");

  const menuData = await getAdminMenu(token);
  const statsData = await getOrderStats(token);
  const todayOrdersData = await getOrdersByDay(token, todayStart(), todayStart() + 86400000);
  const openingHoursContent = await getSiteOpeningHours();

  const menuContent = menuData ? (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    <AdminMenuDashboard key="admin-menu-dashboard" data={menuData as any} />
  ) : (
    <div
      key="admin-menu-empty"
      className="rounded-xl border border-dashed border-gray-300 bg-brand-cream px-6 py-12 text-center"
    >
      <h2 className="text-lg font-semibold text-gray-700">No menu data found</h2>
      <p className="mt-2 text-sm text-gray-500">
        Seed the menu via the Convex dashboard or the{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">convex:seed</code>{" "}
        npm script, then refresh this page.
      </p>
    </div>
  );

  const defaultOrders: unknown[] = [];
  const todayOrders = Array.isArray(todayOrdersData) ? todayOrdersData : defaultOrders;

  const defaultStats = {
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    itemsSold: [],
  };
  const stats =
    statsData && typeof statsData === "object" && "totalOrders" in statsData
      ? (statsData as {
          totalOrders: number;
          totalRevenue: number;
          todayOrders: number;
          todayRevenue: number;
          itemsSold: { menuItemName: string; quantity: number; revenue: number }[];
        })
      : defaultStats;

  // Use menu data categories from the admin fetch or fallback defaults for the order builder
  const menuCategories: MenuCategory[] =
    menuData &&
    typeof menuData === "object" &&
    menuData !== null &&
    "categories" in menuData
      ? (menuData as { categories: MenuCategory[] }).categories
      : DEFAULT_SITE_MENU.categories;

  return (
    <AdminDashboardTabs
      menuContent={menuContent}
      ordersContent={
        <AdminOrderDashboard
          key="admin-order-dashboard"
          categories={menuCategories}
          orders={todayOrders as any}
        />
      }
      statsContent={
        <AdminStatsPanel
          key="admin-stats-panel"
          stats={stats}
        />
      }
      openingHours={openingHoursContent.hours}
      openingHoursFootnote={openingHoursContent.footnote}
    />
  );
}
