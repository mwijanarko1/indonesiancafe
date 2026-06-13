"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type MenuPhotoPreviewDialogProps = {
  src: string;
  alt: string;
  sizes?: string;
  variant?: "thumb" | "icon";
  triggerClassName?: string;
};

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200/80">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 672px) 100vw, 672px"
      />
    </div>
  );
}

export function MenuPhotoPreviewDialog({
  src,
  alt,
  sizes = "96px",
  variant = "thumb",
  triggerClassName,
}: MenuPhotoPreviewDialogProps) {
  return (
    <Dialog>
      {variant === "thumb" ? (
        <DialogTrigger
          type="button"
          className={cn(
            "group/preview relative block h-full w-full cursor-zoom-in overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon",
            triggerClassName,
          )}
          aria-label={`View ${alt} photo`}
        >
          <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100 data-popup-open:opacity-100"
            aria-hidden
          >
            <Eye className="h-6 w-6 text-white" />
          </div>
        </DialogTrigger>
      ) : (
        <DialogTrigger
          type="button"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white opacity-0 transition hover:bg-black/65 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            triggerClassName,
          )}
          aria-label={`View ${alt} photo`}
        >
          <Eye className="h-4 w-4" aria-hidden />
        </DialogTrigger>
      )}

      <DialogContent className="gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <PreviewImage src={src} alt={alt} />
      </DialogContent>
    </Dialog>
  );
}
