import Image from "next/image";

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 overflow-x-clip batik-bg-heavy px-4 py-16 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <div>
          <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-gold/90">
            Indonesian Cafe
          </p>
          <h2
            id="about-heading"
            className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-semibold leading-tight text-brand-address sm:text-4xl md:text-[2.35rem]"
          >
            Unapologetically Indonesian — rooted in Crookes
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-address/92 sm:text-lg">
            We cook home-style food from the islands: rice and noodle dishes, satay from the grill,
            sambals built slowly, and cafe favourites for everyday visits. Warm spice, honest
            portions, and a welcome that feels like Sheffield meets Jakarta.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-address/78">
            Uni Linda · 15 Crookes, Sheffield S10 1UA
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div
            className="absolute -inset-3 rounded-sm border border-brand-gold/35 bg-brand-maroon/30 sm:-inset-4"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-sm shadow-[0_24px_60px_-12px_rgb(0_0_0_/_0.45)] ring-1 ring-white/15">
            <Image
              src="/poster.png"
              alt="Indonesian Cafe — poster with traditional roof motif and Sheffield address"
              width={720}
              height={960}
              className="h-auto w-full object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
