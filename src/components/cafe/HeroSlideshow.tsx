"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "./hero-slides";

const AUTOPLAY_MS = 6500;

type Props = {
  slides: readonly HeroSlide[];
};

export function HeroSlideshow({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const count = slides.length;
  const safeIndex = count > 0 ? index % count : 0;

  useEffect(() => {
    const mq =
      typeof window !== "undefined"
        ? window.matchMedia?.("(prefers-reduced-motion: reduce)")
        : undefined;
    if (!mq) return;
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (count < 2 || reduceMotion) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, reduceMotion]);

  if (count === 0) return null;

  return (
    <div
      className="absolute inset-0"
      role="region"
      aria-label={`Rotating photos of Indonesian Cafe, ${count} images`}
    >
      {slides.map((slide, i) => {
        const active = i === safeIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              active ? "z-0 opacity-100" : "z-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={!active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              quality={92}
              className="object-cover"
              style={{ objectPosition: slide.objectPosition }}
              sizes="100vw"
            />
          </div>
        );
      })}
    </div>
  );
}
