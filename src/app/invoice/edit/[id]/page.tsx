import React from "react";
import InvoiceTo from "../../components/InvoiceTo";
import Vehicle from "../../components/Vehicle";
import ServiceSection from "../../components/ServiceSection";
import Payment from "../../components/Payment";
import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import InsertDefaultInvoiceData from "../../components/InsertDefaultInvoiceData";
import { Service } from "@prisma/client";

export const metadata: Metadata = {
  title: "Create Invoice",
};

export default async function Page({ params }: { params: { id: number } }) {
  const id = params.id;

  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Get the invoice
  const invoice = await db.invoice.findUnique({
    where: {
      invoiceId: id.toLocaleString(),
    },
  });

  if (!invoice) return notFound();

  const invoiceCustomer = await db.customer.findFirst({
    where: {
      id: invoice.customerId,
    },
  });

  const invoiceVehicle = await db.vehicle.findFirst({
    where: {
      id: invoice.vehicleId,
    },
  });

  const invoiceServices = await Promise.all(
    (invoice.serviceIds as number[]).map(async (serviceId) => {
      return await db.service.findFirst({
        where: {
          id: serviceId,
        },
      });
    }),
  );

  const invoiceTags = invoice.tags.split(",");

  const invoicePayments = await db.payment.findMany({
    where: {
      invoiceId: invoice.id,
    },
  });

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
      <InsertDefaultInvoiceData
        invoice={invoice}
        invoiceCustomer={invoiceCustomer!}
        invoiceVehicle={invoiceVehicle!}
        // @ts-ignore
        invoiceServices={invoiceServices}
        invoiceTags={invoiceTags}
        invoicePayments={invoicePayments}
      />

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
