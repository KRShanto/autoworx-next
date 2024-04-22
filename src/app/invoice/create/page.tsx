import React from "react";
import InvoiceTo from "../InvoiceTo";
import Vehicle from "../Vehicle";
import ServiceSection from "../ServiceSection";
import Payment from "../Payment";
import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Invoice",
};

export default async function Page() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Get all the customers for the company
  const customers = await db.customer.findMany({
    where: {
      companyId,
    },
  });

  // Get all the vehicles for the company
  const vehicles = await db.vehicle.findMany({
    where: {
      companyId,
    },
  });

  // Get all the services for the company
  const services = await db.service.findMany({
    where: {
      companyId,
    },
  });

  // Get all the additional data for the company
  const additional = await db.invoiceAdditional.findFirst({
    where: {
      companyId,
    },
  });

  const { note, terms } = additional || {};

  return (
    <div className="app-shadow invoice-create flex h-[80vh] w-[77vw] gap-5 rounded-xl bg-white px-5 pb-5 pt-8 text-[#66738C]">
      <div className="h-full w-[25%]">
        <InvoiceTo customers={customers} user={session.user} />
        <Vehicle vehicles={vehicles} />
      </div>

      <div className="flex w-[75%] flex-col gap-2">
        <ServiceSection
          allServices={services}
          notes={note || ""}
          terms={terms || ""}
          user={session.user}
        />
        <Payment />
      </div>
    </div>
  );
}
