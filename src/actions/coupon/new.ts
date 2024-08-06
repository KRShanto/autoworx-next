"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface NewCouponData {
  couponName: string;
  couponCode: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  couponType: string;
}

export async function newCoupon(data: NewCouponData) {
  const companyId = await getCompanyId();

  const newCoupon = await db.coupon.create({
    data: {
      companyId,
      name: data.couponName,
      code: data.couponCode,
      discountType: data.discountType === "$" ? "Fixed" : "Percentage",
      discount: data.discountValue,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.couponType,
      redemptions: 0,
      status: "Active",
    },
  });

  revalidatePath("/payments");

  return {
    type: "success",
    data: newCoupon,
  };
}
