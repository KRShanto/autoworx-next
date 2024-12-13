"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Adds a new vehicle color to the database.
 *
 * @param {string} name - The name of the new vehicle color.
 * @returns {Promise<ServerAction>} The server action containing the newly added vehicle color.
 */
export async function addVehicleColor(name: string): Promise<ServerAction> {
  // Get the company ID of the current user
  const companyId = await getCompanyId();

  // Create a new vehicle color in the database
  const newColor = await db.vehicleColor.create({
    data: {
      name,
      companyId,
    },
  });

  // Return the newly created color in a success response
  return {
    type: "success",
    data: newColor,
  };
}
