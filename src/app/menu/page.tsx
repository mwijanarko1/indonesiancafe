import type { Metadata } from "next";
import { MenuPageBody } from "@/components/cafe/MenuPageBody";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import { MenuJsonLd } from "@/components/seo/MenuJsonLd";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { getSiteMenuContent, getSiteOpeningHours } from "@/lib/server/site-content";

const description =
  "Indonesian restaurant Sheffield. Browse nasi goreng, mie goreng, rendang, satay, sambal and more on our halal Indonesian cafe menu. Coffee, bakery, 15 Crookes S10 1UA; prices and allergen notice online.";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Menu",
  description,
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Menu · Indonesian Cafe Sheffield",
    description,
    url: "/menu",
  },
  twitter: {
    title: "Menu · Indonesian Cafe Sheffield",
    description,
  },
};

export default async function MenuPage() {
  const [{ menu }, openingHours] = await Promise.all([
    getSiteMenuContent(),
    getSiteOpeningHours(),
  ]);

  return (
    <>
      <MenuJsonLd menu={menu} />
      <PageJsonLd
        path="/menu"
        name="Menu - Indonesian Cafe"
        description={description}
        breadcrumbLabel="Menu"
      />
      <SiteHeader variant="inverse" />
      <main
        id="main-content"
        className={`min-h-[50vh] bg-brand-cream ${SITE_HEADER_OVERLAY_MAIN_PAD}`}
      >
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <MenuPageBody menu={menu} />
        </div>
      </main>
      <SiteFooter hours={openingHours.hours} footnote={openingHours.footnote} />
    </>
  );
}
