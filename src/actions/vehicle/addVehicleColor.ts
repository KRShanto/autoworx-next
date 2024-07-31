"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function addVehicleColor(name: string): Promise<ServerAction> {
  const companyId = await getCompanyId();

  const newColor = await db.vehicleColor.create({
    data: {
      name,
      companyId,
    },
  });

  return {
    type: "success",
    data: newColor,
  };
}
