"use server";
import { db } from "@/lib/db";
import { defaultSalesColumn, defaultShopColumn } from "@/lib/defaultColumns";

// Insert default columns when creating a new company
const insertDefaultColumns = async (type: string) => {
  const defaultColumns = type === "sales" ? defaultSalesColumn : defaultShopColumn;


  await db.column.createMany({
    data: defaultColumns,
    skipDuplicates: true,
  });
};

// Fetch all columns by type
export const getColumnsByType = async (type: string) => {
  let columns = await db.column.findMany({
    where: { type },
    orderBy: { order: "asc" },
  });

  // If no columns exist, insert default columns and fetch them again
  if (columns.length === 0) {
    await insertDefaultColumns(type);
    columns = await db.column.findMany({
      where: { type },
      orderBy: { order: "asc" }, 
    });
  }

  return columns;
};

// Create a new column with type and automatically set the correct order
export const createColumn = async (title: string, type: string) => {
  // Find the maximum order value for the existing columns of the same type
  const maxOrder = await db.column.findFirst({
    where: { type },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  // Set the new column's order to be one greater than the max order, or 0 if no columns exist
  const newOrder = maxOrder ? maxOrder.order + 1 : 0;

  // Create the new column with the calculated order
  return await db.column.create({
    data: {
      title,
      type,
      order: newOrder,
    },
  });
};

// Update column (now includes `order`)
export const updateColumn = async (id: number, title: string, type: string, order: number) => {
  return await db.column.update({
    where: { id },
    data: { title, type, order },
  });
};

// Delete a column
export const deleteColumn = async (id: number) => {
  return await db.column.delete({
    where: { id },
  });
};

// Update the order of multiple columns
export const updateColumnOrder = async (reorderedColumns: { id: number; order: number }[]) => {
  const updatePromises = reorderedColumns.map(({ id, order }) =>
    db.column.update({
      where: { id },
      data: { order },  // Update each column's order
    })
  );
  
  // Wait for all updates to complete
  await Promise.all(updatePromises);
};
