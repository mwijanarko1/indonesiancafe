import Image from "next/image";
import { HOME_HERO_KICKER, HOME_HERO_TITLE } from "@/lib/site-copy";
import { SITE } from "@/lib/site";

function HeroWaveDivider() {
  return (
    <div className="relative -mb-px h-14 w-full shrink-0 md:h-[4.5rem]" aria-hidden>
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-brand-menu-page"
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

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-brand-maroon"
      aria-labelledby="hero-heading"
    >
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

      <div className="relative mx-auto flex w-full min-w-0 max-w-3xl flex-col items-center bg-brand-maroon px-[clamp(1rem,4vw,2rem)] pb-10 pt-[clamp(5.75rem,10svh+3.5rem,8rem)] text-center sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl sm:pb-12">
        <p className="font-[family-name:var(--font-hero)] text-[clamp(1.125rem,0.65rem+2.4vw,2.375rem)] uppercase leading-none tracking-[0.14em] text-brand-cream sm:tracking-[0.2em] md:tracking-[0.24em]">
          {HOME_HERO_KICKER}
        </p>

        <h1
          id="hero-heading"
          className="mt-3 max-w-[min(100%,34rem)] font-[family-name:var(--font-hero)] text-[clamp(3.125rem,1.35rem+9vw,6.75rem)] uppercase leading-[0.92] tracking-[-0.03em] text-brand-cream sm:mt-4 sm:max-w-[min(100%,42rem)] md:max-w-[min(100%,52rem)] lg:max-w-[min(100%,62rem)] xl:max-w-none"
        >
          {HOME_HERO_TITLE}
        </h1>

        <p className="mt-5 max-w-xl font-[family-name:var(--font-hero)] text-[clamp(0.65rem,0.55rem+0.55vw,0.8125rem)] uppercase leading-snug tracking-[0.12em] text-white sm:max-w-2xl sm:tracking-[0.14em] md:max-w-4xl lg:max-w-5xl">
          Restaurant & cafe · {SITE.streetAddress}, {SITE.addressLocality} {SITE.postalCode} · halal Indonesian
          home cooking · {SITE.addressRegion}
        </p>

        <div className="mt-10 w-full max-w-[min(36rem,calc(100vw-2rem))] md:max-w-[44rem] lg:max-w-[52rem] xl:max-w-[60rem] 2xl:max-w-[68rem]">
          <Image
            src="/hero.png"
            alt={`Illustration of ${SITE.name} storefront at ${SITE.streetAddress}, ${SITE.addressLocality}`}
            width={998}
            height={730}
            priority
            className="h-auto w-full object-contain object-center"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 52rem, 68rem"
          />
        </div>
      </div>

      <HeroWaveDivider />
    </section>
  );
}
