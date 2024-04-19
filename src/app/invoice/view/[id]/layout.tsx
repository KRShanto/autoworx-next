import React from "react";
import Header from "./Header";
import Invoice from "./Invoice";
import WorkOrder from "./WorkOrder";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;
  const invoice = await db.invoice.findUnique({
    where: { invoiceId: id },
  });

  if (!invoice) notFound();

  const customer = await db.customer.findUnique({
    where: { id: invoice.customerId },
  });

  const vehicle = await db.vehicle.findUnique({
    where: { id: invoice.vehicleId },
  });

  const setting = await db.setting.findFirst();

  const serviceIds = invoice.serviceIds as number[];

  const services = await Promise.all(
    serviceIds.map(async (id) => {
      const service = await db.service.findUnique({ where: { id } });
      return service!;
    }),
  );

  const workOrders = await db.workOrder.findMany({
    where: { invoiceId: invoice.id },
  });

  const employees = await db.user.findMany({
    where: { role: "employee", companyId: invoice.companyId },
    select: {
      id: true,
      name: true,
      workOrderId: true,
    },
  });

  return (
    <div>
      {children}

      <div>
        <Header invoice={invoice} />

        <div className="flex flex-row gap-7 max-[1500px]:flex-col max-[1500px]:items-center max-[1500px]:gap-0">
          <Invoice
            invoice={invoice}
            customer={customer!}
            setting={setting!}
            vehicle={vehicle!}
            services={services}
          />

          <WorkOrder
            workOrders={workOrders}
            invoice={invoice}
            customer={customer!}
          />
        </div>
      </div>
    </div>
  );
}
