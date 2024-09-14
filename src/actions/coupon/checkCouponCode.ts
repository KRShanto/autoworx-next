"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function checkCouponCode(
  couponCode: string,
): Promise<ServerAction> {
  const code = await db.coupon.findFirst({
    where: {
      code: couponCode,
    },
  });

  if (!code) {
    return {
      type: "error",
      message: "Coupon does not exist",
    };
  }

  if (code.endDate < new Date()) {
    return {
      type: "error",
      message: "Coupon has expired",
    };
  }

  return { type: "success", data: code };
}
