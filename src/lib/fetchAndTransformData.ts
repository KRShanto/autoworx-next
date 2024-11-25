import { db } from "@/lib/db";
import { InvoiceType } from "@prisma/client";

export async function fetchAndTransformData(
  type: InvoiceType,
  companyId: number,
  searchParams: { startDate?: string; endDate?: string; status?: string },
) {
  const { startDate, endDate, status } = searchParams;

  const data = await db.invoice.findMany({
    where: {
      type,
      companyId,
      createdAt: {
        gte: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
        lte: endDate ? new Date(`${endDate}T23:59:59.999`) : undefined,
      },
      columnId: status ? parseInt(status) : undefined,
    },
  });

  return await Promise.all(
    data.map(async (item) => {
      const vehicle = item.vehicleId
        ? await db.vehicle.findFirst({
            where: { id: item.vehicleId },
          })
        : null;
      const client = item.clientId
        ? await db.client.findFirst({
            where: { id: item.clientId },
          })
        : null;
      const status = item.columnId
        ? await db.column.findFirst({
            where: { id: item.columnId },
          })
        : null;

      return {
        id: item.id,
        clientName: client?.firstName + " " + client?.lastName || "",
        vehicle: vehicle?.model || "",
        email: client?.email || "",
        phone: client?.mobile || "",
        grandTotal: item.grandTotal as any,
        createdAt: item.createdAt,
        status: status?.title || "",
        textColor: status?.textColor || "",
        bgColor: status?.bgColor || "",
      };
    }),
  );
}
