"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  SITE_MENU_CACHE_TAG,
  SITE_OPENING_HOURS_CACHE_TAG,
} from "@/lib/server/site-content";

async function getAdminToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) throw new Error("Not authenticated");
  return token;
}

const MENU_REVALIDATE_PATHS = ["/admin", "/menu"] as const;

function revalidateMenuPaths(): void {
  revalidateTag(SITE_MENU_CACHE_TAG, "max");
  for (const path of MENU_REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

/**
 * Server action: toggle availability for a priced menu item.
 */
export async function togglePricedItemAvailability(
  itemId: string,
  isAvailable: boolean,
  _formData?: FormData,
): Promise<void> {
  const token = await getAdminToken();
  await fetchMutation(api.menu.setPricedItemAvailable, { itemId: itemId as any, isAvailable }, { token });
  revalidateMenuPaths();
}

/**
 * Server action: toggle availability for a drink menu item.
 */
export async function toggleDrinkItemAvailability(
  itemId: string,
  isAvailable: boolean,
  _formData?: FormData,
): Promise<void> {
  const token = await getAdminToken();
  await fetchMutation(api.menu.setDrinkItemAvailable, { itemId: itemId as any, isAvailable }, { token });
  revalidateMenuPaths();
}

/* ------------------------------------------------------------------ */
/*  Edit actions                                                       */
/* ------------------------------------------------------------------ */

export async function editPricedItem(
  itemId: string,
  name: string,
  price: string,
  description: string,
  image?: string,
  hadCustomImage = false,
): Promise<void> {
  const token = await getAdminToken();
  const trimmedImage = image?.trim() ?? "";
  await fetchMutation(api.menu.editPricedItem, {
    itemId: itemId as any,
    name,
    price,
    description,
    ...(trimmedImage
      ? { image: trimmedImage }
      : hadCustomImage
        ? { clearImage: true }
        : {}),
  } as any, { token });
  revalidateMenuPaths();
}

export async function editDrinkItem(
  itemId: string,
  name: string,
  hot: string,
  iced: string,
  image?: string,
  hadCustomImage = false,
): Promise<void> {
  const token = await getAdminToken();
  const trimmedImage = image?.trim() ?? "";
  await fetchMutation(api.menu.editDrinkItem, {
    itemId: itemId as any,
    name,
    hot: hot || null,
    iced: iced || null,
    ...(trimmedImage
      ? { image: trimmedImage }
      : hadCustomImage
        ? { clearImage: true }
        : {}),
  } as any, { token });
  revalidateMenuPaths();
}

/* ------------------------------------------------------------------ */
/*  Delete actions                                                     */
/* ------------------------------------------------------------------ */

export async function deletePricedItem(itemId: string): Promise<void> {
  const token = await getAdminToken();
  await fetchMutation(api.menu.deletePricedItem, { itemId: itemId as any }, { token });
  revalidateMenuPaths();
}

export async function deleteDrinkItem(itemId: string): Promise<void> {
  const token = await getAdminToken();
  await fetchMutation(api.menu.deleteDrinkItem, { itemId: itemId as any }, { token });
  revalidateMenuPaths();
}

const MAX_MENU_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MENU_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function uploadMenuItemPhoto(formData: FormData): Promise<string> {
  const token = await getAdminToken();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No image file selected.");
  }
  if (!ALLOWED_MENU_PHOTO_TYPES.has(file.type)) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }
  if (file.size > MAX_MENU_PHOTO_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const uploadUrl: string = await fetchMutation(api.menuPhotos.generateUploadUrl, {}, { token });

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadRes.ok) {
    throw new Error("Image upload failed.");
  }

  const uploadBody = (await uploadRes.json()) as { storageId?: string };
  if (!uploadBody.storageId) {
    throw new Error("Image upload did not return a storage id.");
  }

  const url: string | null = await fetchQuery(api.menuPhotos.getPhotoUrl, {
    storageId: uploadBody.storageId as any,
  }, { token });
  if (!url) {
    throw new Error("Could not resolve uploaded image URL.");
  }

  return url;
}

const OPENING_HOURS_REVALIDATE_PATHS = [
  "/",
  "/visit",
  "/menu",
  "/reviews",
  "/faq",
  "/llms.txt",
  "/llms-full.txt",
] as const;

export type SaveOpeningHoursInput = {
  hours: { day: string; time: string }[];
  footnote: string;
};

export async function saveOpeningHours(input: SaveOpeningHoursInput): Promise<void> {
  const token = await getAdminToken();

  const hours = input.hours.map((row) => ({
    day: row.day.trim(),
    time: row.time.trim(),
  }));
  const footnote = input.footnote.trim();

  if (hours.length === 0 || hours.some((row) => !row.day || !row.time)) {
    throw new Error("Each day needs a time value (use “Closed” when shut).");
  }
  if (!footnote) {
    throw new Error("Footnote cannot be empty.");
  }

  await fetchMutation(api.openingHours.replaceOpeningHours, { hours, footnote }, { token });

  revalidateTag(SITE_OPENING_HOURS_CACHE_TAG, "max");
  revalidatePath("/admin");
  for (const path of OPENING_HOURS_REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}
