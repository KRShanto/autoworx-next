"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Get all coupons for the current company
 * @returns A list of coupons
 */
export async function getCoupons() {
  const companyId = await getCompanyId(); // Get the company ID
  const coupons = await db.coupon.findMany({
    where: {
      companyId,
    },
  });

  return coupons;
}
