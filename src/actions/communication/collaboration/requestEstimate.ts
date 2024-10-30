"use server";

import { db } from "@/lib/db";
import { Invoice, InvoiceType } from "@prisma/client";

type TEstimateData = {
  vehicleName: string;
  model: string;
  year: number;
  make: string;
  serviceRequest: string;
  dueDate: string;
  notes: string;
  photoPaths: string[];
  userId: number;
  companyId: number;
};

export const requestEstimate = async (estimateData: TEstimateData) => {
  try {
    const vehicleInfo = {
      model: estimateData.model,
      make: estimateData.make,
      year: estimateData.year,
      companyId: estimateData.companyId,
    };
    await db.$transaction(async () => {
      const vehicle = await db.vehicle.create({
        data: vehicleInfo,
      });
      const estimateInfo = {
        vehicleId: vehicle.id,
        userId: estimateData.userId,
        companyId: estimateData.companyId,
        internalNotes: estimateData.notes,
        type: InvoiceType.Estimate,
      };
        const estimate = await db.invoice.create({ data: estimateInfo });
        
    });

    console.log(estimateData);
  } catch (err) {
    throw new Error("Failed to request estimate");
  }
};
