"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminOpeningTimesPanel,
  type OpeningHoursRow,
} from "@/components/admin/AdminOpeningTimesPanel";

export function AdminDashboardTabs({
  menuContent,
  openingHours,
  openingHoursFootnote,
}: {
  menuContent: ReactNode;
  openingHours: readonly OpeningHoursRow[];
  openingHoursFootnote: string;
}) {
  return (
    <Tabs defaultValue="menu" className="space-y-6">
      <div className="space-y-3">
        <TabsList
          variant="line"
          className="relative h-auto w-full justify-start gap-6 border-b border-gray-200 bg-transparent p-0"
        >
          <TabsTrigger
            value="menu"
            className="rounded-none px-0 pb-3 text-base font-semibold text-gray-500 after:!opacity-0 data-active:text-brand-maroon"
          >
            Menu
          </TabsTrigger>
          <TabsTrigger
            value="opening-times"
            className="rounded-none px-0 pb-3 text-base font-semibold text-gray-500 after:!opacity-0 data-active:text-brand-maroon"
          >
            Opening times
          </TabsTrigger>
          <TabsIndicator className="bg-brand-maroon" />
        </TabsList>
      </div>

      <TabsContent value="menu" className="space-y-6">
        <div>
          <h1 className="font-[family-name:var(--font-label)] text-2xl font-bold uppercase tracking-wide text-brand-maroon sm:text-3xl">
            Menu
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Toggle item availability. Hidden items are not shown to customers.
          </p>
        </div>
        {menuContent}
      </TabsContent>

      <TabsContent value="opening-times">
        <AdminOpeningTimesPanel hours={openingHours} footnote={openingHoursFootnote} />
      </TabsContent>
    </Tabs>
  );
}
