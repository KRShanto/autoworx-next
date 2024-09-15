"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function checkCouponCode({
  code,
  clientId,
}: {
  code: string;
  clientId: number;
}): Promise<ServerAction> {
  const couponCode = await db.coupon.findFirst({
    where: {
      code,
    },
  });

  if (!couponCode) {
    return {
      type: "error",
      message: "Coupon does not exist",
    };
  }

  if (couponCode.endDate < new Date()) {
    return {
      type: "error",
      message: "Coupon has expired",
    };
  }

  const clientCoupon = await db.clientCoupon.findFirst({
    where: {
      clientId,
      couponId: couponCode.id,
    },
  });

  if (clientCoupon) {
    return {
      type: "error",
      message: "Coupon has already been used",
    };
  }

  return { type: "success", data: couponCode };
}
