"use client";

import { type CSSProperties, useId } from "react";
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

function LiquidGlassDisplacementFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0">
      <defs>
        <filter
          id={id}
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves="2"
            seed="9"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="7" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feColorMatrix
            in="refracted"
            type="matrix"
            values="1.025 0 0 0 0  0 1.015 0 0 0  0 0 1.04 0 0  0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function MenuItemDetailModal({ selection, onClose }: Props) {
  const open = selection !== null;
  const title = selection ? formatMenuItemDisplayName(selection.item.name) : "";
  const photo = selection ? menuItemPhotoSrc(selection.item) : null;
  const rawFilterId = useId();
  const filterId = `menu-liquid-glass-${rawFilterId.replace(/:/g, "")}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        id="menu-item-detail"
        className="liquid-glass-modal gap-0 overflow-hidden rounded-[1.75rem] border border-white/35 bg-white/18 p-4 shadow-2xl backdrop-blur-2xl backdrop-saturate-200 sm:max-w-lg"
        style={{ "--liquid-glass-filter": `url(#${filterId})` } as CSSProperties}
      >
        <LiquidGlassDisplacementFilter id={filterId} />
        {selection ? (
          <div className="liquid-glass-refracted relative z-10 flex flex-col gap-4">
            {photo ? (
              <div className="liquid-glass-image relative -mx-2 -mt-2 aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.55),0_18px_50px_rgb(58_5_9_/_0.18)] sm:mx-0 sm:mt-0">
                <Image
                  src={photo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              </div>
            ) : null}

            <DialogTitle className="text-brand-maroon drop-shadow-[0_1px_0_rgb(255_255_255_/_0.45)]">{title}</DialogTitle>

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
