"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { Invoice } from "@prisma/client";

export async function createDraftEstimate({
  id,
  clientId,
  vehicleId,
}: {
  id: string;
  clientId: number;
  vehicleId?: number;
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  let estimate: Invoice;

  const draftEstimate = await db.invoice.findFirst({
    where: {
      id,
    },
  });

  if (!draftEstimate) {
    if (vehicleId) {
      estimate = await db.invoice.create({
        data: {
          id,
          type: "Estimate",
          clientId,
          vehicleId,
          userId: session.user.id as any,
          companyId,
        },
      });
    } else {
      estimate = await db.invoice.create({
        data: {
          id,
          type: "Estimate",
          clientId,
          userId: session.user.id as any,
          companyId,
        },
      });
    }
  } else {
    estimate = draftEstimate;
  }

  return {
    type: "success",
    data: estimate,
  };
}
