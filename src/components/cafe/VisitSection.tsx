import Link from "next/link";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { VISIT_SECTION_BLURB, VISIT_SECTION_TITLE } from "@/lib/site-copy";
import { OPENING_HOURS, OPENING_HOURS_FOOTNOTE, SITE } from "@/lib/site";

const socialContact: { href: string; label: string; Icon: IconType }[] = [
  {
    href: SITE.instagramUrl,
    label: "Indonesian Cafe on Instagram",
    Icon: FaInstagram,
  },
  {
    href: SITE.facebookUrl,
    label: "Indonesian Cafe on Facebook",
    Icon: FaFacebook,
  },
];

export function VisitSection() {
  return (
    <section
      id="visit"
      className="scroll-mt-24 bg-brand-menu-page px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="visit-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-2xl border border-brand-maroon/15 bg-brand-menu-surface shadow-sm md:grid-cols-2">
        {/* Map first in DOM: stacks above details on narrow screens; md:col-start-2 keeps it on the right on desktop */}
        <div className="relative aspect-[5/4] w-full min-h-0 min-w-0 bg-brand-menu-page md:col-start-2 md:row-start-1 md:aspect-auto md:min-h-[28rem]">
          <iframe
            title="Map of Indonesian Cafe, 15 Crookes, Sheffield"
            className="absolute inset-0 h-full w-full border-0"
            src={SITE.mapsEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col justify-center border-t border-brand-cream/10 bg-brand-maroon px-5 py-8 text-brand-cream max-md:pb-10 sm:px-8 sm:py-12 md:col-start-1 md:row-start-1 md:border-t-0 md:px-10 md:py-16">
          <h2
            id="visit-heading"
            className="font-[family-name:var(--font-serif)] text-2xl font-bold text-brand-cream sm:text-4xl"
          >
            {VISIT_SECTION_TITLE}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-cream/90 sm:mt-3 sm:text-base">
            {VISIT_SECTION_BLURB}
          </p>

          <Link
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-brand-cream px-5 py-3 text-center font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.12em] text-brand-maroon transition hover:bg-brand-cream-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream sm:mt-8 sm:px-6 sm:py-3.5 sm:text-sm md:mt-10 md:w-auto"
          >
            Get directions
          </Link>

          <ul className="mt-6 space-y-6 text-brand-cream sm:mt-10 sm:space-y-8">
            <li>
              <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">
                Address
              </p>
              <address className="mt-1 not-italic [font-family:var(--font-address)] text-sm leading-relaxed text-brand-cream sm:text-base">
                {SITE.streetAddress}
                <br />
                {SITE.addressLocality} {SITE.postalCode}
                <br />
                United Kingdom
              </address>
            </li>
            <li>
              <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">
                Opening hours
              </p>
              <dl className="mt-2 grid max-w-md grid-cols-[minmax(0,6.75rem)_1fr] gap-x-3 gap-y-1 text-sm [font-family:var(--font-address)]">
                {OPENING_HOURS.map((row) => (
                  <div key={row.day} className="contents">
                    <dt className="font-semibold text-brand-cream">{row.day}</dt>
                    <dd className="text-brand-cream/90">{row.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-brand-cream/70">{OPENING_HOURS_FOOTNOTE}</p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">
                Phone
              </p>
              <a
                href={`tel:${SITE.phoneE164}`}
                className="mt-2 inline-block text-sm text-brand-cream/95 underline decoration-brand-gold/70 underline-offset-2 transition hover:text-brand-cream"
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">
                Social
              </p>
              <p className="mt-2 flex flex-wrap gap-3">
                {socialContact.map(({ href, label, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/35 text-brand-cream transition hover:border-brand-cream/60 hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </a>
                ))}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
