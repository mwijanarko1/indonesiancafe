import Link from "next/link";
import { OPENING_HOURS, OPENING_HOURS_FOOTNOTE, SITE } from "@/lib/site";

const MAPS_URL = "https://maps.app.goo.gl/p6cuBbE77hqYN3j68";
const CREDIT_URL = "https://mikhailwijanarko.xyz";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-maroon px-4 py-12 text-brand-address/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-address sm:text-xs">
            Indonesian Cafe
          </p>
          <p className="mt-2 [font-family:var(--font-address)] text-sm text-brand-address/88">
            Indonesian restaurant · Sheffield · Crookes · UK
          </p>
          <Link
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full border border-brand-gold/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-address transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            Directions
          </Link>
        </div>

        <div className="grid flex-1 gap-8 text-center sm:max-w-md sm:text-left sm:pl-8">
          <div>
            <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Address
            </p>
            <address className="mt-2 text-sm not-italic leading-relaxed [font-family:var(--font-address)]">
              {SITE.streetAddress}
              <br />
              {SITE.addressLocality} {SITE.postalCode}
              <br />
              United Kingdom
            </address>
          </div>
          <div>
            <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Hours
            </p>
            <dl className="mt-3 space-y-1.5 text-sm [font-family:var(--font-address)]">
              {OPENING_HOURS.map((row) => (
                <div
                  key={row.day}
                  className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 sm:justify-start"
                >
                  <dt className="min-w-[6.5rem] text-brand-address/90">{row.day}</dt>
                  <dd className="text-brand-address/78">{row.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-brand-address/60">
              {OPENING_HOURS_FOOTNOTE}
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-8 text-center text-xs leading-relaxed text-brand-address/50">
        © {new Date().getFullYear()} Indonesian Cafe
        <span className="mt-2 block sm:mt-0 sm:inline sm:before:mx-2 sm:before:content-['·']">
          Made by{" "}
          <Link
            href={CREDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-address/65 underline-offset-2 transition hover:text-brand-gold/90 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            @mikhailbuilds
          </Link>
        </span>
      </p>
    </footer>
  );
}
