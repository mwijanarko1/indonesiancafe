import Link from "next/link";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { OPENING_HOURS, OPENING_HOURS_FOOTNOTE, SITE } from "@/lib/site";

const socialContact: { href: string; label: string; Icon: IconType }[] = [
  {
    href: "https://www.instagram.com/indonesiancafe_/",
    label: "Indonesian Cafe on Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://www.facebook.com/profile.php?id=61583156852755",
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
        <div className="flex flex-col justify-center bg-brand-maroon px-6 py-12 text-brand-cream sm:px-10 sm:py-16">
          <h2
            id="visit-heading"
            className="font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-cream sm:text-4xl"
          >
            Home in Crookes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-cream/90 sm:text-base">
            Walk-ins welcome when we&apos;re open. Tap below for Google Maps — we&apos;re a short hop from
            the city centre and universities.
          </p>

          <ul className="mt-10 space-y-8 text-brand-cream">
            <li>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">
                Address
              </p>
              <address className="mt-1 not-italic [font-family:var(--font-address)] text-base leading-relaxed text-brand-cream">
                {SITE.streetAddress}
                <br />
                {SITE.addressLocality} {SITE.postalCode}
                <br />
                United Kingdom
              </address>
            </li>
            <li>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">
                Opening hours
              </p>
              <dl className="mt-2 space-y-1 text-sm [font-family:var(--font-address)]">
                {OPENING_HOURS.map((row) => (
                  <div key={row.day} className="flex flex-wrap gap-x-3">
                    <dt className="min-w-[5.5rem] font-medium text-brand-cream">{row.day}</dt>
                    <dd className="text-brand-cream/90">{row.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-brand-cream/70">{OPENING_HOURS_FOOTNOTE}</p>
            </li>
            <li>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-cream/65">Social</p>
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

          <Link
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-brand-cream px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.12em] text-brand-maroon transition hover:bg-brand-cream-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream sm:w-auto"
          >
            Get directions
          </Link>
        </div>

        <div className="relative min-h-[min(22rem,50vh)] min-w-0 md:min-h-[28rem]">
          <iframe
            title="Map of Indonesian Cafe, 15 Crookes, Sheffield"
            className="absolute inset-0 h-full w-full border-0"
            src={SITE.mapsEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
