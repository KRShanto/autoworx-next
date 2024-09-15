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
          tag: true,
        },
      },
      tasks: true,
      assignedTo: true,
    },
  });

  return invoices;
}
