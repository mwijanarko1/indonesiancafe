import type { Metadata } from "next";
import Link from "next/link";
import { AdminSignInForm } from "@/components/admin/AdminSignInForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Access",
};

function AuthWaveDivider() {
  return (
    <div className="relative -mb-px h-14 w-full shrink-0 md:h-[4.5rem]" aria-hidden>
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-brand-cream-page"
        preserveAspectRatio="none"
        viewBox="0 0 1440 96"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,48 C180,12 360,84 540,48 C720,12 900,84 1080,48 C1260,12 1350,36 1440,24 L1440,96 L0,96 Z"
        />
      </svg>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main id="main-content">
      {/* Hero-style auth section */}
      <section className="relative overflow-hidden bg-brand-maroon">
        {/* Batik-inspired texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -12deg,
              transparent,
              transparent 12px,
              rgb(255 255 255 / 0.06) 12px,
              rgb(255 255 255 / 0.06) 13px
            )`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto flex w-full min-w-0 max-w-3xl flex-col items-center px-[clamp(1rem,4vw,2rem)] pb-10 pt-[clamp(5.75rem,10svh+3.5rem,8rem)] text-center sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl sm:pb-12">
          <p className="font-[family-name:var(--font-hero)] text-[clamp(0.875rem,0.5rem+2vw,1.75rem)] uppercase leading-none tracking-[0.14em] text-brand-cream sm:tracking-[0.2em] md:tracking-[0.24em]">
            {SITE.name} · Admin
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-hero)] text-[clamp(2.5rem,1rem+8vw,5.5rem)] uppercase leading-[0.92] tracking-[-0.03em] text-brand-cream sm:mt-4">
            Admin Access
          </h1>

          <p className="mt-5 max-w-xl font-[family-name:var(--font-hero)] text-[clamp(0.6rem,0.5rem+0.5vw,0.75rem)] uppercase leading-snug tracking-[0.12em] text-white/85 sm:max-w-2xl sm:tracking-[0.14em]">
            Enter the admin username and password to manage restaurant content.
          </p>

          <div className="mt-12 w-full max-w-md">
            <AdminSignInForm />
          </div>
        </div>

        <AuthWaveDivider />
      </section>

      {/* Back link */}
      <section className="bg-brand-cream-page px-4 py-12 sm:py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <Link
            href="/"
            className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.12em] text-brand-gold transition hover:text-brand-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            &larr; Back to home page
          </Link>
        </div>
      </section>
    </main>
  );
}
