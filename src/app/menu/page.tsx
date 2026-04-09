import type { Metadata } from "next";
import { headers } from "next/headers";
import { MenuPageBody } from "@/components/cafe/MenuPageBody";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { getSiteMenuContent } from "@/lib/server/site-content";

const description =
  "Indonesian restaurant Sheffield — browse nasi goreng, mie goreng, rendang, satay, sambal and more on our halal Indonesian cafe menu. Coffee, bakery, 15 Crookes S10 1UA; prices and allergen notice online.";

export const dynamic = "force-dynamic";

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
  const [{ menu }, requestHeaders] = await Promise.all([getSiteMenuContent(), headers()]);
  const nonce = requestHeaders.get("x-nonce") ?? "";

  return (
    <>
      <PageJsonLd
        nonce={nonce}
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
        <MenuPageBody menu={menu} />
      </main>
      <SiteFooter />
    </>
  );
}
