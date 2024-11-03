import { DialogContent, InterceptedDialog } from "@/components/Dialog";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceItems } from "../../../../(.)workorder/[id]/InvoiceItems";
import moment from "moment";
import SaveWorkOrderBtn from "./SaveWorkOrderBtn";

export default async function CreateWorkOrder({
  params: { id1 },
  searchParams: { workOrderId },
}: {
  params: { id1: string };
  searchParams: { workOrderId: string };
}) {
  const invoice = await db.invoice.findUnique({
    where: { id: id1 },
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
      column: true,
      user: true,
    },
  });

  if (!invoice) notFound();

  const client = invoice.clientId
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
              <p>
                {client?.firstName} {client?.lastName}
              </p>
              <p>{client?.mobile}</p>
              <p>{client?.email}</p>
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
              <h2 className="font-bold text-slate-500">Estimate Details:</h2>
              <p>{invoice.id}</p>
              <p>{moment(invoice.createdAt).format("MMM DD, YYYY")}</p>
              <p>Bill Status</p>
              <p
                className="max-w-32 rounded-md px-2 py-[1px] text-xs font-semibold"
                style={{
                  color: invoice.column?.textColor||undefined,
                  backgroundColor: invoice.column?.bgColor||undefined,
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
          />
        </div>

        {/**
         * Submit
         */}
        <div className="flex">
          <SaveWorkOrderBtn />
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
