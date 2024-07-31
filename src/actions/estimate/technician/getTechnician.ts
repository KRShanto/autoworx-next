"use server";
import { db } from "@/lib/db";
import { Technician } from "@prisma/client";

export const getTechnician = async (
  serviceId: number,
  materialId: number,
  workOrderId: number,
) => {
  try {
    const technicians = (await db.technician.findMany({
      where: {
        serviceId,
        materialId,
        workOrderId,
      },
    })) as (Technician & { name: string })[];

    // find the users and merge them with the technicians
    const users = await db.user.findMany({
      where: {
        id: {
          in: technicians.map((technician) => technician.userId),
        },
      },
    });

    technicians.forEach((technician) => {
      const user = users.find((user) => user.id === technician.userId);
      technician.name = user?.name || "Unknown";
    });

    return JSON.parse(JSON.stringify(technicians));
  } catch (err) {
    throw err;
  }
};
