"use server";

import { db } from "@/lib/db";

type TPayload = {
  invoiceId: string;
};

export const createWorkOrder = async (payload: TPayload) => {
  try {
    const response = await db.workOrder.create({
      data: {
        invoiceId: payload.invoiceId,
      },
    });
    if (!response) {
      throw new Error("Failed to create Work Order");
    }
    return { type: "success", data: response };
  } catch (err) {
    throw err;
  }
};
