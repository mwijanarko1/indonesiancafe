import Link from "next/link";
import { SITE } from "@/lib/site";
import { HERO_SLIDES } from "./hero-slides";
import { HeroSlideshow } from "./HeroSlideshow";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-maroon" aria-labelledby="hero-heading">
      <div className="relative min-h-[min(88dvh,44rem)] w-full sm:min-h-[min(90dvh,48rem)]">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-brand-maroon/95 via-brand-maroon/82 to-transparent sm:from-brand-maroon/92 sm:via-brand-maroon/68"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-brand-charcoal/45 via-transparent to-brand-maroon/25"
          aria-hidden
        />

        {/* Equal vertical padding keeps the flex content box symmetric so justify-center matches the viewport vertical centre; top value clears the sticky header */}
        <div className="relative z-10 mx-auto flex min-h-[min(88dvh,44rem)] w-full max-w-6xl flex-col justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(5.75rem,10svh+3.5rem,9rem)] sm:min-h-[min(90dvh,48rem)]">
          <div className="w-full max-w-[min(42rem,calc(100vw_-_2rem))] text-brand-cream lg:max-w-[min(48rem,calc(100vw_-_3rem))]">
            <h1
              id="hero-heading"
              className="font-[family-name:var(--font-serif)] text-[clamp(2.25rem,1.35rem+4.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight sm:leading-[1.03] md:leading-[1.02]"
            >
              Authentic Indonesian Taste
            </h1>
            <p className="mt-[clamp(1.25rem,2.5dvh+0.35rem,1.85rem)] max-w-[min(42rem,100%)] text-[clamp(0.9375rem,0.82rem+0.85vw,1.25rem)] leading-relaxed text-brand-cream/90 sm:max-w-[min(48rem,100%)] lg:max-w-[min(56rem,100%)] sm:leading-snug">
              Indonesian restaurant and cafe on {SITE.streetAddress}, {SITE.addressLocality}{" "}
              {SITE.postalCode} — Authentic halal Indonesian food in {SITE.addressRegion}
            </p>
            <div className="mt-[clamp(2rem,4.5dvh+0.5rem,2.85rem)] flex flex-wrap gap-[clamp(0.75rem,2vw,1.25rem)]">
              <Link
                href="/menu"
                className="inline-flex min-h-[clamp(2.75rem,6dvh,3.5rem)] items-center justify-center rounded-md bg-brand-cream px-[clamp(1.75rem,4vw,2.5rem)] py-[clamp(0.75rem,1.8dvh,1rem)] text-[clamp(0.8125rem,0.72rem+0.35vw,1rem)] font-bold uppercase tracking-[0.1em] text-brand-maroon shadow-sm transition hover:bg-brand-cream-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream"
              >
                Explore menu
              </Link>
              <Link
                href="#about"
                className="inline-flex min-h-[clamp(2.75rem,6dvh,3.5rem)] items-center justify-center rounded-md border-2 border-brand-cream/85 bg-transparent px-[clamp(1.75rem,4vw,2.5rem)] py-[clamp(0.75rem,1.8dvh,1rem)] text-[clamp(0.8125rem,0.72rem+0.35vw,1rem)] font-bold uppercase tracking-[0.1em] text-brand-cream transition hover:bg-brand-cream/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream"
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
