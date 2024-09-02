"use server"
import { db } from "@/lib/db";

// fetch all columns by type
export const getColumnsByType = async (type: string) => {
  return await db.column.findMany({
    where: { type },
  });
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

