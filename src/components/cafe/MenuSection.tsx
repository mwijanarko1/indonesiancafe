"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useMemo } from "react";
import { type PricedMenuItem, type SiteMenuContent } from "@/lib/cafe-menu";
import { useSiteMenu } from "./useSiteMenu";

type HighlightSpec = {
  id: string;
  match: (name: string) => boolean;
  image: string;
  imageAlt: string;
};

const HIGHLIGHTS: HighlightSpec[] = [
  {
    id: "rendang",
    match: (n) => n.toLowerCase() === "rendang beef + rice",
    image: "/photos/641250097_17850189750639557_6725361524569605642_n.jpg",
    imageAlt: "Rendang beef with rice at Indonesian Cafe",
  },
  {
    id: "geprek",
    match: (n) => n.toLowerCase().includes("ayam geprek"),
    image: "/photos/641226693_17850190233639557_4210214828822079588_n.jpg",
    imageAlt: "Ayam geprek at Indonesian Cafe",
  },
  {
    id: "mie",
    match: (n) => n.toLowerCase().includes("mie ayam bakso"),
    image: "/photos/640295809_17850190128639557_3571693074223811109_n.jpg",
    imageAlt: "Mie ayam bakso at Indonesian Cafe",
  },
  {
    id: "gado",
    match: (n) => n.toLowerCase().includes("gado-gado / indonesian salad"),
    image: "/photos/640333146_17849685921639557_200861914345081368_n.jpg",
    imageAlt: "Gado-gado Indonesian salad at Indonesian Cafe",
  },
];

function findPricedItem(menu: SiteMenuContent, spec: HighlightSpec): PricedMenuItem | null {
  for (const cat of menu.categories) {
    if (cat.variant !== "priced") continue;
    const found = cat.items.filter((i) => i.isAvailable !== false).find((i) => spec.match(i.name));
    if (found) return found;
  }
  return null;
}

export function MenuSection() {
  const { menu, contentLoading } = useSiteMenu();

  const { featured, cards } = useMemo(() => {
    const featuredSpec = HIGHLIGHTS[0]!;
    const cardSpecs = HIGHLIGHTS.slice(1);
    return {
      featured: findPricedItem(menu, featuredSpec),
      cards: cardSpecs.map((spec) => ({ spec, item: findPricedItem(menu, spec) })),
    };
  }, [menu]);

  return (
    <section
      id="menu"
      className="scroll-mt-24 bg-brand-tertiary px-4 py-16 sm:py-20"
      aria-labelledby="menu-heading"
      aria-busy={contentLoading ? true : undefined}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="menu-heading"
            className="font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-charcoal sm:text-4xl"
          >
            Indo-Asian classics
          </h2>
          <Link
            href="/menu"
            className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-crimson underline-offset-4 transition hover:underline"
          >
            View full menu
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">{menu.disclaimer}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Featured — spans 2 cols on large */}
          <article className="group relative overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-stone-200/80 sm:col-span-2 lg:min-h-[280px] lg:grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] min-h-[200px] lg:aspect-auto lg:min-h-full">
              <Image
                src={HIGHLIGHTS[0]!.image}
                alt={HIGHLIGHTS[0]!.imageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <span className="absolute left-3 top-3 rounded-sm bg-brand-crimson px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white">
                Chef&apos;s special
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              {featured ? (
                <>
                  <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-brand-charcoal sm:text-2xl">
                    {featured.name}
                  </h3>
                  {featured.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{featured.description}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <span className="font-[family-name:var(--font-serif)] text-xl font-semibold tabular-nums text-brand-crimson">
                      {featured.price}
                    </span>
                    <Link
                      href="/menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-brand-charcoal transition hover:border-brand-crimson hover:text-brand-crimson"
                      aria-label={`Order ${featured.name} — open menu`}
                    >
                      <ShoppingBag className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-stone-500">Featured dish coming soon.</p>
              )}
            </div>
          </article>

          {cards.map(({ spec, item }) => (
            <article
              key={spec.id}
              className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-stone-200/80"
            >
              <div className="relative aspect-square">
                <Image
                  src={spec.image}
                  alt={spec.imageAlt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                {item ? (
                  <>
                    <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold text-brand-charcoal">
                      {item.name}
                    </h3>
                    {item.description ? (
                      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-stone-600">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-[family-name:var(--font-serif)] text-lg font-semibold tabular-nums text-brand-crimson">
                        {item.price}
                      </span>
                      <Link
                        href="/menu"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-brand-charcoal transition hover:border-brand-crimson"
                        aria-label={`View ${item.name} on menu`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-stone-500">On the full menu.</p>
                )}
              </div>
            </article>
          ))}

          <Link
            href="/menu"
            className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg bg-brand-crimson p-8 text-center text-white shadow-md transition hover:bg-brand-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-charcoal sm:min-h-0"
          >
            <UtensilsCrossed className="h-10 w-10 opacity-95" aria-hidden />
            <span className="font-[family-name:var(--font-serif)] text-lg font-semibold uppercase tracking-[0.12em]">
              Discover more
            </span>
            <span className="text-sm font-medium text-white/90">Full menu →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
