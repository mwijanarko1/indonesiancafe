import type { SiteMenuContent } from "@/lib/cafe-menu";
import { MenuMagazineView } from "./MenuMagazineView";

export function MenuPageBody({ menu }: { menu: SiteMenuContent }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
      <h1 className="text-center font-[family-name:var(--font-serif)] text-4xl font-bold uppercase tracking-[0.02em] text-brand-maroon sm:text-5xl">
        The menu
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-stone-600 sm:text-base">
        A curated selection of Indonesian flavours — rice plates, noodles, Padang-style sets, sides, sweets, and drinks.
        Prices are what we charge in the cafe today.
      </p>
      <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-brand-maroon/10 bg-white/70 px-4 py-3 text-center text-sm leading-relaxed text-stone-700">
        {menu.disclaimer}
      </p>

      <div className="mt-10">
        <MenuMagazineView menu={menu} />
      </div>
    </div>
  );
}
