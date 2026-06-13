import type { Metadata } from "next";
import { FaqSection } from "@/components/cafe/FaqSection";
import { HeroSection } from "@/components/cafe/HeroSection";
import { MenuSection } from "@/components/cafe/MenuSection";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SiteHeader } from "@/components/cafe/SiteHeader";
import { VisitSection } from "@/components/cafe/VisitSection";
import { WordOfMouthSection } from "@/components/cafe/WordOfMouthSection";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { FAQ_ITEMS } from "@/lib/faq";
import { getFeaturedGuestReviewsFrom } from "@/lib/guest-reviews";
import { getSiteMenuContent, getSiteOpeningHours, getSiteReviewsContent } from "@/lib/server/site-content";

export const revalidate = 3600;

/** Self-referencing canonical for `/` only; subpages set their own in `page.tsx`. */
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [{ menu }, { reviews, featuredAuthorOrder }, openingHours] = await Promise.all([
    getSiteMenuContent(),
    getSiteReviewsContent(),
    getSiteOpeningHours(),
  ]);
  const featuredReviews = getFeaturedGuestReviewsFrom(reviews, featuredAuthorOrder);

  return (
    <>
      <FaqJsonLd path="/" items={FAQ_ITEMS} />
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <MenuSection menu={menu} />
        <WordOfMouthSection featured={featuredReviews} />
        <VisitSection hours={openingHours.hours} footnote={openingHours.footnote} />
        <FaqSection />
      </main>
      <SiteFooter hours={openingHours.hours} footnote={openingHours.footnote} />
    </>
  );
}
