// pages/estimate/page.tsx

import { AuthSession } from "@/types/auth";
import { InvoiceType } from "@prisma/client";
import Header from "./Header";
import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { db } from "@/lib/db";
import NavigationTabs from "./NavigationTabs";
import Table from "./Table";
import Title from "@/components/Title";

async function fetchAndTransformData(
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
        vehicle: vehicle
          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
          : "",
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

export default async function EstimatesPage({
  searchParams,
}: Readonly<{
  searchParams: { startDate?: string; endDate?: string; status?: string };
}>) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const estimates = await fetchAndTransformData(
    InvoiceType.Estimate,
    companyId,
    searchParams,
  );

  const categories = await db.category.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const statuses = await db.column.findMany({ where: { companyId } });

  return (
    <div>
      <Title>Estimates</Title>

      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      {/* Use the NavigationTabs component with the 'a-estimate' tab as active */}
      <NavigationTabs activeTab="a-estimate">
        <Table data={estimates} />
      </NavigationTabs>
    </div>
  );
}
