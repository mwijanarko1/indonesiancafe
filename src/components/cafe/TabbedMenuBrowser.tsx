"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  filterUnavailableMenuItems,
  formatMenuItemDisplayName,
  safeMenuImageHref,
  type MenuCategory,
  type SiteMenuContent,
} from "@/lib/cafe-menu";

function MenuImageLink({ label, href, variant }: { label: string; href: string | null; variant: "homepage" | "page" }) {
  const base =
    variant === "homepage"
      ? "rounded-full border-2 border-brand-gold/80 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-address transition motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]"
      : "inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full border-2 border-brand-maroon/25 bg-white/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-maroon transition motion-safe:duration-200 hover:border-brand-gold/80 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variant === "homepage" ? "hover:bg-white/10" : ""}`}
      >
        {label}
      </a>
    );
  }
  return (
    <span
      className={`${base} ${variant === "homepage" ? "cursor-not-allowed opacity-50" : "cursor-not-allowed opacity-45"}`}
      role="note"
      aria-label={`${label} — link unavailable`}
    >
      {label}
    </span>
  );
}

function PricedCategoryPanel({
  category,
  variant,
}: {
  category: Extract<MenuCategory, { variant: "priced" }>;
  variant: "homepage" | "page";
}) {
  if (variant === "homepage") {
    return (
      <>
        {category.subtitle ? (
          <p className="mb-8 text-center text-sm font-medium text-brand-address/80">{category.subtitle}</p>
        ) : null}
        <ul className="columns-1 gap-x-12 gap-y-0 md:columns-2">
          {category.items.map((item) => (
            <li key={item.name} className="mb-5 break-inside-avoid">
              <div className="flex flex-row items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="font-[family-name:var(--font-serif)] text-base font-semibold leading-snug sm:text-lg">
                    {formatMenuItemDisplayName(item.name)}
                  </h3>
                  {item.description ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-address/75 sm:text-[0.9375rem]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 font-[family-name:var(--font-serif)] text-base tabular-nums text-brand-gold/95 sm:text-lg">
                  {item.price}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className="rounded-xl border border-brand-maroon/15 bg-white/50 p-4 shadow-sm sm:p-6">
      {category.subtitle ? (
        <p className="mb-6 text-center text-sm font-medium text-brand-maroon/75">{category.subtitle}</p>
      ) : null}
      <ul className="columns-1 gap-x-10 gap-y-0 md:columns-2">
        {category.items.map((item) => (
          <li key={item.name} className="mb-4 break-inside-avoid">
            <div className="flex flex-row items-baseline justify-between gap-3 rounded-lg border border-brand-maroon/10 bg-brand-cream/80 px-3 py-3 sm:px-4">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="font-[family-name:var(--font-serif)] text-base font-semibold leading-snug text-brand-maroon sm:text-lg">
                  {formatMenuItemDisplayName(item.name)}
                </h3>
                {item.description ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-maroon/78 sm:text-[0.9375rem]">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 font-[family-name:var(--font-serif)] text-base tabular-nums text-brand-maroon sm:text-lg">
                {item.price}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DrinksCategoryPanel({
  category,
  variant,
}: {
  category: Extract<MenuCategory, { variant: "drinks" }>;
  variant: "homepage" | "page";
}) {
  if (variant === "homepage") {
    return (
      <div className="space-y-10">
        {category.groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 border-b border-white/20 pb-2 text-center font-[family-name:var(--font-cinzel)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-gold sm:text-left">
              {group.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-white/15 text-brand-address/70">
                    <th scope="col" className="py-2 pr-4 font-normal">
                      Drink
                    </th>
                    <th scope="col" className="w-24 py-2 pr-3 text-right font-normal tabular-nums sm:w-28">
                      Hot
                    </th>
                    <th scope="col" className="w-24 py-2 text-right font-normal tabular-nums sm:w-28">
                      Iced
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((row) => (
                    <tr key={row.name} className="border-b border-white/10">
                      <th
                        scope="row"
                        className="py-3 pr-4 font-[family-name:var(--font-serif)] font-semibold leading-snug"
                      >
                        {formatMenuItemDisplayName(row.name)}
                      </th>
                      <td className="py-3 pr-3 text-right tabular-nums text-brand-address/90">{row.hot ?? "—"}</td>
                      <td className="py-3 text-right tabular-nums text-brand-address/90">{row.iced ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-xl border border-brand-maroon/15 bg-white/50 p-4 shadow-sm sm:p-6">
      {category.groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-3 border-b border-brand-gold/40 pb-2 font-[family-name:var(--font-cinzel)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-maroon">
            {group.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] border-collapse text-left text-sm text-brand-maroon sm:text-base">
              <thead>
                <tr className="border-b border-brand-maroon/20 text-brand-maroon/65">
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Drink
                  </th>
                  <th scope="col" className="w-24 py-2 pr-3 text-right font-normal tabular-nums sm:w-28">
                    Hot
                  </th>
                  <th scope="col" className="w-24 py-2 text-right font-normal tabular-nums sm:w-28">
                    Iced
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((row) => (
                  <tr key={row.name} className="border-b border-brand-maroon/10">
                    <th
                      scope="row"
                      className="py-3 pr-4 font-[family-name:var(--font-serif)] font-semibold leading-snug"
                    >
                      {formatMenuItemDisplayName(row.name)}
                    </th>
                    <td className="py-3 pr-3 text-right tabular-nums text-brand-maroon/90">{row.hot ?? "—"}</td>
                    <td className="py-3 text-right tabular-nums text-brand-maroon/90">{row.iced ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export type TabbedMenuBrowserProps = {
  menu: SiteMenuContent;
  variant: "homepage" | "page";
};

export function TabbedMenuBrowser({ menu, variant }: TabbedMenuBrowserProps) {
  const displayMenu = useMemo(() => filterUnavailableMenuItems(menu), [menu]);
  const [active, setActive] = useState(displayMenu.categories[0]?.id ?? "");
  const tablistId = useId();
  const activeTabId = displayMenu.categories.some((c) => c.id === active)
    ? active
    : displayMenu.categories[0]?.id ?? "";
  const activeCategory =
    displayMenu.categories.find((c) => c.id === activeTabId) ?? displayMenu.categories[0];

  if (!activeCategory) {
    return null;
  }

  const tabListClass =
    variant === "homepage"
      ? "mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-white/15 pb-6"
      : "mt-2 flex snap-x snap-mandatory flex-nowrap items-stretch gap-2 overflow-x-auto overscroll-x-contain border-b border-brand-maroon/15 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden";

  const tabButtonClass = (selected: boolean) => {
    const base =
      "shrink-0 snap-start rounded-full px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:min-h-11 sm:px-5 sm:text-[0.7rem]";
    if (variant === "homepage") {
      return `${base} ${
        selected
          ? "bg-brand-gold text-brand-maroon"
          : "bg-white/10 text-brand-address hover:bg-white/15"
      }`;
    }
    return `${base} ${
      selected
        ? "bg-brand-gold text-brand-maroon shadow-sm ring-2 ring-brand-maroon/20"
        : "border border-brand-maroon/15 bg-white/80 text-brand-maroon hover:border-brand-gold/60 hover:bg-white"
    }`;
  };

  const panelWrapClass =
    variant === "homepage" ? "mt-10" : "mt-6";

  return (
    <div>
      <div
        className={tabListClass}
        role="tablist"
        aria-label="Menu categories"
        id={tablistId}
      >
        {displayMenu.categories.map((cat) => {
          const selected = activeTabId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tablistId}-${cat.id}-panel`}
              id={`${tablistId}-${cat.id}-tab`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(cat.id)}
              className={tabButtonClass(selected)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tablistId}-${activeCategory.id}-panel`}
        aria-labelledby={`${tablistId}-${activeCategory.id}-tab`}
        className={panelWrapClass}
      >
        {activeCategory.variant === "priced" ? (
          <PricedCategoryPanel category={activeCategory} variant={variant} />
        ) : (
          <DrinksCategoryPanel category={activeCategory} variant={variant} />
        )}
      </div>

      <div
        className={
          variant === "homepage"
            ? "mt-8 flex flex-wrap items-center justify-center gap-3"
            : "mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        }
      >
        <MenuImageLink
          label="Food menu (image)"
          href={safeMenuImageHref(menu.foodMenuImageUrl)}
          variant={variant}
        />
        <MenuImageLink
          label="Drinks menu (image)"
          href={safeMenuImageHref(menu.drinksMenuImageUrl)}
          variant={variant}
        />
      </div>

      {variant === "homepage" ? (
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/menu"
            className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full border-2 border-brand-gold bg-brand-gold/15 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-address transition motion-safe:duration-200 hover:bg-brand-gold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]"
          >
            Open full menu page
          </Link>
          <p className="text-center text-xs text-brand-address/65">{menu.footerTagline}</p>
        </div>
      ) : null}
    </div>
  );
}
