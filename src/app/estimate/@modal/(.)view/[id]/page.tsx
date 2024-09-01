import { InterceptedDialog } from "@/components/Dialog";
import { db } from "@/lib/db";

import { notFound } from "next/navigation";

import {
  Company,
  Invoice,
  InvoiceItem,
  InvoicePhoto,
  Labor,
  Material,
  Service,
  Status,
} from "@prisma/client";
import { User } from "next-auth";
import InvoiceComponent from "./InvoiceComponent";
import PDFComponent from "./PDFComponent";

export default async function ViewEstimate({
  params: { id },
}: {
  params: { id: string };
}) {
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      company: true,
      invoiceItems: {
        include: {
          service: true,
          materials: true,
          labor: true,
        },
      },
      photos: true,
      tasks: true,
      status: true,
      user: true,
    },
  });

  if (!invoice) notFound();

  const clientId = invoice.clientId
    ? await db.client.findUnique({
        where: { id: invoice.clientId },
      })
    : null;
  const vehicle = invoice.vehicleId
    ? await db.vehicle.findUnique({
        where: { id: invoice.vehicleId },
      })
    : null;

  return (
    <InterceptedDialog>
      {invoice && (
        <InvoiceComponent
          id={id}
          //@ts-ignore
          invoice={invoice}
          clientId={clientId}
          vehicle={vehicle}
        />
      )}
    </InterceptedDialog>
  );
}
