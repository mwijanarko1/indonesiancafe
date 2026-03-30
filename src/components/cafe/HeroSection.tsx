import { HERO_SLIDES } from "./hero-slides";
import { HeroSlideshow } from "./HeroSlideshow";

export function HeroSection() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <h1
        id="hero-heading"
        className="sr-only"
      >
        Indonesian Cafe — Indonesian restaurant in Crookes, Sheffield, UK
      </h1>
      <div className="relative min-h-[min(72vh,40rem)] w-full sm:min-h-[min(78vh,44rem)]">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/25 via-transparent to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
