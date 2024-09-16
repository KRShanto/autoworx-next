"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function getWorkOrders() {
  const companyId = await getCompanyId();
  const invoices = await db.invoice.findMany({
    where: {
      companyId,
    },
    include: {
      client: true,
      vehicle: true,
      invoiceItems: {
        include: {
          service: {
            include: {
              Technician: true,
            },
          },
        },
      },
      tags: {
      
        select: {
          id:true,
          tag: true,
        },
      },
      tasks: true,
      assignedTo: true,
    },
  });

  return invoices;
}
 export const updateAssignedTo = async(invoiceId:string,userId:number)=>{
  try {
    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        assignedToId: userId, 
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating assignedTo:", error);
    throw new Error("Error updating assignedTo: " + error);
  }

 }