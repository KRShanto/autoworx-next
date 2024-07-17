"use server";
import { db } from "@/lib/db";

export const getTechnician = async (
  serviceId: number,
  materialId: number,
  workOrderId: number,
) => {
  try {
    const technicians = await db.technician.findMany({
      where: {
        serviceId,
        materialId,
        workOrderId,
      },
    });
    return JSON.parse(JSON.stringify(technicians));
  } catch (err) {
    throw err;
  }
};
