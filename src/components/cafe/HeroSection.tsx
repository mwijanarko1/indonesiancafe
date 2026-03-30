import Link from "next/link";
import { SITE } from "@/lib/site";
import { HERO_SLIDES } from "./hero-slides";
import { HeroSlideshow } from "./HeroSlideshow";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-charcoal" aria-labelledby="hero-heading">
      <div className="relative min-h-[min(88vh,44rem)] w-full sm:min-h-[min(90vh,48rem)]">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-brand-crimson/90 via-brand-crimson/55 to-transparent sm:from-brand-crimson/85 sm:via-brand-crimson/35"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-black/20" aria-hidden />

        {/* Reserve ~header height at top, then vertically centre copy in the remaining hero so it doesn’t hug the sticky bar */}
        <div className="relative z-10 mx-auto flex min-h-[min(88vh,44rem)] w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-[5.75rem] sm:min-h-[min(90vh,48rem)] sm:pb-20 sm:pt-24 md:pt-28 lg:pt-32">
          <div className="w-full max-w-2xl text-white lg:max-w-3xl">
            <h1
              id="hero-heading"
              className="font-[family-name:var(--font-serif)] text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl md:leading-[1.02]"
            >
              Authentic Indonesian Taste
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/92 sm:mt-7 sm:max-w-3xl sm:text-xl md:text-2xl md:leading-snug lg:max-w-4xl">
              Indonesian restaurant and cafe on {SITE.streetAddress}, {SITE.addressLocality}{" "}
              {SITE.postalCode} — Authentic halal Indonesian food in {SITE.addressRegion}
            </p>
            <div className="mt-10 flex flex-wrap gap-4 sm:mt-11">
              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border-2 border-white bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-14 sm:px-10 sm:py-4 sm:text-base"
              >
                Explore menu
              </Link>
              <Link
                href="#about"
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-brand-crimson transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-14 sm:px-10 sm:py-4 sm:text-base"
              >
                Our story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
