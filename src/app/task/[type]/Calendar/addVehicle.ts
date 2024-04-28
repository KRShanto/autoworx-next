"use server";

import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function addVehicle(data: {
  make: string;
  model: string;
  year: number;
  submodel: string;
  type: string;
}) {
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

    return vehicle;
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
