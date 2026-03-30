"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import {
  filterUnavailableMenuItems,
  formatMenuItemDisplayName,
  safeMenuImageHref,
  type DrinkMenuGroup,
  type MenuCategory,
  type PricedMenuItem,
  type SiteMenuContent,
} from "@/lib/cafe-menu";
import { menuItemPhotoIfMatched } from "@/lib/menu-item-photos";

const SECTION_IDS = {
  mains: "menu-section-mains",
  sides: "menu-section-sides",
  desserts: "menu-section-desserts",
  drinks: "menu-section-drinks",
} as const;

type SectionKey = keyof typeof SECTION_IDS;

function isPriced(cat: MenuCategory): cat is Extract<MenuCategory, { variant: "priced" }> {
  return cat.variant === "priced";
}

function isDrinks(cat: MenuCategory): cat is Extract<MenuCategory, { variant: "drinks" }> {
  return cat.variant === "drinks";
}

function itemBadges(name: string): string[] {
  const n = name.toLowerCase();
  const badges: string[] = [];
  if (n.includes("rendang")) badges.push("Signature");
  if (n.includes("geprek") || n.includes("sambal") || n.includes("spicy") || n.includes("chilli")) {
    badges.push("Extra spicy");
  }
  if (n.includes("nasi padang") || n.includes("komplit")) badges.push("Chef's choice");
  return badges;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 border-b border-brand-maroon/15 pb-3">
      <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold uppercase tracking-[0.12em] text-brand-maroon sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

function MainsFeaturedBlock({ items }: { items: PricedMenuItem[] }) {
  if (items.length === 0) return null;
  const [a, b, ...rest] = items;
  const row = rest.slice(0, 3);
  const more = rest.slice(3);
  const photoA = menuItemPhotoIfMatched(a.name);
  const photoB = b ? menuItemPhotoIfMatched(b.name) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <article className="relative overflow-hidden rounded-2xl bg-stone-200/80 shadow-sm lg:col-span-8">
          <div className="relative aspect-[16/10] min-h-[220px] w-full sm:aspect-[21/9] sm:min-h-[280px]">
            {photoA ? (
              <Image
                src={photoA}
                alt={formatMenuItemDisplayName(a.name)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-maroon via-brand-maroon to-brand-oxblood" aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/90 via-brand-maroon/20 to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {itemBadges(a.name).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-brand-maroon shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-white sm:text-3xl">
                {formatMenuItemDisplayName(a.name)}
              </h3>
              {a.description ? (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">{a.description}</p>
              ) : null}
              <p className="mt-4 text-right font-[family-name:var(--font-serif)] text-xl font-semibold tabular-nums text-brand-gold">
                {a.price}
              </p>
            </div>
          </div>
        </article>

        {b ? (
          <article className="flex flex-col overflow-hidden rounded-2xl border border-brand-maroon/10 bg-[#f5ebe0] shadow-sm lg:col-span-4">
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold text-brand-maroon sm:text-xl">
                {formatMenuItemDisplayName(b.name)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{b.description}</p>
              <p className="mt-auto pt-4 font-[family-name:var(--font-serif)] text-lg font-semibold tabular-nums text-brand-maroon">
                {b.price}
              </p>
            </div>
            {photoB ? (
              <div className="relative aspect-[4/3] w-full bg-stone-300/60">
                <Image
                  src={photoB}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            ) : null}
          </article>
        ) : null}
      </div>

      {row.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {row.map((item) => (
            <article
              key={item.name}
              className="flex flex-col rounded-xl border border-brand-maroon/10 bg-[#f5ebe0] p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-wrap gap-1.5">
                {itemBadges(item.name).map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md bg-brand-maroon/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-brand-maroon"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <h3 className="mt-2 font-[family-name:var(--font-serif)] text-base font-semibold text-brand-maroon sm:text-lg">
                {formatMenuItemDisplayName(item.name)}
              </h3>
              {item.description ? <p className="mt-1.5 flex-1 text-sm leading-relaxed text-stone-600">{item.description}</p> : null}
              <p className="mt-3 font-[family-name:var(--font-serif)] font-semibold tabular-nums text-brand-maroon">{item.price}</p>
            </article>
          ))}
        </div>
      ) : null}

      {more.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-brand-maroon/8 bg-white/70 px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-[family-name:var(--font-serif)] font-semibold text-brand-maroon">
                  {formatMenuItemDisplayName(item.name)}
                </p>
                <span className="shrink-0 font-[family-name:var(--font-serif)] text-sm font-semibold tabular-nums text-brand-maroon">
                  {item.price}
                </span>
              </div>
              {item.description ? <p className="mt-1 text-xs leading-relaxed text-stone-600">{item.description}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PricedSubsection({ label, subtitle, items }: { label: string; subtitle?: string; items: PricedMenuItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-12">
      <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold uppercase tracking-[0.08em] text-brand-maroon">{label}</h3>
      {subtitle ? <p className="mt-1 text-sm text-stone-600">{subtitle}</p> : null}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="rounded-xl border border-brand-maroon/10 bg-[#f5ebe0]/90 px-4 py-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-serif)] font-semibold text-brand-maroon">
                {formatMenuItemDisplayName(item.name)}
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-brand-maroon">{item.price}</span>
            </div>
            {item.description ? <p className="mt-1 text-xs text-stone-600">{item.description}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidesRow({ items }: { items: PricedMenuItem[] }) {
  const chunks: PricedMenuItem[][] = [];
  for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));
  return (
    <div className="space-y-4">
      {chunks.map((group, gi) => (
        <div key={gi} className="grid gap-4 md:grid-cols-3">
          {group.map((item) => {
            const sidePhoto = menuItemPhotoIfMatched(item.name);
            return (
            <article
              key={item.name}
              className="flex gap-4 overflow-hidden rounded-xl border border-brand-maroon/10 bg-[#f5ebe0] p-3 shadow-sm sm:p-4"
            >
              {sidePhoto ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-300/50 sm:h-28 sm:w-28">
                  <Image
                    src={sidePhoto}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1 py-0.5">
                <h3 className="font-[family-name:var(--font-serif)] text-base font-semibold text-brand-maroon">
                  {formatMenuItemDisplayName(item.name)}
                </h3>
                {item.description ? (
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-stone-600">{item.description}</p>
                ) : null}
                <p className="mt-2 font-[family-name:var(--font-serif)] text-sm font-semibold tabular-nums text-brand-maroon">
                  {item.price}
                </p>
              </div>
            </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DessertsColumn({ items }: { items: PricedMenuItem[] }) {
  return (
    <div className="relative pl-4 sm:pl-5">
      <div className="absolute bottom-0 left-0 top-2 w-1 rounded-full bg-brand-maroon" aria-hidden />
      <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold uppercase tracking-[0.12em] text-brand-maroon">Desserts</h2>
      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.name} className="flex gap-4 border-b border-brand-maroon/10 pb-5 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="font-[family-name:var(--font-serif)] font-semibold text-brand-maroon">
                {formatMenuItemDisplayName(item.name)}
              </p>
              {item.description ? <p className="mt-1 text-sm text-stone-600">{item.description}</p> : null}
            </div>
            <p className="shrink-0 font-[family-name:var(--font-serif)] font-semibold tabular-nums text-brand-maroon">{item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDrinkPrice(hot: string | null, iced: string | null): string {
  if (hot && iced) return `${hot} hot · ${iced} iced`;
  if (hot) return hot;
  if (iced) return iced;
  return "—";
}

function DrinksPanel({ groups }: { groups: DrinkMenuGroup[] }) {
  return (
    <div className="rounded-2xl border border-brand-maroon/10 bg-[#f5ebe0] p-6 shadow-sm sm:p-8">
      <h2 className="text-center font-[family-name:var(--font-serif)] text-lg font-bold uppercase tracking-[0.18em] text-brand-maroon sm:text-xl">
        Refreshing drinks
      </h2>
      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="border-b border-brand-maroon/15 pb-2 text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
              {g.title}
            </p>
            <ul className="mt-4 space-y-3">
              {g.items.map((row) => (
                <li key={row.name} className="flex items-baseline justify-between gap-4 text-sm sm:text-base">
                  <span className="font-[family-name:var(--font-serif)] font-semibold text-brand-maroon">
                    {formatMenuItemDisplayName(row.name)}
                  </span>
                  <span className="shrink-0 text-right text-sm font-medium tabular-nums text-brand-maroon/90">
                    {formatDrinkPrice(row.hot, row.iced)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PdfLinks({ menu }: { menu: SiteMenuContent }) {
  const food = safeMenuImageHref(menu.foodMenuImageUrl);
  const drinks = safeMenuImageHref(menu.drinksMenuImageUrl);
  const pill =
    "inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full border border-brand-maroon/20 bg-white px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand-maroon transition hover:border-brand-maroon/40 hover:bg-[#f5ebe0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon sm:text-[0.7rem]";
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-3 border-t border-brand-maroon/10 pt-10">
      {food ? (
        <a href={food} target="_blank" rel="noopener noreferrer" className={pill}>
          Food menu (PDF / image)
        </a>
      ) : null}
      {drinks ? (
        <a href={drinks} target="_blank" rel="noopener noreferrer" className={pill}>
          Drinks menu (PDF / image)
        </a>
      ) : null}
    </div>
  );
}

export function MenuMagazineView({ menu }: { menu: SiteMenuContent }) {
  const displayMenu = useMemo(() => filterUnavailableMenuItems(menu), [menu]);
  const [activeSection, setActiveSection] = useState<SectionKey>("mains");

  const pricedCats = displayMenu.categories.filter(isPriced);
  const drinksCat = displayMenu.categories.find(isDrinks);

  const mainsCat = pricedCats.find((c) => c.id === "mains");
  const breakfast = pricedCats.find((c) => c.id === "breakfast");
  const nasi = pricedCats.find((c) => c.id === "nasi-padang");
  const packed = pricedCats.find((c) => c.id === "packed-lunch");
  const sidesCat = pricedCats.find((c) => c.id === "sides");
  const dessertCat = pricedCats.find((c) => c.id === "dessert");

  const selectSection = useCallback((key: SectionKey) => {
    setActiveSection(key);
  }, []);

  const panelClass = "scroll-mt-28 pt-12 md:scroll-mt-36";

  const chips: { key: SectionKey; label: string }[] = [
    { key: "mains", label: "Main courses" },
    { key: "sides", label: "Sides" },
    { key: "desserts", label: "Desserts" },
    { key: "drinks", label: "Drinks" },
  ];

  return (
    <div>
      <div className="sticky top-[3.75rem] z-40 -mx-4 border-b border-brand-maroon/10 bg-[#fcf4e8]/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-[4.5rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2">
          {chips.map(({ key, label }) => {
            const selected = activeSection === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectSection(key)}
                className={`rounded-full px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.06em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon sm:px-5 sm:text-xs ${
                  selected
                    ? "bg-brand-maroon text-white shadow-sm"
                    : "bg-[#f5ebe0] text-brand-charcoal hover:bg-[#ede4d4]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {activeSection === "mains" ? (
        <section id={SECTION_IDS.mains} className={panelClass}>
          {mainsCat && mainsCat.items.length > 0 ? <MainsFeaturedBlock items={mainsCat.items} /> : null}
          {breakfast && breakfast.items.length > 0 ? (
            <PricedSubsection label={breakfast.label} subtitle={breakfast.subtitle} items={breakfast.items} />
          ) : null}
          {nasi && nasi.items.length > 0 ? <PricedSubsection label={nasi.label} items={nasi.items} /> : null}
          {packed && packed.items.length > 0 ? <PricedSubsection label={packed.label} subtitle={packed.subtitle} items={packed.items} /> : null}
        </section>
      ) : null}

      {activeSection === "sides" ? (
        <section id={SECTION_IDS.sides} className={panelClass}>
          <SectionHeader title="Sides" />
          {sidesCat && sidesCat.items.length > 0 ? <SidesRow items={sidesCat.items} /> : (
            <p className="text-sm text-stone-500">No sides listed right now.</p>
          )}
        </section>
      ) : null}

      {activeSection === "desserts" ? (
        <section id={SECTION_IDS.desserts} className={panelClass}>
          {dessertCat && dessertCat.items.length > 0 ? (
            <DessertsColumn items={dessertCat.items} />
          ) : (
            <p className="text-sm text-stone-500">No desserts listed right now.</p>
          )}
        </section>
      ) : null}

      {activeSection === "drinks" ? (
        <section id={SECTION_IDS.drinks} className={panelClass}>
          {drinksCat && drinksCat.groups.length > 0 ? (
            <DrinksPanel groups={drinksCat.groups} />
          ) : (
            <p className="text-sm text-stone-500">Drinks coming soon.</p>
          )}
        </section>
      ) : null}

      <PdfLinks menu={menu} />
    </div>
  );
}
