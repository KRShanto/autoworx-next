"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Searches for companies based on the provided search term, excluding the current company.
 * @param searchTerm - The term to search for in company names, websites, or phone numbers.
 * @returns An object containing the success status and the list of companies.
 */
export const searchCompanyQuery = async (searchTerm: string) => {
  // Get the current company ID
  const companyId = await getCompanyId();

  try {
    // Fetch companies from the database that match the search term and exclude the current company
    const companies = await db.company.findMany({
      where: {
        NOT: [{ id: companyId }],
        OR: [
          { name: { contains: searchTerm } },
          { website: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
        ],
      },
      select: {
        id: true,
        name: true,
        users: {
          where: { role: "admin" },
          select: {
            firstName: true,
            lastName: true,
            companyId: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    // Return the list of companies
    return {
      success: true,
      data: companies,
    };
  } catch (err: any) {
    // Handle any errors that occur during the process
    throw new Error(err);
  }
};
