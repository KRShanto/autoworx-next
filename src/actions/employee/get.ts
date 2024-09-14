"use server";
import { auth } from "@/app/auth";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

// Get all the employees of a company
export async function getEmployees({ excludeCurrentUser = false }) {
  const companyId = await getCompanyId();
  const session = await auth();
  const employees = await db.user.findMany({
    where: {
      companyId,
      id: {
        not: excludeCurrentUser ? parseInt(session?.user?.id!) : undefined,
      },
    },
  });
  return employees;
}
