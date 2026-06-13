/**
 * Maps menu item names to files in /public/photos.
 * Filenames may contain spaces or punctuation; paths are encoded for URLs.
 * Keep rules ordered: more specific phrases before broader ones.
 */

/** Stored on menu items to suppress auto-matched photos after admin removal. */
export const HIDDEN_MENU_PHOTO = "/.menu-photo-hidden";

function isHiddenMenuPhoto(url: string | undefined): boolean {
  return url?.trim() === HIDDEN_MENU_PHOTO;
}

/** Public URL for a file in `/public/photos` (encodes spaces, brackets, etc.). */
export function publicMenuPhoto(filename: string): string {
  return `/photos/${encodeURIComponent(filename)}`;
}

/**
 * Returns a photo path only when the dish name matches a known asset.
 * Callers should omit imagery when this is null.
 */
export function menuItemPhotoIfMatched(itemName: string): string | null {
  const n = itemName.trim().toLowerCase();
  if (!n) return null;

  const p = publicMenuPhoto;

  // Drinks (only items with a dedicated photo)
  if (n === "salted caramel") return p("Coffee(Salted_Caramel).jpg");

  if (n === "butter kaya toast") return p("butter kaya toast.jpg");
  if (n === "indomie goreng") return p("indomie goreng.jpg");

  // Nasi Padang
  if (n.includes("nasi padang komplit")) return p("nasi padang komplit.jpg");
  if (n === "paket a") return p("PAKET_A.jpg");

  // Desserts
  if (n.includes("kue cubit")) return p("kue_cubit.jpg");
  if (n.includes("pisang goreng keju")) return p("pisang_goreng_keju_coklat_.jpg");

  // Sides (specific before generic)
  if (n.includes("gado-gado")) return p("gado-gado2.jpg");
  if (n.includes("chicken spring roll")) return p("chicken spring roll.webp");
  if (n.includes("vegetarian spring roll")) return p("vegetarian spring roll.jpg");
  if (n.includes("king butterfly prawn")) return p("king butterfly prawns.jpg");
  if (n.includes("tahu isi")) return p("tahu isi.JPG");
  if (n.includes("batagor")) return p("batagor.jpg");
  if (n.includes("chicken satay")) return p("chicken satay.jpg");
  if (n.includes("cireng")) return p("cireng.jpg");

  // Mains
  if (n.includes("rendang beef")) return p("rendang.jpg");
  if (n.includes("ayam geprek")) return p("ayam_geprek.jpg");
  if (n.includes("bakso ikan")) return p("bakso-2.jpg");
  if (n.includes("bakso daging")) return p("bakso_daging.jpg");
  if (n.includes("mie ayam bakso")) return p("mie-ayam.jpg");
  if (n.includes("mie ayam")) return p("mie-ayam.jpg");
  if (n.includes("mie goreng chicken")) return p("chicken-fried-noodles.jpg");
  if (n.includes("mie goreng seafood")) return p("mie_goreng_(bihun__vermicelli).jpg");
  if (n.includes("nasi goreng ayam")) return p("nasi_goreng_.jpg");
  if (n.includes("nasi goreng seafood")) return p("nasi_goreng_.jpg");

  return null;
}

/** Custom `image` from the database wins; otherwise fall back to name-matched assets. */
export function menuItemPhotoSrc(item: {
  name: string;
  image?: string;
}): string | null {
  const custom = item.image?.trim();
  if (isHiddenMenuPhoto(custom)) return null;
  if (custom) return custom;
  return menuItemPhotoIfMatched(item.name);
}

/** Resolve the photo shown while editing in admin (respects hidden override). */
export function adminMenuPhotoPreview(image: string, itemName: string): string | null {
  const trimmed = image.trim();
  if (isHiddenMenuPhoto(trimmed)) return null;
  if (trimmed) return trimmed;
  return menuItemPhotoIfMatched(itemName);
}
