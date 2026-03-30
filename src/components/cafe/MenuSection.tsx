"use client";

import { ForkSpoonRule } from "./ForkSpoonRule";
import { TabbedMenuBrowser } from "./TabbedMenuBrowser";
import { useSiteMenu } from "./useSiteMenu";

export function MenuSection() {
  const { menu, contentLoading } = useSiteMenu();

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
          Indonesian Cafe menu
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-brand-address/85 sm:text-base">
          {menu.disclaimer}
        </p>

        <TabbedMenuBrowser menu={menu} variant="homepage" />
      </div>
    </section>
  );
}
