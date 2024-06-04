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
import Link from "next/link";
import moment from "moment";
import { auth } from "@/app/auth";

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
      user: true,
    },
  });

  if (!invoice) notFound();

  const customer = invoice.customerId
    ? await db.customer.findUnique({
        where: { id: invoice.customerId },
      })
    : null;
  const vehicle = invoice.vehicleId
    ? await db.vehicle.findUnique({
        where: { id: invoice.vehicleId },
      })
    : null;

  return (
    <InterceptedDialog>
      <DialogPortal>
        <DialogOverlay />
        <DialogContentBlank className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex max-h-full translate-x-[-50%] translate-y-[-50%] justify-center gap-4 duration-200">
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
                  <p>
                    {customer?.firstName} {customer?.lastName}
                  </p>
                  <p>{customer?.mobile}</p>
                  <p>{customer?.email}</p>
                </div>
                <div>
                  <h2 className="font-bold text-slate-500">Vehicle Details:</h2>
                  <p>{vehicle?.year}</p>
                  <p>{vehicle?.make}</p>
                  <p>{vehicle?.model}</p>
                  <p>{vehicle?.submodel}</p>
                  <p>{vehicle?.type}</p>
                </div>
                <div>
                  <h2 className="font-bold text-slate-500">
                    Estimate Details:
                  </h2>
                  <p>{invoice.id}</p>
                  <p>{moment(invoice.createdAt).format("MMM DD, YYYY")}</p>
                  <p>Bill Status</p>
                  <p
                    className="max-w-32 rounded-md px-2 py-[1px] text-xs font-semibold"
                    style={{
                      color: invoice.status?.textColor,
                      backgroundColor: invoice.status?.bgColor,
                    }}
                  >
                    {invoice.status?.name}
                  </p>
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
                <p>{invoice.user.name}</p>
              </div>
              <button className="rounded bg-[#6571FF] px-8 text-white">
                Authorize
              </button>
            </div>
            <p>Thank you for shopping with Autoworx</p>
          </div>
          <div className="flex w-[394px] shrink grow-0 flex-col gap-4">
            <div className="grid flex-1 gap-4 overflow-y-auto border bg-background p-6 shadow-lg">
              <h2 className="col-span-full text-3xl font-bold uppercase text-slate-500">
                Attachments
              </h2>
              {invoice.photos.map((x) => (
                <div key={x.id} className="relative aspect-square">
                  <Image src={`/uploads/${x.photo}`} fill alt="attachment" />
                </div>
              ))}
            </div>
            <Link
              href={`/estimate/create-work-order/${id}`}
              className="rounded-md bg-[#6571FF] py-2 text-center text-white"
            >
              Create Work Order
            </Link>
          </div>
        </DialogContentBlank>
      </DialogPortal>
    </InterceptedDialog>
  );
}
