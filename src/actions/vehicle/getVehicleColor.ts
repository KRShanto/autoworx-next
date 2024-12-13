"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Fetches the list of vehicle colors for the current company.
 *
 * @returns {Promise<ServerAction>} The server action containing the list of vehicle colors.
 */
export async function getVehicleColors(): Promise<ServerAction> {
  // Get the company ID of the current user
  const companyId = await getCompanyId();

  // Fetch the vehicle colors from the database for the given company ID
  const colors = await db.vehicleColor.findMany({
    where: {
      companyId,
    },
  });

  // Return the fetched colors in a success response
  return {
    type: "success",
    data: colors,
  };
}
