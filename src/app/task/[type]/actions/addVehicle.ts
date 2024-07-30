"use server";

import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function addVehicle(data: {
  year: number;
  make: string;
  model: string;
  submodel: string;
  type: string;
  colorId?: number;
  transmission: string;
  engineSize: string;
  license: string;
  vin: string;
  notes: string;
  customerId: number;
}): Promise<ServerAction> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Add vehicle to the database
    const vehicle = await db.vehicle.create({
      data: {
        ...data,
        companyId,
      },
    });

    revalidatePath("/client");

    return {
      type: "success",
      data: vehicle,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors[0].message,
        field: error.errors[0].path[0] as string,
      };
    } else if (error.code === "P2002") {
      return {
        type: "error",
        message: "Vehicle already exists",
        field: "vin",
      };
    } else {
      return {
        type: "error",
        message: error.message,
        field: "all",
      };
    }
  }
}
