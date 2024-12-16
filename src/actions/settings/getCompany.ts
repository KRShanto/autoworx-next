"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Retrieves the company details for the current user.
 * @returns {Promise<any>} - The company details.
 */
export async function getCompany() {
  const companyId = await getCompanyId();

  // Fetch the company details
  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });
  return JSON.parse(JSON.stringify(company));
}
