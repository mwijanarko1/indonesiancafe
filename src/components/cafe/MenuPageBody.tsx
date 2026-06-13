import type { SiteMenuContent } from "@/lib/cafe-menu";
import { MenuMagazineView } from "./MenuMagazineView";

export function MenuPageBody({ menu }: { menu: SiteMenuContent }) {
  return (
    <div>
      <h1 className="text-center font-[family-name:var(--font-label)] text-4xl font-bold uppercase tracking-[0.1em] text-brand-maroon sm:text-5xl sm:tracking-[0.12em]">
        The menu
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-stone-600 sm:text-base">
        A curated selection of Indonesian flavours: rice plates, noodles, Padang-style sets, sides, sweets, and drinks.
        Prices are what we charge in the cafe today.
      </p>

      <div className="mt-10">
        <MenuMagazineView menu={menu} />
      </div>
    </div>
  );
}
