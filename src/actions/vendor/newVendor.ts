"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Creates a new vendor in the database.
 *
 * @param {Object} params - The vendor details.
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
export async function newVendor({
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
  // Get the current authenticated session
  const session = (await auth()) as AuthSession;
  const companyId = session?.user?.companyId;

  // Create a new vendor in the database
  const newVendor = await db.vendor.create({
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
      companyId,
    },
  });

  // Revalidate the vendor inventory path to update the cache
  revalidatePath("/inventory/vendor");

  return {
    type: "success",
    data: newVendor,
  };
}
