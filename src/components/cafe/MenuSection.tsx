"use client";

import { useId, useState } from "react";
import { ForkSpoonRule } from "./ForkSpoonRule";

type MenuItem = { name: string; description: string };

const categories: { id: string; label: string; items: MenuItem[] }[] = [
  {
    id: "food",
    label: "Food",
    items: [
      {
        name: "Nasi goreng",
        description: "Wok-fried rice with kecap manis, egg, and aromatics — our house favourite.",
      },
      {
        name: "Mie goreng",
        description: "Stir-fried noodles with vegetables and Indonesian sweet soy depth.",
      },
      {
        name: "Satay",
        description: "Skewers from the grill with peanut sauce and fresh pickle.",
      },
      {
        name: "Rice plates",
        description: "Fragrant rice with curries, rendang-style slow cooks, and vegetable sides.",
      },
      {
        name: "Gado-gado & salads",
        description: "Blanched vegetables, tofu, egg, and peanut dressing — bright and filling.",
      },
      {
        name: "Daily specials",
        description: "Rotating dishes from the islands — ask what is on today.",
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    items: [
      {
        name: "Coffee & tea",
        description: "Espresso-based drinks, Indonesian-style coffee, and loose-leaf teas.",
      },
      {
        name: "Soft drinks",
        description: "Chilled favourites to pair with spice-forward plates.",
      },
      {
        name: "Juices",
        description: "Fresh and bottled options — ask for the seasonal choice.",
      },
    ],
  },
  {
    id: "sides",
    label: "Sambals & sides",
    items: [
      {
        name: "Sambals",
        description: "Chilli-forward condiments built slowly — heat levels vary by batch.",
      },
      {
        name: "Krupuk & extras",
        description: "Crackers and small additions to round out your meal.",
      },
      {
        name: "Desserts",
        description: "Sweet finishes when available — perfect with coffee.",
      },
    ],
  },
];

export function MenuSection() {
  const [active, setActive] = useState(categories[0].id);
  const tablistId = useId();
  const activeCategory = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section
      id="menu"
      className="scroll-mt-20 bg-brand-crimson px-4 py-16 text-brand-address sm:py-20"
      aria-labelledby="menu-heading"
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
          Dishes and drinks rotate with the day — call ahead or ask on arrival for the latest list
          and allergens.
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-white/15 pb-6"
          role="tablist"
          aria-label="Menu categories"
          id={tablistId}
        >
          {categories.map((cat) => {
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
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem] ${
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
          <ul className="columns-1 gap-x-12 gap-y-8 md:columns-2">
            {activeCategory.items.map((item) => (
              <li key={item.name} className="mb-8 break-inside-avoid">
                <div className="flex flex-col gap-1 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between md:gap-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold sm:text-xl">
                      {item.name}
                    </h3>
                    <p className="mt-1 max-w-prose text-sm leading-relaxed text-brand-address/82">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-xs text-brand-address/65">
          Prices and availability in venue · Indonesian Cafe, Sheffield
        </p>
      </div>
    </section>
  );
}
