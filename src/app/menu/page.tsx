import type { Metadata } from "next";
import { headers } from "next/headers";
import { MenuPageBody } from "@/components/cafe/MenuPageBody";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SiteHeader } from "@/components/cafe/SiteHeader";
import { getRequiredCanonicalSiteUrl } from "@/lib/site";
import { getSiteMenuContent } from "@/lib/server/site-content";

const description =
  "Browse the current Indonesian Cafe menu in Sheffield — Crookes, S10. Tap categories for food, drinks, and prices; allergen notice included.";

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
  const siteUrl = getRequiredCanonicalSiteUrl();
  const base = siteUrl.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Menu — Indonesian Cafe",
    description,
    url: `${base}/menu`,
    isPartOf: { "@type": "WebSite", name: "Indonesian Cafe", url: base },
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main-content" className="min-h-[50vh] bg-[#fcf4e8]">
        <MenuPageBody menu={menu} />
      </main>
      <SiteFooter />
    </>
  );
}
