"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function getVehicleColors(): Promise<ServerAction> {
  const companyId = await getCompanyId();

  const colors = await db.vehicleColor.findMany({
    where: {
      companyId,
    },
  });

  return {
    type: "success",
    data: colors,
  };
}
