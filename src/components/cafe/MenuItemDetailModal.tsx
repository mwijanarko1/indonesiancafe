"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatMenuItemDisplayName,
  type DrinkMenuItem,
  type PricedMenuItem,
} from "@/lib/cafe-menu";
import { menuItemPhotoSrc } from "@/lib/menu-item-photos";

export type MenuDetailSelection =
  | { kind: "priced"; item: PricedMenuItem }
  | { kind: "drink"; item: DrinkMenuItem };

function formatDrinkPrice(hot: string | null, iced: string | null): string {
  if (hot && iced) return `${hot} hot · ${iced} iced`;
  if (hot) return hot;
  if (iced) return iced;
  return "-";
}

type Props = {
  selection: MenuDetailSelection | null;
  onClose: () => void;
};

export function MenuItemDetailModal({ selection, onClose }: Props) {
  const open = selection !== null;
  const title = selection ? formatMenuItemDisplayName(selection.item.name) : "";
  const photo = selection ? menuItemPhotoSrc(selection.item) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        id="menu-item-detail"
        className="gap-0 rounded-[1.75rem] p-4 pt-12 shadow-2xl sm:max-w-lg"
      >
        {selection ? (
          <div className="relative z-10 flex flex-col gap-4">
            {photo ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/20 bg-muted/30 shadow-md">
                <Image
                  src={photo}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              </div>
            ) : null}

            <DialogTitle className="text-brand-maroon">{title}</DialogTitle>

            {selection.kind === "priced" ? (
              <>
                {selection.item.description ? (
                  <DialogDescription>
                    {selection.item.description}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">
                    {title}, {selection.item.price}.
                  </DialogDescription>
                )}
                <p className="font-[family-name:var(--font-serif)] text-xl font-bold tabular-nums text-brand-maroon">
                  {selection.item.price}
                </p>
              </>
            ) : (
              <>
                <DialogDescription className="font-[family-name:var(--font-serif)] text-lg font-bold tabular-nums text-brand-maroon">
                  {formatDrinkPrice(selection.item.hot, selection.item.iced)}
                </DialogDescription>
              </>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
