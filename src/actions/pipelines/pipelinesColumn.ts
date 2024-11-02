"use server";
import { auth } from "@/app/auth";
// import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { defaultColumnWithColor, defaultSalesColumn, defaultShopColumn } from "@/lib/defaultColumns";
import { AuthSession } from "@/types/auth";

// Insert default columns when creating a new company
const insertDefaultColumns = async (type: string) => {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  // Filter columns by type (sales or shop)
  const columnsForType = defaultColumnWithColor.filter((column) => column.type === type);

  // Add companyId to each column
  const columnsWithCompany = columnsForType.map((column) => ({
    ...column,
    companyId,
  }));

  await db.column.createMany({
    data: columnsWithCompany,
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
      textColor: textColor || null,
      bgColor: bgColor || null,
    },
  });
};

export const updateColumn = async (
  id: number,
  title: string,
  type: string,
  order: number,
  textColor?: string,
  bgColor?: string,
) => {
  return await db.column.update({
    where: { id },
    data: { title, type, order, textColor, bgColor },
  });
};

// Delete a column
export const deleteColumn = async (id: number) => {
  return await db.column.delete({
    where: { id },
  });
};

// Update the order of multiple columns
export const updateColumnOrder = async (
  reorderedColumns: { id: number; order: number }[],
) => {
  const updatePromises = reorderedColumns.map(({ id, order }) =>
    db.column.update({
      where: { id },
      data: { order }, // Update each column's order
    }),
  );

  // Wait for all updates to complete
  await Promise.all(updatePromises);
};
