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
import { menuItemPhotoIfMatched } from "@/lib/menu-item-photos";

export type MenuDetailSelection =
  | { kind: "priced"; item: PricedMenuItem }
  | { kind: "drink"; item: DrinkMenuItem };

function formatDrinkPrice(hot: string | null, iced: string | null): string {
  if (hot && iced) return `${hot} hot · ${iced} iced`;
  if (hot) return hot;
  if (iced) return iced;
  return "—";
}

type Props = {
  selection: MenuDetailSelection | null;
  onClose: () => void;
};

export function MenuItemDetailModal({ selection, onClose }: Props) {
  const open = selection !== null;
  const title = selection ? formatMenuItemDisplayName(selection.item.name) : "";
  const photo = selection ? menuItemPhotoIfMatched(selection.item.name) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent id="menu-item-detail" className="gap-0">
        {selection ? (
          <div className="flex flex-col gap-4">
            {photo ? (
              <div className="relative -mx-2 -mt-2 aspect-[4/3] overflow-hidden rounded-xl bg-stone-200/80 sm:mx-0 sm:mt-0">
                <Image
                  src={photo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              </div>
            ) : null}

            <DialogTitle>{title}</DialogTitle>

            {selection.kind === "priced" ? (
              <>
                {selection.item.description ? (
                  <DialogDescription asChild>
                    <p>{selection.item.description}</p>
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
                <DialogDescription asChild>
                  <p className="font-[family-name:var(--font-serif)] text-lg font-bold tabular-nums text-brand-maroon">
                    {formatDrinkPrice(selection.item.hot, selection.item.iced)}
                  </p>
                </DialogDescription>
              </>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
