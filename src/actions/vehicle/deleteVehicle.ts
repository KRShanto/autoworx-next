"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

/**
 * Deletes a vehicle from the database.
 *
 * @param {number} vehicleId - The ID of the vehicle to delete.
 * @param {number} clientId - The ID of the client who owns the vehicle.
 * @returns {Promise<ServerAction>} The server action indicating the result of the deletion.
 */
export async function deleteVehicle(
  vehicleId: number,
  clientId: number,
): Promise<ServerAction> {
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Delete vehicle from the database
    const vehicle = await db.vehicle.deleteMany({
      where: {
        id: vehicleId,
        companyId,
        clientId,
      },
    });

    // If no vehicle is deleted, return an error message
    if (vehicle.count === 0) {
      return {
        type: "error",
        message: "Vehicle not found or you don't have permission to delete it.",
      };
    }

    // Revalidate the client path to reflect changes
    revalidatePath("/client");

    // Return a success message
    return {
      type: "success",
      message: "Vehicle deleted successfully.",
    };
  } catch (error: any) {
    // Handle errors
    return {
      type: "error",
      message: error.message || "An error occurred while deleting the vehicle.",
    };
  }
}
