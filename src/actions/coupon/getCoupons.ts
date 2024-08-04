"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

export async function getCoupons() {
  const companyId = await getCompanyId();
  const coupons = await db.coupon.findMany({
    where: {
      companyId,
    },
  });

  return coupons;
}
