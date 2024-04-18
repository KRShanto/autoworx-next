"use server";

import { AuthSession } from "@/types/auth";
import { auth } from "../auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const VehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number(),
  vin: z.string(),
  license: z.string(),
});

export async function newVehicle(data: {
  make: string;
  model: string;
  year: number;
  vin: string;
  license: string;
}) {
  try {
    VehicleSchema.parse(data);

    const session = (await auth()) as AuthSession;

    const companyId = session.user.companyId;

    // Add vehicle to the database
    await db.vehicle.create({
      data: {
        ...data,
        companyId,
      },
    });

    revalidatePath("/invoice");

    return true;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else if (error.code === "P2002") {
      return {
        message: "Vehicle already exists",
        field: "vin",
      };
    } else {
      return {
        message: error.message,
      };
    }
  }
}
