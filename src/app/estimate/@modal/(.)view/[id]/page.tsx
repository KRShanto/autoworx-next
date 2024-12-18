import { InterceptedDialog } from "@/components/Dialog";
import { db } from "@/lib/db";


import { getTechnicians } from "@/actions/estimate/technician/getTechnicians";
import InvoiceComponent from "./InvoiceComponent";
import ProtectedRouteForViewInvoice from "./ProtectedRouteForViewInvoice";

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
          service: {
            include: {
              Technician: true,
            },
          },
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

  // if (!invoice) {
  //   return notFound();
  // }

  const clientId = invoice?.clientId
    ? await db.client.findUnique({
        where: { id: invoice.clientId },
      })
    : null;
  const vehicle = invoice?.vehicleId
    ? await db.vehicle.findUnique({
        where: { id: invoice?.vehicleId },
      })
    : null;

  const invoiceTechnicians = await getTechnicians({ invoiceId: invoice?.id });

  return (
    <InterceptedDialog>
      <ProtectedRouteForViewInvoice hasInvoice={!!invoice}>
        {invoice && (
          <InvoiceComponent
            id={id}
            //@ts-ignore
            invoice={invoice}
            clientId={clientId}
            vehicle={vehicle}
            invoiceTechnicians={invoiceTechnicians}
          />
        )}
      </ProtectedRouteForViewInvoice>
    </InterceptedDialog>
  );
}
