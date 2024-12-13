"use server";
import { auth } from "@/app/auth";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Get all the employees of a company.
 *
 * @param excludeCurrentUser - Whether to exclude the current user from the result.
 * @returns A list of employees.
 */
export async function getEmployees({
  excludeCurrentUser = false,
}: {
  excludeCurrentUser?: boolean;
}) {
  // Get the company ID
  const companyId = await getCompanyId();

  // Get the current session
  const session = await auth();

  // Fetch employees from the database
  const employees = await db.user.findMany({
    where: {
      companyId,
      id: {
        not: excludeCurrentUser ? parseInt(session?.user?.id!) : undefined,
      },
      employeeType: {
        not: "Sales",
      },
    },
  });

  // Return the list of employees
  return employees;
}
