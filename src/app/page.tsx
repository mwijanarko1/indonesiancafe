import { AboutSection } from "@/components/cafe/AboutSection";
import { HeroSection } from "@/components/cafe/HeroSection";
import { MenuSection } from "@/components/cafe/MenuSection";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SiteHeader } from "@/components/cafe/SiteHeader";
import { VisitSection } from "@/components/cafe/VisitSection";
import { WordOfMouthSection } from "@/components/cafe/WordOfMouthSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <WordOfMouthSection />
        <VisitSection />
      </main>
      <SiteFooter />
    </>
  );
}
