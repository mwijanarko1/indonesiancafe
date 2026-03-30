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
    <footer className="border-t border-white/10 bg-brand-charcoal px-4 py-14 text-brand-address/90">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        <div>
          <p className="font-[family-name:var(--font-serif)] text-lg font-semibold text-white">Indonesian Cafe</p>
          <p className="mt-2 text-sm text-white/75">Indonesian restaurant · Crookes · Sheffield · UK</p>
          <div className="mt-6 inline-flex flex-col rounded-sm border border-brand-gold/40 bg-white/5 px-4 py-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand-gold">Halal kitchen</p>
            <p className="mt-1 text-xs text-white/70">100% halal ingredients &amp; preparation</p>
          </div>
        </div>

        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">Find us</p>
          <address className="mt-3 text-sm not-italic leading-relaxed [font-family:var(--font-address)] text-white/85">
            {SITE.streetAddress}
            <br />
            {SITE.addressLocality} {SITE.postalCode}
            <br />
            United Kingdom
          </address>
          <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">Social</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">Hours</p>
          <dl className="mt-3 grid max-w-xs gap-1 text-sm [font-family:var(--font-address)]">
            {OPENING_HOURS.map((row) => (
              <div key={row.day} className="flex justify-between gap-4">
                <dt className="text-white/85">{row.day}</dt>
                <dd className="text-white/65">{row.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-white/45">{OPENING_HOURS_FOOTNOTE}</p>
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-6xl border-t border-white/10 pt-8 text-center text-xs leading-relaxed text-white/40">
        <span className="text-white/50">
          © {new Date().getFullYear()} Indonesian Cafe
        </span>
        <span className="mt-2 block sm:mt-0 sm:inline sm:before:mx-2 sm:before:text-white/40 sm:before:content-['·']">
          Made by{" "}
          <Link
            href={CREDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/55 underline-offset-2 transition hover:text-brand-gold hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            @mikhailbuilds
          </Link>
        </span>
      </p>
    </footer>
  );
}
