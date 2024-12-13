"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Fetches all users associated with the current company.
 * @returns An array of user objects.
 */
export const getCompanyUser = async () => {
  const companyId = await getCompanyId(); // Get the current company ID
  try {
    // Query the database to find all users associated with the company ID
    const user = await db.user.findMany({
      where: { companyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        companyId: true,
        employeeType: true,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
