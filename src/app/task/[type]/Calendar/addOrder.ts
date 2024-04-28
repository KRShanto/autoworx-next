"use server";

import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const OrderSchema = z.object({
  name: z.string(),
});

export async function addOrder(data: { name: string; comment: string }) {
  try {
    OrderSchema.parse(data);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    const newOrder = await db.order.create({
      data: {
        ...data,
        companyId,
      },
    });

    return newOrder;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else {
      return {
        message: error.message,
      };
    }
  }
}
