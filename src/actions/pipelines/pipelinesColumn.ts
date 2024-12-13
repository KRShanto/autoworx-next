"use server";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

/**
 * Fetch all columns by type for the authenticated user's company.
 * @param type - The type of columns to fetch.
 * @returns A list of columns.
 */
export const getColumnsByType = async (type: string) => {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  let columns = await db.column.findMany({
    where: { type, companyId: companyId },
    orderBy: { order: "asc" },
  });

  return columns;
};

/**
 * Create a new column for the authenticated user's company.
 * @param title - The title of the column.
 * @param type - The type of the column.
 * @param textColor - Optional text color for the column.
 * @param bgColor - Optional background color for the column.
 * @returns The created column.
 */
export const createColumn = async (
  title: string,
  type: string,
  textColor?: string,
  bgColor?: string,
) => {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const maxOrder = await db.column.findFirst({
    where: { type },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = maxOrder ? maxOrder.order + 1 : 0;

  return await db.column.create({
    data: {
      title,
      type,
      order: newOrder,
      companyId,
      textColor: textColor ?? undefined,
      bgColor: bgColor ?? undefined,
    },
  });
};

/**
 * Update an existing column.
 * @param id - The ID of the column to update.
 * @param title - The new title of the column.
 * @param type - The new type of the column.
 * @param order - The new order of the column.
 * @param textColor - Optional new text color for the column.
 * @param bgColor - Optional new background color for the column.
 */
export const updateColumn = async (
  id: number,
  title: string,
  type: string,
  order: number,
  textColor?: string,
  bgColor?: string,
) => {
  await db.column.update({
    where: { id },
    data: { title, type, order, textColor, bgColor },
  });
  revalidatePath("/pipeline/shop");
};

/**
 * Delete a column by its ID.
 * @param id - The ID of the column to delete.
 * @returns The deleted column.
 */
export const deleteColumn = async (id: number) => {
  // Update the invoice which column is deleted
  await db.invoice.updateMany({
    where: { columnId: id },
    data: {
      columnId: null,
    },
  });

  return await db.column.delete({
    where: { id },
  });
};
revalidatePath("/estimate");

/**
 * Update the order of multiple columns.
 * @param reorderedColumns - An array of objects containing column IDs and their new orders.
 */
export const updateColumnOrder = async (
  reorderedColumns: { id: number; order: number }[],
) => {
  const updatePromises = reorderedColumns.map(({ id, order }) =>
    db.column.update({
      where: { id },
      data: { order },
    }),
  );

  await Promise.all(updatePromises);
};
