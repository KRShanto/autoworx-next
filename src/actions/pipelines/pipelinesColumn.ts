"use server";
import { db } from "@/lib/db";
import { defaultSalesColumn, defaultShopColumn } from "@/lib/defaultColumns";

const insertDefaultColumns = async (type: string) => {
  const defaultColumns =
    type === "sales" ? defaultSalesColumn : defaultShopColumn;

  await db.column.createMany({
    data: defaultColumns,
    skipDuplicates: true,
  });
};

// fetch all columns by type
export const getColumnsByType = async (type: string) => {
  let columns = await db.column.findMany({
    where: { type },
  });

  if (columns.length === 0) {
    await insertDefaultColumns(type);

    columns = await db.column.findMany({
      where: {
        type,
      },
    });
  }

  return columns;
};

// Create a new column with type
export const createColumn = async (title: string, type: string) => {
  return await db.column.create({
    data: {
      title,
      type,
    },
  });
};

export const updateColumn = async (id: number, title: string, type: string) => {
  return await db.column.update({
    where: { id },
    data: { title, type },
  });
};

export const deleteColumn = async (id: number) => {
  return await db.column.delete({
    where: { id },
  });
};
