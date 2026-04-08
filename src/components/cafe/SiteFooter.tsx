import Link from "next/link";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { OPENING_HOURS, OPENING_HOURS_FOOTNOTE, SITE } from "@/lib/site";

const CREDIT_URL = "https://mikhailwijanarko.xyz";

const socialLinks: { href: string; label: string; Icon: IconType }[] = [
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

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-address/20 bg-brand-maroon px-4 py-14 text-brand-address/90">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        <div>
          <p className="font-[family-name:var(--font-label)] text-lg font-bold tracking-[0.04em] text-brand-address">
            Indonesian Cafe
          </p>
          <p className="mt-2 text-sm text-brand-address/85">Indonesian restaurant · Crookes · Sheffield · UK</p>
          <div className="mt-6 inline-flex flex-col rounded-sm border border-brand-address/30 bg-brand-address/10 px-4 py-3">
            <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand-address">
              Halal kitchen
            </p>
            <p className="mt-1 text-xs text-brand-address/80">100% halal ingredients &amp; preparation</p>
          </div>
        </div>

        <div>
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-address/85">
            Find us
          </p>
          <address className="mt-3 text-sm not-italic leading-relaxed [font-family:var(--font-address)] text-brand-address/92">
            {SITE.streetAddress}
            <br />
            {SITE.addressLocality} {SITE.postalCode}
            <br />
            United Kingdom
          </address>
          <p className="mt-6 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-address/85">
            Social
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-address/40 text-brand-address transition hover:bg-brand-address/10"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-address/85">
            Hours
          </p>
          <dl className="mt-3 grid max-w-xs gap-1 text-sm [font-family:var(--font-address)]">
            {OPENING_HOURS.map((row) => (
              <div key={row.day} className="flex justify-between gap-4">
                <dt className="text-brand-address/92">{row.day}</dt>
                <dd className="text-brand-address/75">{row.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-brand-address/55">{OPENING_HOURS_FOOTNOTE}</p>
        </div>
      </div>

      <nav
        aria-label="Legal"
        className="mx-auto mt-12 flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 border-t border-brand-address/15 pt-8 text-sm text-brand-address/75"
      >
        <Link
          href="/privacy"
          className="underline-offset-2 transition hover:text-brand-address hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="underline-offset-2 transition hover:text-brand-address hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          Terms
        </Link>
        <Link
          href="/llms.txt"
          className="underline-offset-2 transition hover:text-brand-address hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          Machine-readable guide
        </Link>
      </nav>

      <p className="mx-auto mt-8 max-w-6xl border-t border-brand-address/20 pt-8 text-center text-xs leading-relaxed text-brand-address/50">
        <span className="text-brand-address/65">
          © {new Date().getFullYear()} Indonesian Cafe
        </span>
        <span className="mt-2 block sm:mt-0 sm:inline sm:before:mx-2 sm:before:text-brand-address/40 sm:before:content-['·']">
          Made by{" "}
          <Link
            href={CREDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-address/75 underline-offset-2 transition hover:text-brand-address hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            @mikhailbuilds
          </Link>
        </span>
      </p>
    </footer>
  );
}
