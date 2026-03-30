import Link from "next/link";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { OPENING_HOURS, OPENING_HOURS_FOOTNOTE, SITE } from "@/lib/site";

const MAPS_URL = "https://maps.app.goo.gl/p6cuBbE77hqYN3j68";

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
      className="scroll-mt-24 bg-brand-cream-page px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="visit-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_25px_50px_-12px_rgb(0_0_0_/_0.18),0_0_0_1px_rgb(0_0_0_/_0.04)] md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16">
          <h2
            id="visit-heading"
            className="font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-charcoal sm:text-4xl"
          >
            Home in Crookes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Walk-ins welcome when we&apos;re open. Tap below for Google Maps — we&apos;re a short hop from
            the city centre and universities.
          </p>

          <ul className="mt-10 space-y-8 text-stone-800">
            <li>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">Address</p>
              <address className="mt-1 not-italic [font-family:var(--font-address)] text-base leading-relaxed">
                {SITE.streetAddress}
                <br />
                {SITE.addressLocality} {SITE.postalCode}
                <br />
                United Kingdom
              </address>
            </li>
            <li>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">Opening hours</p>
              <dl className="mt-2 space-y-1 text-sm [font-family:var(--font-address)]">
                {OPENING_HOURS.map((row) => (
                  <div key={row.day} className="flex flex-wrap gap-x-3">
                    <dt className="min-w-[5.5rem] font-medium text-stone-800">{row.day}</dt>
                    <dd className="text-stone-600">{row.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-stone-500">{OPENING_HOURS_FOOTNOTE}</p>
            </li>
            <li>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">Social</p>
              <p className="mt-2 flex flex-wrap gap-3">
                {socialContact.map(({ href, label, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-brand-charcoal transition hover:border-brand-crimson hover:text-brand-crimson"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </a>
                ))}
              </p>
            </li>
          </ul>

          <Link
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-brand-crimson px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-brand-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-charcoal sm:w-auto"
          >
            Get directions
          </Link>
        </div>

        <div className="relative min-h-[min(22rem,50vh)] min-w-0 md:min-h-[28rem]">
          <Image
            src="/photos/641119755_17850189480639557_8288033672936859912_n.jpg"
            alt="Warm interior of Indonesian Cafe, Crookes Sheffield"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            aria-hidden
          />
          <p className="absolute bottom-4 left-4 rounded-md border border-white/30 bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-charcoal shadow-md backdrop-blur-[2px]">
            Crookes, Sheffield
          </p>
        </div>
      </div>
    </section>
  );
}
