"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { Invoice } from "@prisma/client";

/**
 * Creates a draft estimate for a client.
 *
 * @param {Object} params - The parameters for creating a draft estimate.
 * @param {string} params.id - The ID of the estimate.
 * @param {number} params.clientId - The ID of the client.
 * @param {number} [params.vehicleId] - The ID of the vehicle (optional).
 * @returns {Object} The result of the operation.
 */
export async function createDraftEstimate({
  id,
  clientId,
  vehicleId,
}: {
  id: string;
  clientId: number;
  vehicleId?: number;
}) {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  let estimate: Invoice;

  // Check if a draft estimate already exists
  const draftEstimate = await db.invoice.findFirst({
    where: {
      id,
    },
  });

  if (!draftEstimate) {
    // Create a new draft estimate if it doesn't exist
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
    // Use the existing draft estimate
    estimate = draftEstimate;
  }

  return {
    type: "success",
    data: estimate,
  };
}
