import { HERO_PHOTO_FILENAMES } from "@/lib/menu-item-photos";

export type HeroSlide = {
  src: string;
  alt: string;
  objectPosition: string;
};

export const HERO_SLIDES: readonly HeroSlide[] = HERO_PHOTO_FILENAMES.map((file, i) => ({
  src: `/photos/${file}`,
  alt: `Indonesian Cafe, Crookes Sheffield — interior and food photo ${i + 1} of ${HERO_PHOTO_FILENAMES.length}`,
  objectPosition: "center center",
}));
