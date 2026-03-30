"use client";

import { TabbedMenuBrowser } from "./TabbedMenuBrowser";
import { useSiteMenu } from "./useSiteMenu";

export function MenuPageBody() {
  const { menu, contentLoading } = useSiteMenu();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10" aria-busy={contentLoading ? true : undefined}>
      <p className="text-center font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-maroon/70">
        Scan & browse
      </p>
      <h1 className="mt-3 text-center font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-maroon sm:text-4xl">
        Our menu
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-brand-maroon/85 sm:text-base">
        You are viewing the current Indonesian Cafe menu for our restaurant in Crookes, Sheffield. Tap a category to
        browse dishes and drinks — prices are what we charge in the cafe today.
      </p>
      <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-brand-maroon/15 bg-white/60 px-4 py-3 text-center text-sm leading-relaxed text-brand-maroon/88">
        {menu.disclaimer}
      </p>

      <div className="mt-10">
        <TabbedMenuBrowser menu={menu} variant="page" />
      </div>
    </div>
  );
}
