"use server";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { defaultColumnWithColor } from "@/lib/defaultColumns";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

const insertDefaultColumns = async (type: string) => {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const columnsForType = defaultColumnWithColor.filter(
    (column) => column.type === type,
  );

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
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  let columns = await db.column.findMany({
    where: { type, companyId: companyId },
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
      data: { order },
    }),
  );

  await Promise.all(updatePromises);
};
