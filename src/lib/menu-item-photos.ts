/**
 * Maps menu item names to filenames in /public/photos.
 * Keep rules ordered: more specific phrases before broader ones.
 */

export const HERO_PHOTO_FILENAMES = [
  "rendang.jpg",
  "ayam-geprek.jpg",
  "mie-ayam.jpg",
  "chicken-fried-noodles.jpg",
  "bakso.jpg",
  "batagor.jpg",
  "gado-gado.jpg",
  "gado-gado2.jpg",
  "bakso-2.jpg",
] as const;

/**
 * Returns a photo path only when the dish name matches a known asset.
 * Callers should omit imagery when this is null.
 */
export function menuItemPhotoIfMatched(itemName: string): string | null {
  const n = itemName.trim().toLowerCase();
  if (!n) return null;

  if (n.includes("gado-gado / indonesian salad")) return "/photos/gado-gado.jpg";
  if (n === "gado-gado") return "/photos/gado-gado2.jpg";

  if (n.includes("batagor")) return "/photos/batagor.jpg";
  if (n.includes("rendang")) return "/photos/rendang.jpg";
  if (n.includes("nasi padang")) return "/photos/rendang.jpg";
  if (n.includes("ayam geprek")) return "/photos/ayam-geprek.jpg";
  if (n.includes("mie ayam")) return "/photos/mie-ayam.jpg";
  if (n.includes("bakso ikan")) return "/photos/bakso-2.jpg";
  if (n.includes("bakso")) return "/photos/bakso.jpg";
  if (n.includes("chicken fried noodles")) return "/photos/chicken-fried-noodles.jpg";
  if (n.includes("fried noodles")) return "/photos/chicken-fried-noodles.jpg";
  if (n.includes("fried rice")) return "/photos/chicken-fried-noodles.jpg";
  if (n.includes("indomie")) return "/photos/chicken-fried-noodles.jpg";
  if (n.includes("gado-gado")) return "/photos/gado-gado.jpg";

  return null;
}
