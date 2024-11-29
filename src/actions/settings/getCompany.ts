"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

export async function getCompany() {
  const companyId = await getCompanyId();
  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });
  return company;
}
