"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Fetch all leads for the authenticated user's company.
 * @returns A list of leads.
 */
export async function getLeads() {
  const companyId = await getCompanyId();
  try {
    const leadsData = await db.lead.findMany({
      where: {
        companyId,
      },
    });
    return leadsData;
  } catch (error) {
    console.error("Error fetching leads for sales pipeline:", error);
    throw error;
  }
}
