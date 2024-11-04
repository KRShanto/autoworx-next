"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createInvoiceRedo = async (
  redoTechnicians: {
    invoiceId: string;
    serviceId: number;
    technicianId: number;
    notes: string;
  }[],
) => {
  try {
    await Promise.all(
      redoTechnicians.map(async (technicianInfo) => {
        await db.$transaction(async (prisma) => {
          await prisma.invoiceRedo.create({
            data: {
              invoiceId: technicianInfo.invoiceId,
              serviceId: technicianInfo.serviceId,
              technicianId: technicianInfo.technicianId,
              notes: technicianInfo.notes,
            },
          });
          await prisma.technician.update({
            where: {
              id: technicianInfo.technicianId,
            },
            data: {
              status: "In Progress",
            },
          });
        });
      }),
    );
    revalidatePath("/estimate/workorder");
    return {
      status: 200,
      data: null,
    };
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
