"use client";

import { useTransition, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  parsePrice,
  parseDrinkPrice,
  formatMenuItemDisplayName,
  type MenuCategory,
} from "@/lib/cafe-menu";
import {
  placeStaffOrder,
  updateOrderStatus,
  deleteOrder,
  editOrder,
  type OrderItemInput,
  type OrderStatus,
} from "@/lib/actions/admin-orders";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Check,
  X,
  Clock,
  Save,
  Pencil,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AdminOrder = {
  _id: string;
  _creationTime: number;
  tableNumber?: number | null;
  status: OrderStatus;
  total: number;
  createdAt: number;
  createdBy: string;
  notes?: string | null;
  items: AdminOrderItem[];
};

type AdminOrderItem = {
  _id: string;
  menuItemName: string;
  priceAtOrder: number;
  quantity: number;
  notes?: string | null;
  sortOrder: number;
};

/* ------------------------------------------------------------------ */
/*  Cart item (local state)                                            */
/* ------------------------------------------------------------------ */

interface CartItemEntry {
  id: string;
  menuItemName: string;
  priceAtOrder: number;
  quantity: number;
  variant: "priced" | "drink";
  notes?: string;
}

let cartIdCounter = 0;
function nextCartId(): string {
  return `cart-${++cartIdCounter}`;
}



/* ------------------------------------------------------------------ */
/*  Quantity stepper                                                   */
/* ------------------------------------------------------------------ */

function QuantityStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-maroon/20 text-brand-maroon transition hover:bg-brand-maroon/10 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="min-w-[1.5rem] text-center font-[family-name:var(--font-serif)] text-sm font-bold tabular-nums text-brand-maroon">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-maroon/20 text-brand-maroon transition hover:bg-brand-maroon/10"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Menu item row for order builder                                    */
/* ------------------------------------------------------------------ */

function PricedBuilderItem({
  name,
  price,
  onAdd,
}: {
  name: string;
  price: string;
  onAdd: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const numericPrice = parsePrice(price);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-brand-maroon/10 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-serif)] text-sm font-bold text-brand-maroon">
          {formatMenuItemDisplayName(name)}
        </p>
        <p className="text-xs tabular-nums text-stone-500">{price}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <QuantityStepper value={qty} onChange={setQty} />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            onAdd(qty);
            setQty(1);
          }}
          className="h-7 bg-brand-maroon text-brand-cream hover:bg-brand-oxblood"
          disabled={numericPrice === 0}
          aria-label={`Add ${name}`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="ml-1 hidden sm:inline">Add</span>
        </Button>
      </div>
    </div>
  );
}

function DrinkBuilderItem({
  name,
  hot,
  iced,
  onAdd,
}: {
  name: string;
  hot: string | null;
  iced: string | null;
  onAdd: (qty: number, variant: "hot" | "iced") => void;
}) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<"hot" | "iced">(
    hot ? "hot" : "iced",
  );
  const currentPrice = selectedVariant === "hot" ? hot : iced;
  const numericPrice = parsePrice(currentPrice);
  const hasBoth = hot && iced;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-brand-maroon/10 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-serif)] text-sm font-bold text-brand-maroon">
          {formatMenuItemDisplayName(name)}
        </p>
        {hasBoth ? (
          <div className="mt-1">
            <Select
              value={selectedVariant}
              onValueChange={(v) => setSelectedVariant(v as "hot" | "iced")}
            >
              <SelectTrigger className="h-7 w-20 border-brand-maroon/15 text-xs text-brand-maroon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot" className="text-xs">
                  Hot {hot}
                </SelectItem>
                <SelectItem value="iced" className="text-xs">
                  Iced {iced}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="text-xs tabular-nums text-stone-500">{currentPrice}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <QuantityStepper value={qty} onChange={setQty} />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            onAdd(qty, selectedVariant);
            setQty(1);
          }}
          className="h-7 bg-brand-maroon text-brand-cream hover:bg-brand-oxblood"
          disabled={numericPrice === 0}
          aria-label={`Add ${name}`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="ml-1 hidden sm:inline">Add</span>
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart panel                                                         */
/* ------------------------------------------------------------------ */

function CartPanel({
  cart,
  notes,
  tableNumber,
  onUpdateQuantity,
  onRemove,
  onNotesChange,
  onTableChange,
  onPlaceOrder,
  isPlacing,
}: {
  cart: CartItemEntry[];
  notes: string;
  tableNumber: string;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onNotesChange: (v: string) => void;
  onTableChange: (v: string) => void;
  onPlaceOrder: () => void;
  isPlacing: boolean;
}) {
  const total = cart.reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0);

  return (
    <div className="rounded-xl border border-brand-maroon/10 bg-white/80 p-4 shadow-sm shadow-brand-maroon/5">
      <div className="mb-3 flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-brand-maroon" />
        <h3 className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Cart
        </h3>
        {cart.length > 0 && (
          <span className="ml-auto rounded-full bg-brand-maroon px-2 py-0.5 text-[0.6rem] font-bold text-white">
            {cart.reduce((s, i) => s + i.quantity, 0)}
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-400">No items added yet. Select items above.</p>
      ) : (
        <ul className="divide-y divide-brand-maroon/10">
          {cart.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-maroon">
                  {formatMenuItemDisplayName(item.menuItemName)}
                </p>
                <p className="text-xs tabular-nums text-stone-500">£{item.priceAtOrder.toFixed(2)} each</p>
              </div>
              <QuantityStepper value={item.quantity} onChange={(v) => onUpdateQuantity(item.id, v)} min={0} />
              <p className="min-w-[4rem] text-right font-[family-name:var(--font-serif)] text-sm font-bold tabular-nums text-brand-maroon">
                £{(item.priceAtOrder * item.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="flex h-6 w-6 items-center justify-center rounded text-stone-400 hover:text-red-500"
                aria-label={`Remove ${item.menuItemName}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <label className="font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone-500">Table</label>
          <input
            type="number"
            min={1}
            value={tableNumber}
            onChange={(e) => onTableChange(e.target.value)}
            placeholder="—"
            className="h-7 w-16 rounded-md border border-brand-maroon/15 bg-transparent px-2 text-sm text-brand-maroon placeholder:text-stone-400 focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          />
        </div>
        <div>
          <label className="font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone-500">Order notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Any special instructions…"
            className="mt-1 h-8 w-full rounded-md border border-brand-maroon/15 bg-transparent px-2 text-sm text-brand-maroon placeholder:text-stone-400 focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 border-t border-brand-maroon/10 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stone-500">Total</span>
          <span className="font-[family-name:var(--font-serif)] text-xl font-bold tabular-nums text-brand-maroon">£{total.toFixed(2)}</span>
        </div>
        <Button
          type="button"
          onClick={onPlaceOrder}
          disabled={cart.length === 0 || isPlacing}
          className="mt-3 w-full bg-brand-maroon text-brand-cream hover:bg-brand-oxblood disabled:opacity-50"
        >
          {isPlacing ? "Placing…" : "Place Order"}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Editable inline item row                                           */
/* ------------------------------------------------------------------ */

function EditableItemRow({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: AdminOrderItem;
  index: number;
  onChange: (index: number, updated: Partial<AdminOrderItem>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <li className="flex items-center gap-2 py-1.5 text-sm">
      <input
        type="text"
        value={item.menuItemName}
        onChange={(e) => onChange(index, { menuItemName: e.target.value })}
        className="h-7 min-w-0 flex-1 rounded border border-brand-maroon/15 bg-transparent px-2 text-sm text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={item.priceAtOrder}
        onChange={(e) => onChange(index, { priceAtOrder: parseFloat(e.target.value) || 0 })}
        className="h-7 w-20 rounded border border-brand-maroon/15 bg-transparent px-2 text-right text-sm tabular-nums text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
      />
      <QuantityStepper
        value={item.quantity}
        onChange={(v) => onChange(index, { quantity: v })}
        min={0}
      />
      {item.notes !== undefined && (
        <input
          type="text"
          value={item.notes ?? ""}
          onChange={(e) => onChange(index, { notes: e.target.value || null })}
          placeholder="Notes"
          className="h-7 w-24 rounded border border-brand-maroon/15 bg-transparent px-2 text-xs text-stone-500 focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
        />
      )}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-stone-400 hover:text-red-500"
        aria-label="Remove item"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Order detail / edit card                                           */
/* ------------------------------------------------------------------ */

function OrderCard({
  order,
  onStatusChange,
  onDelete,
  onSaveEdit,
}: {
  order: AdminOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string, items: OrderItemInput[], status: OrderStatus | undefined, tableNumber?: number, notes?: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<AdminOrderItem[]>([]);
  const [editTable, setEditTable] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<OrderStatus>("pending");
  const [saving, startSaveTransition] = useTransition();

  const startEdit = useCallback(() => {
    setEditItems(order.items.map((i) => ({ ...i })));
    setEditTable(order.tableNumber ? String(order.tableNumber) : "");
    setEditNotes(order.notes ?? "");
    setEditStatus(order.status);
    setEditing(true);
  }, [order]);

  const handleEditChange = useCallback(
    (index: number, updated: Partial<AdminOrderItem>) => {
      setEditItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, ...updated } : item)),
      );
    },
    [],
  );

  const handleEditRemove = useCallback((index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddItem = useCallback(() => {
    setEditItems((prev) => [
      ...prev,
      { _id: "", menuItemName: "", priceAtOrder: 0, quantity: 1, sortOrder: prev.length },
    ]);
  }, []);

  const handleSave = useCallback(() => {
    const items: OrderItemInput[] = editItems
      .filter((i) => i.quantity > 0 && i.menuItemName.trim())
      .map((i) => ({
        menuItemName: i.menuItemName,
        priceAtOrder: i.priceAtOrder,
        quantity: i.quantity,
        notes: i.notes || undefined,
      }));
    if (items.length === 0) return;
    const table = editTable ? parseInt(editTable, 10) : undefined;
    const notes = editNotes.trim() || undefined;
    const status = editStatus !== order.status ? editStatus : undefined;
    startSaveTransition(async () => {
      onSaveEdit(order._id, items, status);
      setEditing(false);
    });
  }, [order._id, editItems, editTable, editNotes, editStatus, onSaveEdit]);

  const date = new Date(order.createdAt);
  const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  // editing mode
  if (editing) {
    const editTotal = editItems.reduce((s, i) => s + i.priceAtOrder * i.quantity, 0);
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/30 px-4 py-3 shadow-sm shadow-brand-maroon/5">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.14em] text-blue-600">Editing</span>
          <span className="text-xs text-stone-400">#{order._id.slice(-6)}</span>
        </div>
        <div className="mb-3 flex items-center gap-3">
          <label className="font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-[0.14em] text-stone-500">Table</label>
          <input
            type="number"
            min={1}
            value={editTable}
            onChange={(e) => setEditTable(e.target.value)}
            placeholder="—"
            className="h-7 w-16 rounded-md border border-brand-maroon/15 bg-white px-2 text-sm text-brand-maroon placeholder:text-stone-400 focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          />
          <label className="font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-[0.14em] text-stone-500">Status</label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
            className="h-7 rounded-md border border-brand-maroon/15 bg-white px-2 text-xs text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-[0.14em] text-stone-500">Notes</label>
          <input
            type="text"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            className="mt-1 h-7 w-full rounded-md border border-brand-maroon/15 bg-white px-2 text-sm text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-[family-name:var(--font-label)] text-[0.55rem] font-bold uppercase tracking-[0.14em] text-stone-500">Items</span>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium text-brand-maroon hover:bg-brand-maroon/10"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <ul className="divide-y divide-brand-maroon/5">
          {editItems.map((item, i) => (
            <EditableItemRow key={i} item={item} index={i} onChange={handleEditChange} onRemove={handleEditRemove} />
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-brand-maroon/10 pt-2">
          <span className="font-[family-name:var(--font-serif)] text-sm font-bold tabular-nums text-brand-maroon">£{editTotal.toFixed(2)}</span>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEditing(false)}
              className="h-7 border-stone-300 text-stone-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving || editItems.filter((i) => i.quantity > 0 && i.menuItemName.trim()).length === 0}
              className="h-7 bg-brand-maroon text-brand-cream hover:bg-brand-oxblood"
            >
              {saving ? "Saving…" : <><Save className="mr-1 h-3.5 w-3.5" /> Save</>}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // display mode
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 shadow-sm shadow-brand-maroon/5 transition",
        order.status === "pending" && "border-amber-200 bg-amber-50/40",
        order.status === "completed" && "border-green-200 bg-green-50/40",
        order.status === "cancelled" && "border-stone-200 bg-stone-50/60 opacity-70",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide",
                order.status === "pending" && "bg-amber-100 text-amber-800",
                order.status === "completed" && "bg-green-100 text-green-800",
                order.status === "cancelled" && "bg-stone-200 text-stone-600",
              )}
            >
              {order.status}
            </span>
            {order.tableNumber ? (
              <span className="font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.1em] text-stone-500">
                Table {order.tableNumber}
              </span>
            ) : null}
            <span className="text-xs text-stone-400">
              {dateStr} {timeStr}
            </span>
          </div>
          <p className="mt-1 font-[family-name:var(--font-serif)] text-lg font-bold tabular-nums text-brand-maroon">
            £{order.total.toFixed(2)}
          </p>
          <p className="text-xs text-stone-500">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            {order.notes ? ` · ${order.notes}` : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {(order.status === "pending" || order.status === "completed") && (
            <>
              <button
                type="button"
                onClick={startEdit}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-maroon/15 text-brand-maroon transition hover:bg-brand-maroon/10"
                aria-label="Edit order"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {order.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => onStatusChange(order._id, "completed")}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-green-300 text-green-600 transition hover:bg-green-100"
                    aria-label="Mark completed"
                    title="Complete"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(order._id, "cancelled")}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-red-300 text-red-500 transition hover:bg-red-100"
                    aria-label="Cancel order"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
              {order.status === "completed" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(order._id, "cancelled")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition hover:bg-stone-100"
                  aria-label="Cancel completed order"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          )}
          {order.status === "cancelled" && (
            <button
              type="button"
              onClick={() => onDelete(order._id)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-400 transition hover:bg-red-50"
              aria-label="Delete order"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Always show breakdown */}
      <ul className="mt-3 space-y-1 border-t border-brand-maroon/10 pt-3">
        {order.items.map((item) => (
          <li key={item._id} className="flex items-center justify-between text-sm">
            <span className="text-stone-700">
              {item.quantity}× {formatMenuItemDisplayName(item.menuItemName)}
              {item.notes ? <span className="text-xs text-stone-400"> ({item.notes})</span> : null}
            </span>
            <span className="font-[family-name:var(--font-serif)] text-sm font-bold tabular-nums text-brand-maroon">
              £{(item.priceAtOrder * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between border-t border-brand-maroon/5 pt-1.5 text-sm font-bold">
          <span className="text-stone-600">Total</span>
          <span className="font-[family-name:var(--font-serif)] tabular-nums text-brand-maroon">
            £{order.total.toFixed(2)}
          </span>
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Order list                                                         */
/* ------------------------------------------------------------------ */

function OrderList({
  orders,
  onStatusChange,
  onDelete,
  onSaveEdit,
}: {
  orders: AdminOrder[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string, items: OrderItemInput[], status: OrderStatus | undefined) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-brand-cream px-6 py-12 text-center">
        <p className="text-sm text-stone-500">No orders yet today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onSaveEdit={onSaveEdit}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Order builder category type                                        */
/* ------------------------------------------------------------------ */

type OrderBuilderCategory = MenuCategory
  | {
      _id: string;
      slug: string;
      label: string;
      variant: "priced";
      subtitle?: string;
      items: { name: string; price: string }[];
    }
  | {
      _id: string;
      slug: string;
      label: string;
      variant: "drinks";
      groups: {
        title: string;
        items: { name: string; hot: string | null; iced: string | null }[];
      }[];
    };

function getCategoryKey(category: OrderBuilderCategory): string {
  if ("id" in category && category.id) return category.id;
  if ("slug" in category && category.slug) return category.slug;
  if ("_id" in category) return category._id;
  return "";
}

/* ------------------------------------------------------------------ */
/*  Dashboard shell                                                    */
/* ------------------------------------------------------------------ */

export function AdminOrderDashboard({
  categories,
  orders: initialOrders,
}: {
  categories: OrderBuilderCategory[];
  orders: AdminOrder[];
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(() =>
    categories[0] ? getCategoryKey(categories[0]) : "",
  );
  const [cart, setCart] = useState<CartItemEntry[]>([]);
  const [cartNotes, setCartNotes] = useState("");
  const [cartTable, setCartTable] = useState("");
  const [isPlacing, startPlaceTransition] = useTransition();
  const [, startRefreshTransition] = useTransition();
  const [orders, setOrders] = useState(initialOrders);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial orders once on mount
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Refresh page data after mutation
  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleAddPriced = useCallback(
    (name: string, price: string, qty: number) => {
      const priceAtOrder = parsePrice(price);
      if (priceAtOrder <= 0) return;
      setCart((prev) => {
        const existing = prev.find((c) => c.menuItemName === name && c.variant === "priced");
        if (existing) {
          return prev.map((c) => (c.id === existing.id ? { ...c, quantity: c.quantity + qty } : c));
        }
        return [...prev, { id: nextCartId(), menuItemName: name, priceAtOrder, quantity: qty, variant: "priced" as const }];
      });
    },
    [],
  );

  const handleAddDrink = useCallback(
    (name: string, hot: string | null, iced: string | null, qty: number, variant: "hot" | "iced") => {
      const priceStr = variant === "hot" ? hot : iced;
      const priceAtOrder = parsePrice(priceStr);
      if (priceAtOrder <= 0) return;
      const label = `${name} (${variant})`;
      setCart((prev) => {
        const existing = prev.find((c) => c.menuItemName === label && c.variant === "drink");
        if (existing) {
          return prev.map((c) => (c.id === existing.id ? { ...c, quantity: c.quantity + qty } : c));
        }
        return [...prev, { id: nextCartId(), menuItemName: label, priceAtOrder, quantity: qty, variant: "drink" as const }];
      });
    },
    [],
  );

  const handleUpdateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    } else {
      setCart((prev) => prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c)));
    }
  }, []);

  const handleRemove = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handlePlaceOrder = useCallback(() => {
    if (cart.length === 0) return;
    const items: OrderItemInput[] = cart.map((c) => ({
      menuItemName: c.menuItemName,
      priceAtOrder: c.priceAtOrder,
      quantity: c.quantity,
    }));
    const table = cartTable ? parseInt(cartTable, 10) : undefined;
    const orderNotes = cartNotes.trim() || undefined;

    setErrorMessage(null);
    startPlaceTransition(async () => {
      try {
        await placeStaffOrder(items, table, orderNotes);
        setCart([]);
        setCartNotes("");
        setCartTable("");
        refreshPage();
      } catch (err) {
        setErrorMessage((err as Error)?.message ?? "Failed to place order");
      }
    });
  }, [cart, cartTable, cartNotes, refreshPage]);

  const handleStatusChange = useCallback(
    (orderId: string, status: OrderStatus) => {
      setErrorMessage(null);
      startRefreshTransition(async () => {
        try {
          await updateOrderStatus(orderId, status);
          refreshPage();
        } catch (err) {
          setErrorMessage((err as Error)?.message ?? "Failed to update status");
        }
      });
    },
    [refreshPage],
  );

  const handleDelete = useCallback(
    (orderId: string) => {
      setErrorMessage(null);
      startRefreshTransition(async () => {
        try {
          await deleteOrder(orderId);
          refreshPage();
        } catch (err) {
          setErrorMessage((err as Error)?.message ?? "Failed to delete order");
        }
      });
    },
    [refreshPage],
  );

  const handleSaveEdit = useCallback(
    (orderId: string, items: OrderItemInput[], status: OrderStatus | undefined, tableNumber?: number, notes?: string) => {
      setErrorMessage(null);
      startRefreshTransition(async () => {
        try {
          await editOrder(orderId, items, tableNumber, notes, status);
          refreshPage();
        } catch (err) {
          setErrorMessage((err as Error)?.message ?? "Failed to save order");
        }
      });
    },
    [refreshPage],
  );

  return (
    <div className="space-y-8">
      {/* Error feedback */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Order builder + cart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="order-first lg:order-last lg:sticky lg:top-6 lg:self-start">
          <CartPanel
            cart={cart}
            notes={cartNotes}
            tableNumber={cartTable}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onNotesChange={setCartNotes}
            onTableChange={setCartTable}
            onPlaceOrder={handlePlaceOrder}
            isPlacing={isPlacing}
          />
        </div>

        <div className="order-last lg:order-first lg:col-span-2">
          <h3 className="mb-4 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
            Build Order
          </h3>
          {categories.length > 0 ? (
            <div>
              <div className="-mx-4 border-b border-brand-maroon/10 px-4 py-3 sm:-mx-6 sm:px-6">
                <AnimatedTabs
                  activeTab={activeCategory}
                  layoutId="admin-order-category-tabs"
                  onChange={setActiveCategory}
                  tabs={categories.map((cat) => ({ id: getCategoryKey(cat), label: cat.label }))}
                  variant="pill"
                  className="w-full"
                  tabClassName="font-[family-name:var(--font-label)] text-[0.7rem] font-bold uppercase tracking-[0.06em] sm:px-5 sm:text-xs"
                />
              </div>
              {categories.map((cat) =>
                activeCategory === getCategoryKey(cat) ? (
                  <div key={getCategoryKey(cat)} className="pt-4">
                    {cat.variant === "priced" ? (
                      <div>
                        {cat.items.map((item) => (
                          <PricedBuilderItem
                            key={item.name}
                            name={item.name}
                            price={item.price}
                            onAdd={(qty) => handleAddPriced(item.name, item.price, qty)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div>
                        {cat.groups.map((group) => (
                          <div key={group.title}>
                            <p className="mt-6 border-b border-brand-maroon/15 pb-1.5 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.16em] text-stone-500 first:mt-0">
                              {group.title}
                            </p>
                            <div>
                              {group.items.map((item) => (
                                <DrinkBuilderItem
                                  key={item.name}
                                  name={item.name}
                                  hot={item.hot}
                                  iced={item.iced}
                                  onAdd={(qty, variant) => handleAddDrink(item.name, item.hot, item.iced, qty, variant)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null,
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-stone-500">No menu categories available.</p>
          )}
        </div>
      </div>

      {/* Today's orders */}
      <div>
        <h3 className="mb-4 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Today&apos;s Orders
        </h3>
        <OrderList
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSaveEdit={handleSaveEdit}
        />
      </div>
    </div>
  );
}
