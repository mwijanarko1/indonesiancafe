"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { revalidatePath } from "next/cache";

async function getAdminToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) throw new Error("Not authenticated");
  return token;
}

function revalidateAdmin(): void {
  revalidatePath("/admin");
}

export type OrderItemInput = {
  menuItemName: string;
  priceAtOrder: number;
  quantity: number;
  notes?: string;
};

export type OrderStatus = "pending" | "completed" | "cancelled";

/**
 * Place a new order from the staff dashboard.
 * Returns the new order ID on success.
 */
export async function placeStaffOrder(
  items: OrderItemInput[],
  tableNumber?: number,
  notes?: string,
): Promise<string> {
  const token = await getAdminToken();

  const orderId = await fetchMutation(
    api.orders.placeOrder,
    { items, tableNumber, notes },
    { token },
  );

  revalidateAdmin();

  return orderId;
}

/**
 * Update the status of an order (e.g. pending → completed).
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const token = await getAdminToken();

  await fetchMutation(
    api.orders.updateOrderStatus,
    { orderId: orderId as any, status },
    { token },
  );

  revalidateAdmin();
}

/**
 * Delete an order and its line items (for mistake correction).
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const token = await getAdminToken();

  await fetchMutation(
    api.orders.deleteOrder,
    { orderId: orderId as any },
    { token },
  );

  revalidateAdmin();
}

/**
 * Edit an existing order: replace items, update table/notes/status, recalculate total server-side.
 */
export async function editOrder(
  orderId: string,
  items: OrderItemInput[],
  tableNumber?: number,
  notes?: string,
  status?: OrderStatus,
): Promise<void> {
  const token = await getAdminToken();

  // Only include optional fields when explicitly provided so the server preserves existing values
  const mutationArgs: Record<string, unknown> = {
    orderId,
    items,
  };
  // tableNumber 0 or positive: include. undefined: omit to preserve server-side
  if (tableNumber !== undefined) mutationArgs.tableNumber = tableNumber;
  if (notes !== undefined) mutationArgs.notes = notes;
  if (status !== undefined) mutationArgs.status = status;

  await fetchMutation(
    api.orders.editOrder,
    mutationArgs as any,
    { token },
  );

  revalidateAdmin();
};

