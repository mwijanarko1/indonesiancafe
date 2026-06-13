"use client";

import { useTransition, useState, useRef, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Eye, EyeOff, Pencil, Trash2, ImagePlus, EllipsisVertical } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  togglePricedItemAvailability,
  toggleDrinkItemAvailability,
  editPricedItem,
  editDrinkItem,
  deletePricedItem,
  deleteDrinkItem,
  uploadMenuItemPhoto,
} from "@/lib/actions/admin-menu";
import { formatMenuItemDisplayName } from "@/lib/cafe-menu";
import { menuItemPhotoSrc, adminMenuPhotoPreview, HIDDEN_MENU_PHOTO } from "@/lib/menu-item-photos";
import { MenuPhotoPreviewDialog } from "@/components/admin/MenuPhotoPreviewDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  Types — mirrors the Convex validator for admin return             */
/* ------------------------------------------------------------------ */

interface AdminPricedItem {
  _id: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  categoryId: string;
}

interface AdminPricedCategory {
  _id: string;
  slug: string;
  label: string;
  variant: "priced";
  subtitle?: string;
  sortOrder: number;
  items: AdminPricedItem[];
}

interface AdminDrinkItem {
  _id: string;
  name: string;
  hot: string | null;
  iced: string | null;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  groupId: string;
}

interface AdminDrinkGroup {
  _id: string;
  title: string;
  sortOrder: number;
  items: AdminDrinkItem[];
}

interface AdminDrinksCategory {
  _id: string;
  slug: string;
  label: string;
  variant: "drinks";
  sortOrder: number;
  groups: AdminDrinkGroup[];
}

type AdminCategory = AdminPricedCategory | AdminDrinksCategory;

interface AdminMenuData {
  categories: AdminCategory[];
}

/* ------------------------------------------------------------------ */
/*  Image helpers                                                     */
/* ------------------------------------------------------------------ */

function itemImageSrc(item: { name: string; image?: string }): string | null {
  return menuItemPhotoSrc(item);
}

function ImageThumb({ src, alt }: { src: string | null; alt: string }) {
  if (!src)
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-stone-200/80 sm:h-24 sm:w-24">
        <span className="font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-wider text-stone-400">
          No photo
        </span>
      </div>
    );

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-200/80 sm:h-24 sm:w-24">
      <MenuPhotoPreviewDialog src={src} alt={alt} />
    </div>
  );
}

function EditableImagePreview({
  src,
  alt,
  onImageChange,
  onRemove,
  compact = false,
}: {
  src: string | null;
  alt: string;
  onImageChange: (url: string) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      try {
        const url = await uploadMenuItemPhoto(formData);
        onImageChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
      }}
    />
  );

  const photoEditButtonClass =
    "group/edit inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-maroon/20 bg-transparent text-brand-maroon shadow-sm transition duration-200 hover:border-brand-maroon hover:bg-brand-menu-surface hover:text-brand-oxblood active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand-maroon/20 disabled:hover:bg-transparent disabled:hover:text-brand-maroon";

  const photoDeleteButtonClass =
    "group/delete inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-maroon/20 bg-transparent text-brand-maroon/75 shadow-sm transition duration-200 hover:border-red-300/90 hover:bg-red-50/90 hover:text-red-600 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-brand-maroon/20 disabled:hover:bg-transparent disabled:hover:text-brand-maroon/75";

  if (compact) {
    return (
      <div className="w-20 shrink-0 sm:w-24">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-stone-200/80 sm:h-24 sm:w-24">
          {src ? (
            <MenuPhotoPreviewDialog src={src} alt={alt} />
          ) : (
            <div className="flex h-full items-center justify-center px-1 text-center font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-wider text-stone-400">
              No photo
            </div>
          )}
          {pending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-cream-page/80 font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-wide text-brand-maroon">
              Uploading…
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className={photoEditButtonClass}
            aria-label={src ? "Change photo" : "Add photo"}
          >
            <Pencil className="h-3.5 w-3.5 transition duration-200 group-hover/edit:scale-110" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={pending || !src}
            className={photoDeleteButtonClass}
            aria-label="Remove photo"
          >
            <Trash2 className="h-3.5 w-3.5 transition duration-200 group-hover/delete:scale-110" aria-hidden />
          </button>
        </div>

        {fileInput}
        {error ? <p className="mt-2 text-center text-[0.65rem] leading-snug text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-200/80 shadow-sm">
        {src ? (
          <>
            <Image src={src} alt={alt} fill className="object-contain p-2" sizes="600px" />
            <div className="absolute right-2 top-2 z-10">
              <MenuPhotoPreviewDialog src={src} alt={alt} variant="icon" />
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-stone-400 disabled:cursor-wait"
            aria-label="Add photo"
          >
            <ImagePlus className="h-8 w-8" aria-hidden />
            <span className="text-sm font-medium">Add photo</span>
          </button>
        )}
        {src ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className={cn(
              "absolute inset-x-0 bottom-0 z-[1] flex items-center justify-center bg-black/55 py-2.5 text-sm font-semibold text-white opacity-0 transition disabled:cursor-wait group-hover:opacity-100 focus-visible:opacity-100",
              pending && "opacity-100",
            )}
            aria-label="Change photo"
          >
            {pending ? "Uploading…" : "Change photo"}
          </button>
        ) : null}
        {fileInput}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function FormFieldLabel({
  children,
  optional,
}: {
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stone-500">
      {children}
      {optional ? (
        <span className="font-normal normal-case tracking-normal text-stone-400"> (optional)</span>
      ) : null}
    </label>
  );
}

const ADMIN_FIELD_CLASS =
  "border-brand-maroon/15 bg-transparent text-brand-maroon placeholder:text-stone-400 focus-visible:ring-brand-maroon focus-visible:ring-offset-brand-cream-page";

const ADMIN_TEXTAREA_CLASS = cn(
  ADMIN_FIELD_CLASS,
  "min-h-[6.5rem] resize-y py-2.5 leading-relaxed",
);

function InlineEditToolbar({
  onCancel,
  disabled,
}: {
  onCancel: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-brand-maroon/15 pb-2">
      <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
        Editing
      </p>
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-maroon transition hover:text-brand-oxblood disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline edit — Priced item                                          */
/* ------------------------------------------------------------------ */

function PricedItemInlineEdit({
  item,
  onCancel,
  onSaved,
}: {
  item: AdminPricedItem;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description ?? "");
  const [image, setImage] = useState(item.image ?? "");
  const [pending, startTransition] = useTransition();
  const hadCustomImage = Boolean(item.image?.trim());
  const previewSrc = adminMenuPhotoPreview(image, name);

  function handleRemovePhoto() {
    const trimmed = image.trim();
    if (trimmed && trimmed !== HIDDEN_MENU_PHOTO) {
      setImage("");
      return;
    }
    setImage(HIDDEN_MENU_PHOTO);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;
    const trimmedImage = image.trim();
    startTransition(async () => {
      await editPricedItem(
        item._id,
        name.trim(),
        price.trim(),
        description.trim(),
        trimmedImage === HIDDEN_MENU_PHOTO
          ? HIDDEN_MENU_PHOTO
          : trimmedImage || undefined,
        hadCustomImage,
      );
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InlineEditToolbar onCancel={onCancel} disabled={pending} />

      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <EditableImagePreview
          compact
          src={previewSrc}
          alt={name}
          onImageChange={setImage}
          onRemove={handleRemovePhoto}
        />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-1.5">
            <FormFieldLabel>Name</FormFieldLabel>
            <Input
              className={ADMIN_FIELD_CLASS}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <FormFieldLabel>Price</FormFieldLabel>
            <Input
              className={ADMIN_FIELD_CLASS}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="£9.50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <FormFieldLabel optional>Description</FormFieldLabel>
            <textarea
              className={cn(
                "flex w-full rounded-md border px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                ADMIN_TEXTAREA_CLASS,
              )}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Served with …"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={pending || !name.trim() || !price.trim()}
          className="bg-brand-maroon text-brand-cream hover:bg-brand-oxblood"
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline edit — Drink item                                           */
/* ------------------------------------------------------------------ */

function DrinkItemInlineEdit({
  item,
  onCancel,
  onSaved,
}: {
  item: AdminDrinkItem;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [hot, setHot] = useState(item.hot ?? "");
  const [iced, setIced] = useState(item.iced ?? "");
  const [image, setImage] = useState(item.image ?? "");
  const [pending, startTransition] = useTransition();
  const hadCustomImage = Boolean(item.image?.trim());
  const previewSrc = adminMenuPhotoPreview(image, name);

  function handleRemovePhoto() {
    const trimmed = image.trim();
    if (trimmed && trimmed !== HIDDEN_MENU_PHOTO) {
      setImage("");
      return;
    }
    setImage(HIDDEN_MENU_PHOTO);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const trimmedImage = image.trim();
    startTransition(async () => {
      await editDrinkItem(
        item._id,
        name.trim(),
        hot.trim(),
        iced.trim(),
        trimmedImage === HIDDEN_MENU_PHOTO
          ? HIDDEN_MENU_PHOTO
          : trimmedImage || undefined,
        hadCustomImage,
      );
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InlineEditToolbar onCancel={onCancel} disabled={pending} />

      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <EditableImagePreview
          compact
          src={previewSrc}
          alt={name}
          onImageChange={setImage}
          onRemove={handleRemovePhoto}
        />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-1.5">
            <FormFieldLabel>Name</FormFieldLabel>
            <Input
              className={ADMIN_FIELD_CLASS}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Drink name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FormFieldLabel optional>Hot price</FormFieldLabel>
              <Input
                className={ADMIN_FIELD_CLASS}
                value={hot}
                onChange={(e) => setHot(e.target.value)}
                placeholder="£3.50"
              />
            </div>
            <div className="space-y-1.5">
              <FormFieldLabel optional>Iced price</FormFieldLabel>
              <Input
                className={ADMIN_FIELD_CLASS}
                value={iced}
                onChange={(e) => setIced(e.target.value)}
                placeholder="£4.00"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={pending || !name.trim()}
          className="bg-brand-maroon text-brand-cream hover:bg-brand-oxblood"
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete confirmation dialog                                         */
/* ------------------------------------------------------------------ */

function DeleteDialog({
  itemName,
  open,
  onOpenChange,
  onConfirm,
}: {
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(() => {
      onConfirm();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{itemName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={pending}
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Actions dropdown menu                                             */
/* ------------------------------------------------------------------ */

function ActionsMenu({
  onToggle,
  onEdit,
  onDelete,
  isAvailable,
}: {
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isAvailable: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-11 min-h-11 w-full justify-center gap-2 rounded-lg border-brand-maroon/20 text-brand-maroon shadow-none hover:bg-brand-cream hover:text-brand-maroon sm:size-9 sm:min-h-0 sm:w-9 sm:gap-0 sm:px-0"
          aria-label="Open menu"
        >
          <span className="font-[family-name:var(--font-label)] text-[0.7rem] font-bold uppercase tracking-[0.06em] sm:hidden">
            More
          </span>
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] sm:w-auto sm:min-w-[150px]"
      >
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onToggle}
          className={isAvailable ? "text-red-600" : "text-green-600"}
        >
          {isAvailable ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {isAvailable ? "Hide" : "Show"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------ */
/*  Item row layout                                                   */
/* ------------------------------------------------------------------ */

function AdminMenuItemShell({
  image,
  title,
  price,
  priceClassName,
  actions,
  children,
}: {
  image: ReactNode;
  title: ReactNode;
  price: ReactNode;
  priceClassName?: string;
  actions: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 sm:gap-4">
        {image}
        <div className="min-w-0 flex-1">
          {title}
          {children}
          <div className={cn("mt-1.5 sm:hidden", priceClassName)}>{price}</div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 self-start sm:flex">
          <div className={priceClassName}>{price}</div>
          {actions}
        </div>
      </div>
      <div className="sm:hidden">{actions}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Priced item row                                                   */
/* ------------------------------------------------------------------ */

function PricedItemRow({ item }: { item: AdminPricedItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();
  const imgSrc = itemImageSrc(item);

  function handleToggle() {
    startTransition(async () => {
      await togglePricedItemAvailability(item._id, !item.isAvailable);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deletePricedItem(item._id);
      setDeleteOpen(false);
    });
  }

  return (
    <>
      <li
        className={cn(
          "border-b border-brand-maroon/10 pb-5 last:border-0",
          !isEditing && !item.isAvailable && "opacity-60",
        )}
      >
        {isEditing ? (
          <PricedItemInlineEdit
            key={item._id}
            item={item}
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
          />
        ) : (
          <AdminMenuItemShell
            image={<ImageThumb src={imgSrc} alt={item.name} />}
            price={item.price}
            priceClassName="font-[family-name:var(--font-serif)] font-bold tabular-nums text-brand-maroon"
            actions={
              <ActionsMenu
                onToggle={handleToggle}
                onEdit={() => setIsEditing(true)}
                onDelete={() => setDeleteOpen(true)}
                isAvailable={item.isAvailable}
              />
            }
            title={
              <p
                className={cn(
                  "font-[family-name:var(--font-serif)] font-bold text-brand-maroon",
                  !item.isAvailable && "line-through",
                )}
              >
                {formatMenuItemDisplayName(item.name)}
              </p>
            }
          >
            {item.description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{item.description}</p>
            ) : null}
            {!item.isAvailable ? (
              <p className="mt-1.5 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-wide text-brand-maroon/70">
                Hidden from menu
              </p>
            ) : null}
          </AdminMenuItemShell>
        )}
      </li>

      <DeleteDialog
        itemName={item.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Drink item row                                                    */
/* ------------------------------------------------------------------ */

function DrinkItemRow({ item }: { item: AdminDrinkItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();
  const imgSrc = itemImageSrc(item);

  function handleToggle() {
    startTransition(async () => {
      await toggleDrinkItemAvailability(item._id, !item.isAvailable);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteDrinkItem(item._id);
      setDeleteOpen(false);
    });
  }

  const priceLabel = [
    item.hot ? `${item.hot} hot` : null,
    item.iced ? `${item.iced} iced` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <li
        className={cn(
          "border-b border-brand-maroon/10 pb-5 last:border-0",
          !isEditing && !item.isAvailable && "opacity-60",
        )}
      >
        {isEditing ? (
          <DrinkItemInlineEdit
            key={item._id}
            item={item}
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
          />
        ) : (
          <AdminMenuItemShell
            image={<ImageThumb src={imgSrc} alt={item.name} />}
            price={priceLabel || "—"}
            priceClassName="text-right font-[family-name:var(--font-serif)] text-sm font-bold leading-snug tabular-nums text-brand-maroon"
            actions={
              <ActionsMenu
                onToggle={handleToggle}
                onEdit={() => setIsEditing(true)}
                onDelete={() => setDeleteOpen(true)}
                isAvailable={item.isAvailable}
              />
            }
            title={
              <p
                className={cn(
                  "font-[family-name:var(--font-serif)] font-bold text-brand-maroon",
                  !item.isAvailable && "line-through",
                )}
              >
                {formatMenuItemDisplayName(item.name)}
              </p>
            }
          >
            {!item.isAvailable ? (
              <p className="mt-1.5 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-wide text-brand-maroon/70">
                Hidden from menu
              </p>
            ) : null}
          </AdminMenuItemShell>
        )}
      </li>

      <DeleteDialog
        itemName={item.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Drink group                                                       */
/* ------------------------------------------------------------------ */

function DrinkGroupSection({ group }: { group: AdminDrinkGroup }) {
  return (
    <div>
      <p className="mt-10 border-b border-brand-maroon/15 pb-2 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500 first:mt-4">
        {group.title}
      </p>
      <ul className="mt-4 space-y-5">
        {group.items.map((item) => (
          <DrinkItemRow key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category panel (tab content)                                      */
/* ------------------------------------------------------------------ */

function CategoryPanel({ category }: { category: AdminCategory }) {
  return (
    <div>
      {category.variant === "priced" && category.subtitle ? (
        <p className="text-sm text-stone-600">{category.subtitle}</p>
      ) : null}

      {category.variant === "priced" ? (
        category.items.length > 0 ? (
          <ul className={cn("space-y-5", category.subtitle && "mt-4")}>
            {category.items.map((item) => (
              <PricedItemRow key={item._id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-stone-500">No items</p>
        )
      ) : category.groups.length > 0 ? (
        <div>
          {category.groups.map((group) => (
            <DrinkGroupSection key={group._id} group={group} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-stone-500">No groups</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard shell                                                    */
/* ------------------------------------------------------------------ */

export function AdminMenuDashboard({ data }: { data: AdminMenuData }) {
  const [activeCategory, setActiveCategory] = useState(data.categories[0]?._id ?? "");

  const stats = {
    totalCategories: data.categories.length,
    totalPricedItems: data.categories.reduce(
      (acc, c) => (c.variant === "priced" ? acc + c.items.length : acc),
      0,
    ),
    totalDrinkItems: data.categories.reduce(
      (acc, c) =>
        c.variant === "drinks"
          ? acc + c.groups.reduce((gAcc, g) => gAcc + g.items.length, 0)
          : acc,
      0,
    ),
    hiddenPricedItems: data.categories.reduce(
      (acc, c) =>
        c.variant === "priced"
          ? acc + c.items.filter((i) => !i.isAvailable).length
          : acc,
      0,
    ),
    hiddenDrinkItems: data.categories.reduce(
      (acc, c) =>
        c.variant === "drinks"
          ? acc +
            c.groups.reduce(
              (gAcc, g) => gAcc + g.items.filter((i) => !i.isAvailable).length,
              0,
            )
          : acc,
      0,
    ),
  };

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Categories" value={stats.totalCategories} />
        <SummaryCard label="Priced Items" value={stats.totalPricedItems} />
        <SummaryCard label="Drink Items" value={stats.totalDrinkItems} />
        <SummaryCard
          label="Hidden"
          value={stats.hiddenPricedItems + stats.hiddenDrinkItems}
          accent
        />
      </div>

      {/* Categories */}
      {data.categories.length > 0 ? (
        <div>
          <div className="-mx-4 border-b border-brand-maroon/10 px-4 py-3 sm:-mx-6 sm:px-6">
            <AnimatedTabs
              activeTab={activeCategory}
              layoutId="admin-menu-category-tabs"
              onChange={setActiveCategory}
              tabs={data.categories.map((category) => ({
                id: category._id,
                label: category.label,
              }))}
              variant="pill"
              className="w-full"
              tabClassName="font-[family-name:var(--font-label)] text-[0.7rem] font-bold uppercase tracking-[0.06em] sm:px-5 sm:text-xs"
            />
          </div>

          {data.categories.map((category) =>
            activeCategory === category._id ? (
              <div key={category._id} className="pt-8">
                <CategoryPanel category={category} />
              </div>
            ) : null,
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-stone-500">No categories</p>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
      <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon",
          accent && value === 0 && "text-stone-600",
        )}
      >
        {value}
      </p>
    </div>
  );
}
