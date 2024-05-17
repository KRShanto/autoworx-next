"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";

export async function newMaterial({
  name,
  categoryId,
  vendorId,
  tags,
  notes,
  quantity,
  cost,
  sell,
  discount,
  addToInventory,
}: {
  name: string;
  categoryId?: number;
  vendorId?: number;
  tags?: string;
  notes?: string;
  quantity?: number;
  cost?: number;
  sell?: number;
  discount?: number;
  addToInventory?: boolean;
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newMaterial = await db.material.create({
    data: {
      name,
      categoryId,
      vendorId,
      tags,
      notes,
      quantity,
      cost,
      sell,
      discount,
      addToInventory,
      companyId,
    },
  });

  return {
    type: "success",
    data: newMaterial,
  };
}
