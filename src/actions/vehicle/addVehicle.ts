"use server";

import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Adds a new vehicle to the database.
 *
 * @param {Object} data - The vehicle data to add.
 * @returns {Promise<ServerAction>} The server action containing the newly added vehicle data.
 */
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
  clientId: number;
}): Promise<ServerAction> {
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Add vehicle to the database
    const vehicle = await db.vehicle.create({
      data: {
        ...data,
        companyId,
      },
    });

    // Revalidate the client path to reflect changes
    revalidatePath("/client");

    // Return the newly added vehicle data in a success response
    return {
      type: "success",
      data: vehicle,
    };
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors[0].message,
        field: error.errors[0].path[0] as string,
      };
    } else if (error.code === "P2002") {
      // Handle unique constraint errors
      return {
        type: "error",
        message: "Vehicle already exists",
        field: "vin",
      };
    } else {
      // Handle other errors
      return {
        type: "error",
        message: error.message,
        field: "all",
      };
    }
  }
}
