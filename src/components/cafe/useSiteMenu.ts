"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { DEFAULT_SITE_MENU, type SiteMenuContent } from "@/lib/cafe-menu";

export function useSiteMenu(): { menu: SiteMenuContent; contentLoading: boolean } {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const remote = useQuery(api.menu.get, convexUrl ? {} : "skip");

  if (!convexUrl) {
    return { menu: DEFAULT_SITE_MENU, contentLoading: false };
  }

  const menu =
    remote !== undefined && remote !== null ? remote : DEFAULT_SITE_MENU;
  return { menu, contentLoading: remote === undefined };
}
