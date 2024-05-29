import { DialogContent, InterceptedDialog } from "@/components/Dialog";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceItems } from "./InvoiceItems";

export default async function CreateWorkOrder({
  params: { id1 },
}: {
  params: { id1: string };
}) {
  const invoice = await db.invoice.findUnique({
    where: { id: id1 },
    include: {
      company: true,
      invoiceItems: {
        include: {
          service: true,
          material: true,
          labor: true,
        },
      },
      photos: true,
      tasks: true,
      status: true,
    },
  });

  if (!invoice) notFound();

  return (
    <InterceptedDialog>
      <DialogContent className="max-w-[740px]">
        {/**
         * Logo, Contact Information
         */}
        <div className="flex items-center justify-between">
          <div className="flex aspect-square w-32 items-center justify-center bg-slate-500 text-center font-bold text-white">
            Logo
          </div>
          <div className="text-right text-xs">
            <h2 className="font-bold">Contact Information:</h2>
            <p>Full Address</p>
            <p>Mobile Number</p>
            <p>Email</p>
          </div>
        </div>

        <hr />

        {/**
         * Information
         */}
        <div className="flex">
          <div className="grid grow grid-cols-3 gap-4 text-xs">
            <h1 className="col-span-full text-3xl font-bold uppercase text-slate-500">
              Work Order
            </h1>
            <div>
              <h2 className="font-bold text-slate-500">Estimate To:</h2>
              <p>Client Name</p>
              <p>Mobile Number</p>
              <p>Email</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-500">Vehicle Details:</h2>
              <p>Year</p>
              <p>Make</p>
              <p>Model</p>
              <p>Sub Model</p>
              <p>Type</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-500">Estimate Details:</h2>
              <p>Estimate Number</p>
              <p>Date</p>
              <p>Bill Status</p>
              <p>Order Status</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <InvoiceItems
            items={JSON.parse(JSON.stringify(invoice.invoiceItems))}
          />
        </div>

        {/**
         * Submit
         */}
        <div className="flex">
          <button className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white">
            Save Work Order
          </button>
        </div>
        <div>
          <p className="font-bold text-slate-500">{invoice.company.name}</p>
          <p>Employee Name</p>
        </div>
      </DialogContent>
    </InterceptedDialog>
  );
}
