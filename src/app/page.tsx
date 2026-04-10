import type { Metadata } from "next";
import { HeroSection } from "@/components/cafe/HeroSection";
import { MenuSection } from "@/components/cafe/MenuSection";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SiteHeader } from "@/components/cafe/SiteHeader";
import { VisitSection } from "@/components/cafe/VisitSection";
import { WordOfMouthSection } from "@/components/cafe/WordOfMouthSection";
import { getFeaturedGuestReviewsFrom } from "@/lib/guest-reviews";
import { getSiteMenuContent, getSiteReviewsContent } from "@/lib/server/site-content";

export const revalidate = 3600;

/** Self-referencing canonical for `/` only; subpages set their own in `page.tsx`. */
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [{ menu }, { reviews, featuredAuthorOrder }] = await Promise.all([
    getSiteMenuContent(),
    getSiteReviewsContent(),
  ]);
  const featuredReviews = getFeaturedGuestReviewsFrom(reviews, featuredAuthorOrder);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <MenuSection menu={menu} />
        <WordOfMouthSection featured={featuredReviews} />
        <VisitSection />
      </main>
      <SiteFooter />
    </>
  );
}
