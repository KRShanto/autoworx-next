import { DialogContent, InterceptedDialog } from "@/components/Dialog";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceItems } from "./InvoiceItems";

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
      <DialogContent className="max-h-full max-w-3xl overflow-y-auto">
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
              Estimate
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
          <div className="space-y-1 text-sm">
            {(
              [
                ["subtotal", invoice.subtotal],
                ["discount", invoice.discount],
                ["tax", invoice.tax],
                ["grand total", invoice.grandTotal],
                ["deposit", invoice.deposit],
                ["due", invoice.due],
              ] as const
            ).map(([key, value]) => (
              <div
                key={key}
                className="flex rounded border border-solid border-[#6571FF]"
              >
                <span className="shrink-0 grow px-2 font-bold uppercase text-[#6571FF]">
                  {key}
                </span>
                <div className="shrink-0 basis-20 rounded bg-[#6571FF] px-2 text-white">
                  ${value?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <InvoiceItems
            items={JSON.parse(JSON.stringify(invoice.invoiceItems))}
          />
        </div>

        {/**
         * Terms, Policies
         */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <section>
            <h2 className="font-bold">Terms & Conditions:</h2>
            <p>{invoice.terms}</p>
          </section>
          <section>
            <h2 className="font-bold">Policy & Conditions:</h2>
            <p>{invoice.policy}</p>
          </section>
        </div>

        {/**
         * Submit
         */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-500">{invoice.company.name}</p>
            <p>Employee Name</p>
          </div>
          <button className="rounded bg-[#6571FF] px-8 text-white">
            Authorize
          </button>
        </div>
        <p>Thank you for shopping with Autoworx</p>
      </DialogContent>
    </InterceptedDialog>
  );
}
