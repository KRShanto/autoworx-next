"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
