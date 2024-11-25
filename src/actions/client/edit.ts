"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ServerAction } from "@/types/action";

export async function editClient(data: {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customerCompany?: string;
  tagId?: number;
  photo?: string;
  sourceId?: number;
}): Promise<ServerAction> {
  await db.client.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
      photo: data.photo ? data.photo : undefined,
    },
  });

  revalidatePath("/client");

  return { type: "success" };
}
