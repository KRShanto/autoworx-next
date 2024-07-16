"use server";
import { db } from "@/lib/db";

export const getTechnician = async (serviceId: number) => {
  console.log(serviceId);
  try {
    const technicians = await db.technician.findMany({
      where: {
        serviceId,
      },
    });
    return JSON.parse(JSON.stringify(technicians));
  } catch (err) {
    throw err;
  }
};
