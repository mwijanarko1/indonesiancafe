import Link from "next/link";
import { ForkSpoonRule } from "./ForkSpoonRule";

const MAPS_URL = "https://maps.app.goo.gl/p6cuBbE77hqYN3j68";

export function VisitSection() {
  return (
    <section
      id="visit"
      className="batik-bg-heavy scroll-mt-20 px-4 py-16 sm:py-24"
      aria-labelledby="visit-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <ForkSpoonRule className="mb-6" />
        <h2
          id="visit-heading"
          className="font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-address sm:text-4xl"
        >
          Visit us
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-brand-address/88 sm:text-lg">
          Walk-ins welcome when we are open — Crookes is a short hop from the city centre and
          university. Tap below for directions.
        </p>
        <address className="mx-auto mt-6 text-lg font-normal not-italic leading-relaxed [font-family:var(--font-address)] text-brand-address">
          <span className="block">15, Crookes</span>
          <span className="block">Sheffield S10 1UA</span>
          <span className="block text-brand-address/85">United Kingdom</span>
        </address>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-brand-address bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand-address transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            Open in Google Maps
          </Link>
        </div>
      </div>
    </section>
  );
}
