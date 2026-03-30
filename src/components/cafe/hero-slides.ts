export type HeroSlide = {
  src: string;
  alt: string;
  objectPosition: string;
};

/** Filenames in /public/photos — add or remove entries as the folder changes */
const PHOTO_FILES = [
  "638300464_17849684961639557_4845296330349199575_n.jpg",
  "640277456_17850190041639557_8467576312477334060_n.jpg",
  "640295809_17850190128639557_3571693074223811109_n.jpg",
  "640333146_17849685921639557_200861914345081368_n.jpg",
  "641119755_17850189480639557_8288033672936859912_n.jpg",
  "641217437_17850190509639557_1976139494978307316_n.jpg",
  "641226693_17850190233639557_4210214828822079588_n.jpg",
  "641250097_17850189750639557_6725361524569605642_n.jpg",
] as const;

export const HERO_SLIDES: readonly HeroSlide[] = PHOTO_FILES.map((file, i) => ({
  src: `/photos/${file}`,
  alt: `Indonesian Cafe, Crookes Sheffield — interior and food photo ${i + 1} of ${PHOTO_FILES.length}`,
  objectPosition: "center center",
}));
