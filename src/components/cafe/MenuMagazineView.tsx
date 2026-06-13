"use client";

import Image from "next/image";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  filterUnavailableMenuItems,
  formatMenuItemDisplayName,
  safeMenuImageHref,
  type DrinkMenuGroup,
  type DrinkMenuItem,
  type MenuCategory,
  type PricedMenuItem,
  type SiteMenuContent,
} from "@/lib/cafe-menu";
import { menuItemPhotoSrc } from "@/lib/menu-item-photos";
import { MenuItemDetailModal, type MenuDetailSelection } from "./MenuItemDetailModal";



const PRESSABLE =
  "cursor-pointer select-none transition hover:opacity-[0.97] focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream";

function pricedItemPressableHandlers(item: PricedMenuItem, onSelect: (item: PricedMenuItem) => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: () => onSelect(item),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(item);
      }
    },
  };
}

function drinkItemPressableHandlers(item: DrinkMenuItem, onSelect: (item: DrinkMenuItem) => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: () => onSelect(item),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(item);
      }
    },
  };
}

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

function MenuColumnSection({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function MenuColumnSubheading({ label }: { label: string }) {
  return (
    <p className="border-b border-brand-maroon/15 pb-2 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
      {label}
    </p>
  );
}

function MenuPricedRow({
  item,
  onSelectItem,
}: {
  item: PricedMenuItem;
  onSelectItem: (item: PricedMenuItem) => void;
}) {
  const photo = menuItemPhotoSrc(item);
  const badges = itemBadges(item.name);

  return (
    <li
      className={`flex gap-4 border-b border-brand-maroon/10 pb-5 last:border-0 ${PRESSABLE}`}
      aria-haspopup="dialog"
      aria-controls="menu-item-detail"
      {...pricedItemPressableHandlers(item, onSelectItem)}
    >
      {photo ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-200/80 sm:h-24 sm:w-24">
          <Image src={photo} alt="" fill className="object-cover" sizes="96px" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        {badges.length > 0 ? (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md bg-brand-maroon/10 px-2 py-0.5 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-wide text-brand-maroon"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
        <p className="font-[family-name:var(--font-serif)] font-bold text-brand-maroon">
          {formatMenuItemDisplayName(item.name)}
        </p>
        {item.description ? <p className="mt-1 text-sm text-stone-600">{item.description}</p> : null}
      </div>
      <p className="shrink-0 font-[family-name:var(--font-serif)] font-bold tabular-nums text-brand-maroon">
        {item.price}
      </p>
    </li>
  );
}

function MenuPricedList({
  items,
  onSelectItem,
}: {
  items: PricedMenuItem[];
  onSelectItem: (item: PricedMenuItem) => void;
}) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <MenuPricedRow key={item.name} item={item} onSelectItem={onSelectItem} />
      ))}
    </ul>
  );
}

function MenuPricedSubsection({
  label,
  subtitle,
  items,
  onSelectItem,
}: {
  label: string;
  subtitle?: string;
  items: PricedMenuItem[];
  onSelectItem: (item: PricedMenuItem) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-10">
      <MenuColumnSubheading label={label} />
      {subtitle ? <p className="mt-2 text-sm text-stone-600">{subtitle}</p> : null}
      <ul className="mt-4 space-y-5">
        {items.map((item) => (
          <MenuPricedRow key={item.name} item={item} onSelectItem={onSelectItem} />
        ))}
      </ul>
    </div>
  );
}

function formatDrinkPrice(hot: string | null, iced: string | null): string {
  if (hot && iced) return `${hot} hot · ${iced} iced`;
  if (hot) return hot;
  if (iced) return iced;
  return "-";
}

function DrinksColumn({
  groups,
  onSelectDrink,
}: {
  groups: DrinkMenuGroup[];
  onSelectDrink: (item: DrinkMenuItem) => void;
}) {
  return (
    <MenuColumnSection>
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <MenuColumnSubheading label={group.title} />
            <ul className="mt-4 space-y-5">
              {group.items.map((row) => {
                const drinkPhoto = menuItemPhotoSrc(row);
                return (
                  <li
                    key={row.name}
                    className={`flex gap-4 border-b border-brand-maroon/10 pb-5 last:border-0 ${PRESSABLE}`}
                    aria-haspopup="dialog"
                    aria-controls="menu-item-detail"
                    {...drinkItemPressableHandlers(row, onSelectDrink)}
                  >
                    {drinkPhoto ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-200/80 sm:h-24 sm:w-24">
                        <Image src={drinkPhoto} alt="" fill className="object-cover" sizes="96px" />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-[family-name:var(--font-serif)] font-bold text-brand-maroon">
                        {formatMenuItemDisplayName(row.name)}
                      </p>
                    </div>
                    <p className="shrink-0 text-right font-[family-name:var(--font-serif)] text-sm font-bold tabular-nums text-brand-maroon">
                      {formatDrinkPrice(row.hot, row.iced)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </MenuColumnSection>
  );
}

function PdfLinks({ menu }: { menu: SiteMenuContent }) {
  const food = safeMenuImageHref(menu.foodMenuImageUrl);
  const drinks = safeMenuImageHref(menu.drinksMenuImageUrl);
  const pill =
    "inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full border border-brand-maroon/20 bg-white px-5 py-2.5 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-maroon transition hover:border-brand-maroon/40 hover:bg-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon sm:text-[0.7rem]";
  return (
    <div className="mt-16 border-t border-brand-maroon/10 pt-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
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
      <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-brand-maroon/10 bg-white/70 px-4 py-3 text-center text-sm leading-relaxed text-stone-700">
        {menu.disclaimer}
      </p>
    </div>
  );
}

export function MenuMagazineView({ menu }: { menu: SiteMenuContent }) {
  const displayMenu = useMemo(() => filterUnavailableMenuItems(menu), [menu]);
  const [detail, setDetail] = useState<MenuDetailSelection | null>(null);

  const openPriced = useCallback((item: PricedMenuItem) => {
    setDetail({ kind: "priced", item });
  }, []);

  const openDrink = useCallback((item: DrinkMenuItem) => {
    setDetail({ kind: "drink", item });
  }, []);

  const closeDetail = useCallback(() => setDetail(null), []);

  const pricedCats = displayMenu.categories.filter(isPriced);
  const drinksCat = displayMenu.categories.find(isDrinks);

  const mainsCat = pricedCats.find((c) => c.id === "mains");
  const breakfast = pricedCats.find((c) => c.id === "breakfast");
  const nasi = pricedCats.find((c) => c.id === "nasi-padang");
  const packed = pricedCats.find((c) => c.id === "packed-lunch");
  const sidesCat = pricedCats.find((c) => c.id === "sides");
  const dessertCat = pricedCats.find((c) => c.id === "dessert");

  const [activeSection, setActiveSection] = useState("mains");

  const selectSection = useCallback((tabId: string) => {
    setActiveSection(tabId);
    setDetail(null);
  }, []);

  const menuTabs = [
    { id: "mains", label: "Main courses" },
    { id: "sides", label: "Sides" },
    { id: "desserts", label: "Desserts" },
    { id: "drinks", label: "Drinks" },
  ] as const;

  const panelClass = "block pt-12";

  return (
    <div>
      <MenuItemDetailModal selection={detail} onClose={closeDetail} />

      <div className="-mx-4 border-b border-brand-maroon/10 px-4 py-3 sm:-mx-6 sm:px-6">
        <AnimatedTabs
          activeTab={activeSection}
          layoutId="menu-section-tabs"
          onChange={selectSection}
          tabs={[...menuTabs]}
          variant="pill"
          className="mx-auto w-full max-w-6xl"
          tabClassName="font-[family-name:var(--font-label)] text-[0.7rem] font-bold uppercase tracking-[0.06em] sm:px-5 sm:text-xs"
        />
      </div>

      {activeSection === "mains" ? (
        <section
          role="tabpanel"
          id="menu-panel-mains"
          aria-labelledby="menu-section-tabs-tab-mains"
          className={panelClass}
        >
          {mainsCat?.items.length ||
          breakfast?.items.length ||
          nasi?.items.length ||
          packed?.items.length ? (
            <MenuColumnSection>
              {mainsCat && mainsCat.items.length > 0 ? (
                <MenuPricedList items={mainsCat.items} onSelectItem={openPriced} />
              ) : null}
              {breakfast && breakfast.items.length > 0 ? (
                <MenuPricedSubsection
                  label={breakfast.label}
                  subtitle={breakfast.subtitle}
                  items={breakfast.items}
                  onSelectItem={openPriced}
                />
              ) : null}
              {nasi && nasi.items.length > 0 ? (
                <MenuPricedSubsection label={nasi.label} items={nasi.items} onSelectItem={openPriced} />
              ) : null}
              {packed && packed.items.length > 0 ? (
                <MenuPricedSubsection
                  label={packed.label}
                  subtitle={packed.subtitle}
                  items={packed.items}
                  onSelectItem={openPriced}
                />
              ) : null}
            </MenuColumnSection>
          ) : (
            <p className="text-sm text-stone-500">No main courses listed right now.</p>
          )}
        </section>
      ) : null}

      {activeSection === "sides" ? (
        <section
          role="tabpanel"
          id="menu-panel-sides"
          aria-labelledby="menu-section-tabs-tab-sides"
          className={panelClass}
        >
          {sidesCat && sidesCat.items.length > 0 ? (
            <MenuColumnSection>
              <MenuPricedList items={sidesCat.items} onSelectItem={openPriced} />
            </MenuColumnSection>
          ) : (
            <p className="text-sm text-stone-500">No sides listed right now.</p>
          )}
        </section>
      ) : null}

      {activeSection === "desserts" ? (
        <section
          role="tabpanel"
          id="menu-panel-desserts"
          aria-labelledby="menu-section-tabs-tab-desserts"
          className={panelClass}
        >
          {dessertCat && dessertCat.items.length > 0 ? (
            <MenuColumnSection>
              <MenuPricedList items={dessertCat.items} onSelectItem={openPriced} />
            </MenuColumnSection>
          ) : (
            <p className="text-sm text-stone-500">No desserts listed right now.</p>
          )}
        </section>
      ) : null}

      {activeSection === "drinks" ? (
        <section
          role="tabpanel"
          id="menu-panel-drinks"
          aria-labelledby="menu-section-tabs-tab-drinks"
          className={panelClass}
        >
          {drinksCat && drinksCat.groups.length > 0 ? (
            <DrinksColumn groups={drinksCat.groups} onSelectDrink={openDrink} />
          ) : (
            <p className="text-sm text-stone-500">Drinks coming soon.</p>
          )}
        </section>
      ) : null}

      <PdfLinks menu={menu} />
    </div>
  );
}
