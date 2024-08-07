"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
// Get all the employees of a company

export async function getEmployees() {
  const companyId = await getCompanyId();
  const employees = await db.user.findMany({
    where: {
      companyId,
    },
  });
  return employees;
}
