"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminOpeningTimesPanel,
  type OpeningHoursRow,
} from "@/components/admin/AdminOpeningTimesPanel";

export function AdminDashboardTabs({
  menuContent,
  ordersContent,
  statsContent,
  openingHours,
  openingHoursFootnote,
}: {
  menuContent: ReactNode;
  ordersContent: ReactNode;
  statsContent: ReactNode;
  openingHours: readonly OpeningHoursRow[];
  openingHoursFootnote: string;
}) {
  return (
    <Tabs defaultValue="menu" className="space-y-6">
      <div key="tabs-nav" className="space-y-3">
        <TabsList
          variant="line"
          className="relative h-auto w-full justify-start gap-6 border-b border-gray-200 bg-transparent p-0"
        >
          <TabsTrigger
            key="menu"
            value="menu"
            className="rounded-none px-0 pb-3 text-base font-semibold text-gray-500 after:!opacity-0 data-active:text-brand-maroon"
          >
            Menu
          </TabsTrigger>
          <TabsTrigger
            key="opening-times"
            value="opening-times"
            className="rounded-none px-0 pb-3 text-base font-semibold text-gray-500 after:!opacity-0 data-active:text-brand-maroon"
          >
            Opening times
          </TabsTrigger>
          <TabsTrigger
            key="orders"
            value="orders"
            className="rounded-none px-0 pb-3 text-base font-semibold text-gray-500 after:!opacity-0 data-active:text-brand-maroon"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            key="stats"
            value="stats"
            className="rounded-none px-0 pb-3 text-base font-semibold text-gray-500 after:!opacity-0 data-active:text-brand-maroon"
          >
            Stats
          </TabsTrigger>
          <TabsIndicator className="bg-brand-maroon" />
        </TabsList>
      </div>

      <TabsContent key="menu" value="menu" className="space-y-6">
        <div className="space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-label)] text-2xl font-bold uppercase tracking-wide text-brand-maroon sm:text-3xl">
              Menu
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Toggle item availability. Hidden items are not shown to customers.
            </p>
          </div>
          {menuContent}
        </div>
      </TabsContent>

      <TabsContent key="opening-times" value="opening-times">
        <AdminOpeningTimesPanel hours={openingHours} footnote={openingHoursFootnote} />
      </TabsContent>

      <TabsContent key="orders" value="orders" className="space-y-6">
        <div className="space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-label)] text-2xl font-bold uppercase tracking-wide text-brand-maroon sm:text-3xl">
              Orders
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Build orders and track order history.
            </p>
          </div>
          {ordersContent}
        </div>
      </TabsContent>

      <TabsContent key="stats" value="stats" className="space-y-6">
        <div className="space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-label)] text-2xl font-bold uppercase tracking-wide text-brand-maroon sm:text-3xl">
              Stats
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Revenue, orders, and best-selling items.
            </p>
          </div>
          {statsContent}
        </div>
      </TabsContent>
    </Tabs>
  );
}
