"use client";

import { useQuery } from "convex/react";
import { useEffect, useId, useMemo, useState } from "react";
import { api } from "@convex/_generated/api";
import {
  DEFAULT_SITE_MENU,
  filterUnavailableMenuItems,
  type MenuCategory,
  type SiteMenuContent,
} from "@/lib/cafe-menu";
import { ForkSpoonRule } from "./ForkSpoonRule";

function PricedCategoryPanel({ category }: { category: Extract<MenuCategory, { variant: "priced" }> }) {
  return (
    <>
      {category.subtitle ? (
        <p className="mb-8 text-center text-sm font-medium text-brand-address/80">{category.subtitle}</p>
      ) : null}
      <ul className="columns-1 gap-x-12 gap-y-0 md:columns-2">
        {category.items.map((item) => (
          <li key={item.name} className="mb-5 break-inside-avoid">
            <div className="flex flex-row items-baseline justify-between gap-4 border-b border-white/10 pb-4">
              <h3 className="font-[family-name:var(--font-serif)] text-base font-semibold leading-snug sm:text-lg">
                {item.name}
              </h3>
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

function DrinksCategoryPanel({ category }: { category: Extract<MenuCategory, { variant: "drinks" }> }) {
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
                    <th scope="row" className="py-3 pr-4 font-[family-name:var(--font-serif)] font-semibold leading-snug">
                      {row.name}
                    </th>
                    <td className="py-3 pr-3 text-right tabular-nums text-brand-address/90">
                      {row.hot ?? "—"}
                    </td>
                    <td className="py-3 text-right tabular-nums text-brand-address/90">
                      {row.iced ?? "—"}
                    </td>
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

function MenuSectionView({
  menu,
  contentLoading,
}: {
  menu: SiteMenuContent;
  contentLoading?: boolean;
}) {
  const displayMenu = useMemo(() => filterUnavailableMenuItems(menu), [menu]);
  const [active, setActive] = useState(displayMenu.categories[0]?.id ?? "");
  const tablistId = useId();

  useEffect(() => {
    if (!displayMenu.categories.some((c) => c.id === active)) {
      setActive(displayMenu.categories[0]?.id ?? "");
    }
  }, [displayMenu.categories, active]);

  const activeCategory =
    displayMenu.categories.find((c) => c.id === active) ??
    displayMenu.categories[0];

  if (!activeCategory) {
    return null;
  }

  return (
    <section
      id="menu"
      className="scroll-mt-20 bg-brand-crimson px-4 py-16 text-brand-address sm:py-20"
      aria-labelledby="menu-heading"
      aria-busy={contentLoading ? true : undefined}
    >
      <div className="mx-auto max-w-6xl">
        <ForkSpoonRule className="mb-6 [&_svg]:text-brand-gold" />
        <h2
          id="menu-heading"
          className="text-center font-[family-name:var(--font-serif)] text-3xl font-semibold sm:text-4xl"
        >
          Menu
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-brand-address/85 sm:text-base">
          {menu.disclaimer}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-white/15 pb-6"
          role="tablist"
          aria-label="Menu categories"
          id={tablistId}
        >
          {displayMenu.categories.map((cat) => {
            const selected = active === cat.id;
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
                className={`rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:px-5 sm:text-[0.7rem] ${
                  selected
                    ? "bg-brand-gold text-brand-maroon"
                    : "bg-white/10 text-brand-address hover:bg-white/15"
                }`}
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
          className="mt-10"
        >
          {activeCategory.variant === "priced" ? (
            <PricedCategoryPanel category={activeCategory} />
          ) : (
            <DrinksCategoryPanel category={activeCategory} />
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={menu.foodMenuImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-brand-gold/80 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-address transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]"
          >
            Food menu (image)
          </a>
          <a
            href={menu.drinksMenuImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-brand-gold/80 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-address transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]"
          >
            Drinks menu (image)
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-brand-address/65">{menu.footerTagline}</p>
      </div>
    </section>
  );
}

function MenuSectionWithConvex() {
  const remote = useQuery(api.menu.get, {});
  const menu =
    remote !== undefined && remote !== null ? remote : DEFAULT_SITE_MENU;
  const contentLoading = remote === undefined;

  return <MenuSectionView menu={menu} contentLoading={contentLoading} />;
}

export function MenuSection() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!convexUrl) {
    return <MenuSectionView menu={DEFAULT_SITE_MENU} />;
  }
  return <MenuSectionWithConvex />;
}
