"use server";

/**
 * Updates the company information in the database.
 *
 * @param companyId - The ID of the company to be updated.
 * @param companyData - The new company data to be saved.
 * @returns An object containing the status and the updated company data.
 * @throws Will throw an error if the update operation fails.
 */

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type TCompanyData = {
  name: string;
  businessId: string | null;
  businessType: string | null;
  phone: string | null;
  email: string | null;
  industry: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  image?: string | null;
};

export const updateCompany = async (
  companyId: number | undefined,
  companyData: TCompanyData,
) => {
  const {
    name,
    businessId,
    businessType,
    phone,
    email,
    industry,
    website,
    address,
    city,
    state,
    zip,
    image,
  } = companyData;
  try {
    // Update the company information in the database
    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        name,
        businessId,
        businessType,
        phone,
        email,
        industry,
        website,
        address,
        city,
        state,
        zip,
        image,
      },
    });
    // Revalidate the cache for the business settings page
    revalidatePath("/settings/business");
    // Return success response with updated company data
    return { type: "success", data: updatedCompany };
  } catch (err: any) {
    // Throw an error if the update operation fails
    throw new Error(err);
  }
};
