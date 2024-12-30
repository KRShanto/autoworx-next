"use server";

import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { createVehicleValidationSchema } from "@/validations/schemas/vehicle/vehicle.validation";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { TErrorHandler } from "@/types/globalError";

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
}): Promise<ServerAction | TErrorHandler> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;
    await createVehicleValidationSchema.parseAsync(data);

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
    return errorHandler(error);
  }
}
