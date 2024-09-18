"use server";
import { db } from "@/lib/db";

export default async function getAllUserOfCompany(companyId: number) {
  // Get all the users for the company
  const companyUsers = await db.user.findMany({
    where: {
      companyId,
    },
  });
  return companyUsers;
}
