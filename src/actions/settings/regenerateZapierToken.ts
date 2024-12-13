"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import generateZapierToken from "@/lib/generateZapierToken";
import { revalidatePath } from "next/cache";

/**
 * Regenerates the Zapier token for the company and updates it in the database.
 * Revalidates the security settings path.
 * @returns {Promise<{type: string, data: any}>} - The result of the operation.
 */
export const regenerateZapierToken = async () => {
  try {
    // Get the company ID
    let companyId = await getCompanyId();

    // Update the company's Zapier token
    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        zapierToken: generateZapierToken(),
      },
    });

    // Revalidate the security settings path
    revalidatePath("/settings/security");

    return { type: "success", data: updatedCompany };
  } catch (err: any) {
    throw new Error(err);
  }
};
