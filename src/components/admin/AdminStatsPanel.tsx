"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Pencil, Trash2, Check, X, Plus, Save } from "lucide-react";
import { format } from "date-fns";
import {
  fetchMonthlyStatsAction,
  fetchYearlyStatsAction,
  fetchOrdersByDayAction,
} from "@/lib/actions/admin-stats";
import {
  deleteOrder,
  editOrder,
  updateOrderStatus,
  type OrderItemInput,
  type OrderStatus,
} from "@/lib/actions/admin-orders";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  itemsSold: { menuItemName: string; quantity: number; revenue: number }[];
};

type MonthStats = {
  totalOrders: number;
  totalRevenue: number;
  itemsSold: { menuItemName: string; quantity: number; revenue: number }[];
};

type YearMonthRow = {
  month: number;
  totalOrders: number;
  totalRevenue: number;
};

type DailyOrder = {
  _id: string;
  _creationTime: number;
  tableNumber?: number | null;
  status: string;
  total: number;
  createdAt: number;
  createdBy: string;
  notes?: string | null;
  items: {
    _id: string;
    menuItemName: string;
    priceAtOrder: number;
    quantity: number;
    notes?: string | null;
    sortOrder: number;
  }[];
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function currentYear() {
  return new Date().getFullYear();
}

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

function todayStartTS(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function formatDateISO(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateISO(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

function addDays(ts: number, days: number): number {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/* ------------------------------------------------------------------ */
/*  Month stats panel                                                  */
/* ------------------------------------------------------------------ */

function MonthStatsView({
  stats,
  year,
  month,
}: {
  stats: MonthStats | null;
  year: number;
  month: number;
}) {
  if (!stats) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-brand-cream px-6 py-8 text-center">
        <p className="text-sm text-stone-500">No data for {MONTH_NAMES[month]} {year}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
            Orders
          </p>
          <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">
            {stats.totalOrders}
          </p>
        </div>
        <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
            Revenue
          </p>
          <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">
            £{stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {stats.itemsSold.length > 0 && (
        <div>
          <h3 className="mb-3 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
            Items Sold
          </h3>
          <div className="overflow-x-auto rounded-xl border border-brand-maroon/10 bg-white/80 shadow-sm shadow-brand-maroon/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-maroon/10 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone-500">
                  <th className="px-4 py-3 font-[family-name:var(--font-label)]">Item</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-label)]">Sold</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-label)]">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-maroon/5">
                {stats.itemsSold.map((item) => (
                  <tr key={item.menuItemName} className="text-brand-maroon">
                    <td className="px-4 py-2.5 font-[family-name:var(--font-serif)] font-bold">{item.menuItemName}</td>
                    <td className="px-4 py-2.5 tabular-nums">{item.quantity}</td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-serif)] font-bold tabular-nums">£{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Yearly per-month breakdown                                         */
/* ------------------------------------------------------------------ */

function YearBreakdownView({ rows, year }: { rows: YearMonthRow[]; year: number }) {
  const totalOrders = rows.reduce((s, r) => s + r.totalOrders, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.totalRevenue, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">Year to Date Orders</p>
          <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">{totalOrders}</p>
        </div>
        <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">Year to Date Revenue</p>
          <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">£{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-maroon/10 bg-white/80 shadow-sm shadow-brand-maroon/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-maroon/10 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone-500">
              <th className="px-4 py-3 font-[family-name:var(--font-label)]">Month</th>
              <th className="px-4 py-3 font-[family-name:var(--font-label)]">Orders</th>
              <th className="px-4 py-3 font-[family-name:var(--font-label)]">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-maroon/5">
            {rows.map((row) => (
              <tr key={row.month} className="text-brand-maroon">
                <td className="px-4 py-2.5 font-[family-name:var(--font-serif)] font-bold">{MONTH_NAMES[row.month]}</td>
                <td className="px-4 py-2.5 tabular-nums">{row.totalOrders}</td>
                <td className="px-4 py-2.5 font-[family-name:var(--font-serif)] font-bold tabular-nums">£{row.totalRevenue.toFixed(2)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-stone-400">No orders for {year}.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Editable item row (used during edit mode)                          */
/* ------------------------------------------------------------------ */

function EditableItemRow({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: { menuItemName: string; priceAtOrder: number; quantity: number; notes?: string | null };
  index: number;
  onChange: (index: number, updated: Partial<typeof item>) => void;
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
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(index, { quantity: Math.max(1, item.quantity - 1) })}
          disabled={item.quantity <= 1}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-brand-maroon/20 text-brand-maroon transition hover:bg-brand-maroon/10 disabled:opacity-30"
          aria-label="Decrease quantity"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
        </button>
        <span className="min-w-[1.5rem] text-center font-[family-name:var(--font-serif)] text-sm font-bold tabular-nums text-brand-maroon">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(index, { quantity: item.quantity + 1 })}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-brand-maroon/20 text-brand-maroon transition hover:bg-brand-maroon/10"
          aria-label="Increase quantity"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
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
/*  Daily order card (with inline edit, status change, delete)         */
/* ------------------------------------------------------------------ */

function DailyOrderCard({
  order,
  onStatusChange,
  onDelete,
  onSaveEdit,
}: {
  order: DailyOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string, items: OrderItemInput[], status: OrderStatus | undefined, tableNumber?: number, notes?: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<DailyOrder["items"]>([]);
  const [editStatus, setEditStatus] = useState<OrderStatus>("pending");
  const [saving, startSaveTransition] = useTransition();

  const startEdit = useCallback(() => {
    setEditItems(order.items.map((i) => ({ ...i })));
    setEditStatus(order.status as OrderStatus);
    setEditing(true);
  }, [order]);

  const handleEditChange = useCallback(
    (index: number, updated: Partial<(typeof editItems)[number]>) => {
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
      { _id: "", menuItemName: "", priceAtOrder: 0, quantity: 1, sortOrder: prev.length, notes: null },
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
    const status = editStatus !== order.status ? editStatus : undefined;
    startSaveTransition(async () => {
      onSaveEdit(
        order._id,
        items,
        status,
        order.tableNumber ?? undefined,
        order.notes ?? undefined,
      );
      setEditing(false);
    });
  }, [order._id, order.status, order.tableNumber, order.notes, editItems, editStatus, onSaveEdit]);

  const timeStr = new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  if (editing) {
    const editTotal = editItems.reduce((s, i) => s + i.priceAtOrder * i.quantity, 0);
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/30 px-4 py-3 shadow-sm shadow-brand-maroon/5">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.14em] text-blue-600">Editing</span>
          <span className="text-xs text-stone-400">#{order._id.slice(-6)}</span>
        </div>
        <div className="mb-3 flex items-center gap-3">
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

  const statusColor =
    order.status === "pending" ? "bg-amber-100 text-amber-800" :
    order.status === "completed" ? "bg-green-100 text-green-800" :
    "bg-stone-200 text-stone-600";

  return (
    <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${statusColor}`}>
              {order.status}
            </span>
            {order.tableNumber ? (
              <span className="font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.1em] text-stone-500">
                Table {order.tableNumber}
              </span>
            ) : null}
            <span className="text-xs text-stone-400">{timeStr}</span>
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
      <ul className="mt-3 space-y-1 border-t border-brand-maroon/10 pt-3">
        {order.items.map((item) => (
          <li key={item._id} className="flex items-center justify-between text-sm">
            <span className="text-stone-700">
              {item.quantity}× {item.menuItemName}
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
/*  Stats panel                                                        */
/* ------------------------------------------------------------------ */

export function AdminStatsPanel({
  stats,
}: {
  stats: AdminStats;
}) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(currentYear());
  const [monthStats, setMonthStats] = useState<MonthStats | null>(null);
  const [yearRows, setYearRows] = useState<YearMonthRow[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingYear, setLoadingYear] = useState(false);

  // Daily browsing state
  const [dayStart, setDayStart] = useState(todayStartTS());
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>([]);
  const [loadingDay, setLoadingDay] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch orders for the selected day
  useEffect(() => {
    let cancelled = false;
    setLoadingDay(true);
    const dayEnd = dayStart + 86400000;
    fetchOrdersByDayAction(dayStart, dayEnd).then((data) => {
      if (!cancelled) {
        setDailyOrders(Array.isArray(data) ? (data as DailyOrder[]) : []);
        setLoadingDay(false);
      }
    }).catch(() => {
      if (!cancelled) setLoadingDay(false);
    });
    return () => { cancelled = true; };
  }, [dayStart]);

  const handlePrevDay = useCallback(() => {
    setDayStart((prev) => addDays(prev, -1));
  }, []);

  const handleNextDay = useCallback(() => {
    setDayStart((prev) => addDays(prev, 1));
  }, []);

  const handleDateInput = useCallback((iso: string) => {
    setDayStart(parseDateISO(iso));
  }, []);

  const handleToday = useCallback(() => {
    setDayStart(todayStartTS());
  }, []);

  // Refresh daily orders and month/year stats after mutations
  const refreshAll = useCallback(() => {
    const dayEnd = dayStart + 86400000;
    setLoadingDay(true);
    fetchOrdersByDayAction(dayStart, dayEnd).then((data) => {
      setDailyOrders(Array.isArray(data) ? (data as DailyOrder[]) : []);
      setLoadingDay(false);
    }).catch(() => setLoadingDay(false));

    setLoadingMonth(true);
    fetchMonthlyStatsAction(year, month).then((data) => {
      setMonthStats(data);
      setLoadingMonth(false);
    }).catch(() => setLoadingMonth(false));

    setLoadingYear(true);
    fetchYearlyStatsAction(year).then((data) => {
      setYearRows(data);
      setLoadingYear(false);
    }).catch(() => setLoadingYear(false));
  }, [dayStart, year, month]);

  // Mutation handlers
  const handleStatusChange = useCallback((orderId: string, status: OrderStatus) => {
    setErrorMessage(null);
    updateOrderStatus(orderId, status)
      .then(refreshAll)
      .catch((err) => setErrorMessage((err as Error)?.message ?? "Failed to update order status"));
  }, [refreshAll]);

  const handleDelete = useCallback((orderId: string) => {
    setErrorMessage(null);
    deleteOrder(orderId)
      .then(refreshAll)
      .catch((err) => setErrorMessage((err as Error)?.message ?? "Failed to delete order"));
  }, [refreshAll]);

  const handleSaveEdit = useCallback(
    (orderId: string, items: OrderItemInput[], status: OrderStatus | undefined, tableNumber?: number, notes?: string) => {
      setErrorMessage(null);
      editOrder(orderId, items, tableNumber, notes, status)
        .then(refreshAll)
        .catch((err) => setErrorMessage((err as Error)?.message ?? "Failed to save order"));
    },
    [refreshAll],
  );

  // Load month stats when month/year changes
  useEffect(() => {
    let cancelled = false;
    setLoadingMonth(true);
    fetchMonthlyStatsAction(year, month).then((data) => {
      if (!cancelled) {
        setMonthStats(data);
        setLoadingMonth(false);
      }
    }).catch(() => {
      if (!cancelled) setLoadingMonth(false);
    });
    return () => { cancelled = true; };
  }, [month, year]);

  // Load yearly stats when year changes
  useEffect(() => {
    let cancelled = false;
    setLoadingYear(true);
    fetchYearlyStatsAction(year).then((data) => {
      if (!cancelled) {
        setYearRows(data);
        setLoadingYear(false);
      }
    }).catch(() => {
      if (!cancelled) setLoadingYear(false);
    });
    return () => { cancelled = true; };
  }, [year]);

  return (
    <div className="space-y-10">
      {/* Quick stats for today + all-time */}
      <div>
        <h3 className="mb-4 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Quick Overview
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
            <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">Today Orders</p>
            <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">{stats.todayOrders}</p>
          </div>
          <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
            <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">Today Revenue</p>
            <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">£{stats.todayRevenue.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
            <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">All-time Orders</p>
            <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">{stats.totalOrders}</p>
          </div>
          <div className="rounded-xl border border-brand-maroon/10 bg-white/80 px-4 py-3 shadow-sm shadow-brand-maroon/5">
            <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">All-time Revenue</p>
            <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold tabular-nums text-brand-maroon">£{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Error feedback */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Daily order browsing */}
      <div>
        <h3 className="mb-3 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Daily Orders
        </h3>
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevDay}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-maroon/15 text-brand-maroon transition hover:bg-brand-maroon/10"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-brand-maroon/15 bg-white/80 px-3 text-sm font-normal text-brand-maroon hover:bg-brand-maroon/5"
              >
                <CalendarDays className="h-3.5 w-3.5 text-stone-500" />
                {format(new Date(dayStart), "d MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="single"
                selected={new Date(dayStart)}
                onSelect={(date) => {
                  if (date) handleDateInput(format(date, "yyyy-MM-dd"));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <button
            type="button"
            onClick={handleNextDay}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-maroon/15 text-brand-maroon transition hover:bg-brand-maroon/10"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="h-8 rounded-md border border-brand-maroon/15 bg-white px-3 text-xs text-brand-maroon hover:bg-brand-maroon/5"
          >
            Today
          </button>
          <span className="text-xs text-stone-400">
            {dailyOrders.length} order{dailyOrders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loadingDay ? (
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-400">Loading…</p>
        ) : dailyOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-brand-cream px-6 py-8 text-center">
            <p className="text-sm text-stone-500">No orders for {formatDateISO(dayStart)}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyOrders.map((order) => (
              <DailyOrderCard
                key={order._id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onSaveEdit={handleSaveEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Month selector + stats */}
      <div>
        <h3 className="mb-3 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Monthly Stats
        </h3>
        <div className="mb-4 flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="h-8 rounded-md border border-brand-maroon/15 bg-white px-3 text-sm text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10) || currentYear())}
            className="h-8 w-20 rounded-md border border-brand-maroon/15 bg-white px-2 text-sm text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          />
        </div>
        {loadingMonth ? (
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-400">Loading…</p>
        ) : (
          <MonthStatsView stats={monthStats} year={year} month={month} />
        )}
      </div>

      {/* Yearly per-month breakdown */}
      <div>
        <h3 className="mb-3 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Yearly Breakdown
        </h3>
        <div className="mb-4 flex items-center gap-3">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10) || currentYear())}
            className="h-8 w-20 rounded-md border border-brand-maroon/15 bg-white px-2 text-sm text-brand-maroon focus-visible:border-brand-maroon focus-visible:ring-1 focus-visible:ring-brand-maroon/30 focus-visible:outline-none"
          />
        </div>
        {loadingYear ? (
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-400">Loading…</p>
        ) : (
          <YearBreakdownView rows={yearRows} year={year} />
        )}
      </div>

      {/* Best-selling items (all-time) */}
      {stats.itemsSold.length > 0 && (
        <div>
          <h3 className="mb-3 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
            All-time Best Sellers
          </h3>
          <div className="overflow-x-auto rounded-xl border border-brand-maroon/10 bg-white/80 shadow-sm shadow-brand-maroon/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-maroon/10 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone-500">
                  <th className="px-4 py-3 font-[family-name:var(--font-label)]">Item</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-label)]">Sold</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-label)]">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-maroon/5">
                {stats.itemsSold.map((item) => (
                  <tr key={item.menuItemName} className="text-brand-maroon">
                    <td className="px-4 py-2.5 font-[family-name:var(--font-serif)] font-bold">{item.menuItemName}</td>
                    <td className="px-4 py-2.5 tabular-nums">{item.quantity}</td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-serif)] font-bold tabular-nums">£{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
