"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export async function deleteVehicle(
  vehicleId: number,
  clientId: number,
): Promise<ServerAction> {
  try {
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

    revalidatePath("/client");

    return {
      type: "success",
      message: "Vehicle deleted successfully.",
    };
  } catch (error: any) {
    return {
      type: "error",
      message: error.message || "An error occurred while deleting the vehicle.",
    };
  }
}
