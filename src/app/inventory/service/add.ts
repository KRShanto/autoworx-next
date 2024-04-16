"use server";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const ServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  discount: z.number(),
  total: z.number(),
});

export async function addService(data: {
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}) {
  try {
    ServiceSchema.parse(data);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    await db.service.create({
      data: {
        ...data,
        companyId,
      },
    });

    revalidatePath("/inventory/service");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else {
      return {
        message: "Something went wrong",
        field: "server",
      };
    }
  }
}
