"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Edits an existing vehicle's details.
 *
 * @param {Object} data - The vehicle data to update.
 * @returns {Promise<ServerAction>} The server action containing the updated vehicle data.
 */
export async function editVehicle(data: {
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
  vehicleId: number;
  clientId: number;
}): Promise<ServerAction> {
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Prepare update data
    const updateData: any = {
      year: data.year,
      make: data.make,
      model: data.model,
      submodel: data.submodel,
      type: data.type,
      transmission: data.transmission,
      engineSize: data.engineSize,
      license: data.license,
      vin: data.vin,
      notes: data.notes,
    };

    // Handle color relation update
    if (data.colorId) {
      updateData.color = {
        connect: { id: data.colorId }, // Connect the vehicle to a color using colorId
      };
    }

    // Update vehicle in the database
    const vehicle = await db.vehicle.update({
      where: {
        id: data.vehicleId,
      },
      data: updateData,
    });

    // Revalidate the client path to reflect changes
    revalidatePath("/client");

    // Return the updated vehicle data in a success response
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
