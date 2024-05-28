import {
  DialogClose,
  DialogContentBlank,
  DialogOverlay,
  DialogPortal,
  InterceptedDialog,
} from "@/components/Dialog";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { HiXMark } from "react-icons/hi2";
import { InvoiceItems } from "./InvoiceItems";
import Image from "next/image";

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
      <DialogPortal>
        <DialogOverlay />
        <DialogContentBlank className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex max-h-full w-full translate-x-[-50%] translate-y-[-50%] justify-center gap-4 duration-200">
          <div className="relative grid w-[740px] shrink grow-0 gap-4 overflow-y-auto border bg-background p-6 shadow-lg">
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
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <HiXMark className="h-6 w-6 text-slate-500" />
              <span className="sr-only">Close</span>
            </DialogClose>

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
                  <h2 className="font-bold text-slate-500">
                    Estimate Details:
                  </h2>
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
                    <span className="min-w-0 flex-1 overflow-x-clip text-ellipsis whitespace-nowrap px-2 font-bold uppercase text-[#6571FF]">
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
                <p className="font-bold text-slate-500">
                  {invoice.company.name}
                </p>
                <p>Employee Name</p>
              </div>
              <button className="rounded bg-[#6571FF] px-8 text-white">
                Authorize
              </button>
            </div>
            <p>Thank you for shopping with Autoworx</p>
          </div>
          <div className="relative grid w-[394px] shrink grow-0 gap-4 overflow-y-auto border bg-background p-6 shadow-lg">
            <h2 className="col-span-full text-3xl font-bold uppercase text-slate-500">
              Attachments
            </h2>
            {invoice.photos.map((x) => (
              <div key={x.id} className="aspect-square relative">
                <Image src={`/uploads/${x.photo}`} fill alt="attachment" />
              </div>
            ))}
          </div>
        </DialogContentBlank>
      </DialogPortal>
    </InterceptedDialog>
  );
}
