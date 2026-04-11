import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import {
  formatMenuItemDisplayName,
  type PricedMenuItem,
  type SiteMenuContent,
} from "@/lib/cafe-menu";
import { publicMenuPhoto } from "@/lib/menu-item-photos";

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
    image: publicMenuPhoto("rendang.jpg"),
    imageAlt: "Rendang beef with rice at Indonesian Cafe",
  },
  {
    id: "geprek",
    match: (n) => n.toLowerCase().includes("ayam geprek"),
    image: publicMenuPhoto("ayam_geprek.jpg"),
    imageAlt: "Ayam geprek at Indonesian Cafe",
  },
  {
    id: "mie",
    match: (n) => n.toLowerCase().includes("mie ayam bakso"),
    image: publicMenuPhoto("mie-ayam.jpg"),
    imageAlt: "Mie ayam bakso at Indonesian Cafe",
  },
  {
    id: "gado",
    match: (n) => n.toLowerCase().includes("gado-gado / indonesian salad"),
    image: publicMenuPhoto("gado-gado2.jpg"),
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

export function MenuSection({ menu }: { menu: SiteMenuContent }) {
  const featuredSpec = HIGHLIGHTS[0]!;
  const cardSpecs = HIGHLIGHTS.slice(1);
  const featured = findPricedItem(menu, featuredSpec);
  const cards = cardSpecs.map((spec) => ({ spec, item: findPricedItem(menu, spec) }));

  return (
    <section
      id="menu"
      className="scroll-mt-24 bg-brand-menu-page px-4 py-16 sm:py-20"
      aria-labelledby="menu-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="menu-heading"
            className="font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-maroon sm:text-4xl"
          >
            Indonesian favourites
          </h2>
          <Link
            href="/menu"
            className="font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.1em] text-brand-maroon underline-offset-4 transition hover:underline"
          >
            View full menu
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Featured — spans 2 cols on large */}
          <article className="group relative overflow-hidden rounded-xl border border-brand-maroon/10 bg-white/80 shadow-md shadow-brand-maroon/5 backdrop-blur-[2px] sm:col-span-2 lg:min-h-[280px] lg:grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] min-h-[200px] lg:aspect-auto lg:min-h-full">
              <Image
                src={HIGHLIGHTS[0]!.image}
                alt={HIGHLIGHTS[0]!.imageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <span className="absolute left-3 top-3 rounded-sm bg-brand-maroon px-2.5 py-1 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white">
                Chef&apos;s special
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              {featured ? (
                <>
                  <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-brand-maroon sm:text-2xl">
                    {formatMenuItemDisplayName(featured.name)}
                  </h3>
                  {featured.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{featured.description}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <span className="font-[family-name:var(--font-serif)] text-xl font-bold tabular-nums text-brand-maroon">
                      {featured.price}
                    </span>
                    <Link
                      href="/menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-maroon/20 text-brand-maroon transition hover:border-brand-maroon hover:bg-brand-menu-surface"
                      aria-label={`Order ${formatMenuItemDisplayName(featured.name)} — open menu`}
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
              className="group flex flex-col overflow-hidden rounded-xl border border-brand-maroon/10 bg-white/80 shadow-md shadow-brand-maroon/5 backdrop-blur-[2px]"
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
                    <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-brand-maroon">
                      {formatMenuItemDisplayName(item.name)}
                    </h3>
                    {item.description ? (
                      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-stone-600">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-[family-name:var(--font-serif)] text-lg font-bold tabular-nums text-brand-maroon">
                        {item.price}
                      </span>
                      <Link
                        href="/menu"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-maroon/20 text-brand-maroon transition hover:border-brand-maroon hover:bg-brand-menu-surface"
                        aria-label={`View ${formatMenuItemDisplayName(item.name)} on menu`}
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
            className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-brand-maroon/15 bg-brand-maroon p-8 text-center text-white shadow-md transition hover:bg-brand-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon sm:min-h-0"
          >
            <UtensilsCrossed className="h-10 w-10 opacity-95" aria-hidden />
            <span className="font-[family-name:var(--font-label)] text-lg font-bold uppercase tracking-[0.12em]">
              Discover more
            </span>
            <span className="text-sm font-semibold text-white/90">Full menu →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
