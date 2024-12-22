"use server";
import { db } from "@/lib/db";
import { Technician } from "@prisma/client";

/**
 * Get a list of technicians based on the provided invoiceId and/or serviceId.
 *
 * @param params - An object containing the invoiceId and/or serviceId to filter technicians.
 * @returns A promise that resolves to a list of technicians with their names.
 */
export const getTechnicians = async ({
  invoiceId,
  invoiceItemId,
}: {
  invoiceId?: string;
  invoiceItemId?: number;
}) => {
  try {
    // Fetch technicians from the database based on the provided invoiceId and/or serviceId
    const technicians = (await db.technician.findMany({
      where: {
        invoiceId,
        invoiceItemId,
      },
    })) as (Technician & { name: string })[];

    // Fetch users associated with the technicians
    const users = await db.user.findMany({
      where: {
        id: {
          in: technicians.map((technician) => technician.userId),
        },
      },
    });

    // Merge user information with technicians to include their names
    technicians.forEach((technician) => {
      const user = users.find((user) => user.id === technician.userId);
      technician.name = `${user?.firstName || "Unknown"} ${user?.lastName || ""}`;
    });

    // Return the list of technicians with their names
    return JSON.parse(JSON.stringify(technicians));
  } catch (err) {
    throw err;
  }
};
