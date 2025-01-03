import { DialogContent, InterceptedDialog } from "@/components/Dialog";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceItems } from "./InvoiceItems";
import moment from "moment";
import SaveWorkOrderBtn from "./SaveWorkOrderBtn";
import Image from "next/image";
import { getTechnicians } from "@/actions/estimate/technician/getTechnicians";
import DueDate from "./DueDateInput";

export default async function WorkOrderPage({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    dueDate: string | null;
  };
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
      user: true,
      client: true,
      column: true,
      vehicle: true,
    },
  });

  if (!invoice) notFound();

  const companyDetails = await db.company.findUnique({
    where: { id: invoice.companyId },
  });

  const invoiceTechnicians = await getTechnicians({ invoiceId: invoice.id });

  return (
    <InterceptedDialog>
      <DialogContent className="max-w-[740px]">
        {/**
         * Logo, Contact Information
         */}
        <div className="flex items-center justify-between">
          <div className="flex aspect-square w-32 items-center justify-center bg-slate-500 text-center font-bold text-white">
            {companyDetails?.image ? (
              <Image
                src={companyDetails.image}
                alt="company logo"
                width={128}
                height={128}
                // className="object-contain"
              />
            ) : (
              "Logo"
            )}
          </div>
          <div className="text-right text-xs">
            <h2 className="font-bold">Contact Information:</h2>
            <p>
              {companyDetails?.address} {companyDetails?.city}{" "}
              {companyDetails?.state} {companyDetails?.zip}
            </p>
            <p>{companyDetails?.phone}</p>
            <p>{companyDetails?.email}</p>
            <DueDate
              invoiceDueDate={invoice?.dueDate}
              dueDateParams={searchParams.dueDate}
            />
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
              <p>
                {invoice.client?.firstName} {invoice.client?.lastName}
              </p>
              <p>{invoice.client?.mobile}</p>
              <p>{invoice.client?.email}</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-500">Vehicle Details:</h2>
              <p>{invoice.vehicle?.year}</p>
              <p>{invoice.vehicle?.make}</p>
              <p>{invoice.vehicle?.model}</p>
              <p>{invoice.vehicle?.submodel}</p>
              <p>{invoice.vehicle?.type}</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-500">Estimate Details:</h2>
              <p>{invoice.id}</p>
              <p>{moment(invoice.createdAt).format("MMM DD, YYYY")}</p>
              <p>Bill Status</p>
              <p
                className="max-w-32 rounded-md px-2 py-[1px] text-xs font-semibold"
                style={{
                  color: invoice.column?.textColor || undefined,
                  backgroundColor: invoice.column?.bgColor || undefined,
                }}
              >
                {invoice.column?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <InvoiceItems
            items={JSON.parse(JSON.stringify(invoice.invoiceItems))}
            invoiceTechnicians={invoiceTechnicians}
          />
        </div>

        {/**
         * Submit
         */}
        <div className="flex">
          <SaveWorkOrderBtn
            invoiceId={invoice.id}
            dueDate={searchParams.dueDate}
          />
        </div>
        <div>
          <p className="font-bold text-slate-500">{invoice.company.name}</p>
          <p>
            {invoice.user?.firstName} {invoice.user?.lastName}
          </p>
        </div>
      </DialogContent>
    </InterceptedDialog>
  );
}
