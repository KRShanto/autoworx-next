"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Edits an existing vendor in the database.
 *
 * @param {Object} params - The vendor details.
 * @param {number} params.id - The ID of the vendor.
 * @param {string} params.name - The name of the vendor.
 * @param {string} [params.email] - The email of the vendor.
 * @param {string} [params.phone] - The phone number of the vendor.
 * @param {string} [params.address] - The address of the vendor.
 * @param {string} [params.city] - The city of the vendor.
 * @param {string} [params.state] - The state of the vendor.
 * @param {string} [params.zip] - The zip code of the vendor.
 * @param {string} [params.company] - The company name of the vendor.
 * @param {string} [params.website] - The website of the vendor.
 * @param {string} [params.notes] - Additional notes about the vendor.
 * @returns {Promise<ServerAction>} The result of the server action.
 */
export async function editVendor({
  id,
  name,
  email,
  phone,
  address,
  city,
  state,
  zip,
  company,
  website,
  notes,
}: {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  company?: string;
  website?: string;
  notes?: string;
}): Promise<ServerAction> {
  // Update the vendor in the database
  const updatedVendor = await db.vendor.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      companyName: company,
      website,
      notes,
    },
  });

  // Revalidate the vendor inventory path to update the cache
  revalidatePath("/inventory/vendor");

  return {
    type: "success",
    data: updatedVendor,
  };
}
