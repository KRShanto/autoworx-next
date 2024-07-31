import { cn } from "@/lib/cn";
import moment from "moment";
import Link from "next/link";
import React from "react";
import CurrentInvoicePayment from "./CurrentInvoicePayment";
import { db } from "@/lib/db";
import { Service } from "@prisma/client";

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default async function PaymentTab({
  clientId,
}: {
  clientId: number | undefined;
}) {
  if (!clientId) return null;

  const client = await db.client.findUnique({
    where: { id: clientId },
  });

  if (!client) return null;

  const invoices = await db.invoice.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    select: {
      invoiceItems: { select: { service: true, serviceId: true, id: true } },
      grandTotal: true,
      vehicleId: true,
      createdAt: true,
      customerNotes: true,
      id: true,
    },
  });

  const totalPaid = invoices.reduce(
    (acc, invoice) =>
      acc +
      (invoice.grandTotal ? parseFloat(invoice.grandTotal.toString()) : 0),
    0,
  );

  const invoicesWithFull = await Promise.all(
    invoices.map(async (invoice) => {
      const vehicle = invoice.vehicleId
        ? await db.vehicle.findUnique({
            where: { id: invoice.vehicleId },
          })
        : null;

      let paymentMethodText = "";

      const payment = await db.payment.findFirst({
        where: { invoiceId: invoice.id },
        select: {
          other: true,
          type: true,
          card: true,
        },
      });

      if (payment && payment.type === "OTHER") {
        const paymentMethodId = payment.other?.paymentMethodId;
        const paymentMethod = paymentMethodId
          ? await db.paymentMethod.findUnique({
              where: { id: paymentMethodId },
            })
          : null;
        paymentMethodText = paymentMethod?.name ?? "";
      } else if (payment && payment.type === "CARD") {
        paymentMethodText = payment?.card?.cardType ?? "";
      } else {
        paymentMethodText = payment?.type ?? "";
      }

      return {
        ...invoice,
        vehicle: vehicle?.model ?? "",
        paymentMethod: paymentMethodText,
      };
    }),
  );

  const totalServices = [] as (Service & { count: number })[];

  invoicesWithFull.forEach((invoice) => {
    invoice.invoiceItems.forEach((item) => {
      if (item.serviceId) {
        const service = totalServices.find(
          (service) => service.id === item.serviceId,
        );

        if (service) {
          service.count += 1;
        } else {
          totalServices.push({ ...item.service!, count: 1 });
        }
      }
    });
  });

  return (
    <div className="h-full">
      {/* Section 1 */}
      <div className="flex h-[25%] items-center justify-evenly">
        <CurrentInvoicePayment />

        <div className="border border-slate-400 text-sm">
          <h3 className="p-3 py-1 font-semibold">Most Frequent Services</h3>
          <div>
            {/* top 4 services */}
            {totalServices
              .sort((a, b) => b.count - a.count)
              .slice(0, 4)
              .map((service, index) => (
                <div
                  key={service.id}
                  className={cn(
                    "flex gap-44 p-3 py-1",
                    index % 2 === 0 ? evenColor : oddColor,
                  )}
                >
                  <p>{service.name}</p>
                  <p>Ordered {service.count} times</p>
                </div>
              ))}
          </div>
        </div>

        <div className="flex border border-slate-400">
          <div className="bg-[#F8FAFF] p-5 px-10 font-semibold">
            <h3>Total Paid</h3>
            <p className="text-center">${totalPaid}</p>
          </div>

          <div className="p-5 px-10 font-semibold">
            <h3>Total Transactions</h3>
            <p className="text-center">{invoices.length}</p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <h3 className="mb-1 mt-3 font-semibold">Invoice Payments</h3>
      <div className="h-[30%] overflow-scroll border">
        <table className="w-full text-xs">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="px-10 text-left">Invoice ID</th>
              <th className="px-10 text-left">Vehicle</th>
              <th className="px-10 text-left">Amount</th>
              <th className="px-10 text-left">Date</th>
              <th className="text-nowrap px-10 text-left">Payment Method</th>
              <th className="px-10 text-left">Notes</th>
            </tr>
          </thead>

          <tbody>
            {
              // only show the latest 4 invoices
              invoicesWithFull.slice(0, 4).map((data, index) => (
                <tr
                  key={data.id}
                  className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
                >
                  <td className="h-8 px-10 text-left">
                    <Link
                      href={`/estimate/view/${data.id}`}
                      passHref
                      className="text-blue-600"
                    >
                      #{data.id}
                    </Link>
                  </td>
                  <td className="px-10 text-left">{data.vehicle}</td>
                  <td className="px-10 text-left">
                    ${data.grandTotal?.toString()}
                  </td>

                  <td className="px-10 text-left">
                    {moment(data.createdAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="px-10 text-left">{data.paymentMethod}</td>
                  <td className="px-10 text-left">{data.customerNotes}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Section 3 */}
      <h3 className="mb-1 mt-3 font-semibold">Transaction History</h3>
      <div className="h-[30%] overflow-scroll border">
        <table className="w-full text-xs">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="px-10 text-left">Invoice ID</th>
              <th className="px-10 text-left">Vehicle</th>
              <th className="px-10 text-left">Amount</th>
              <th className="px-10 text-left">Date</th>
              <th className="text-nowrap px-10 text-left">Payment Method</th>
              <th className="px-10 text-left">Notes</th>
            </tr>
          </thead>

          <tbody>
            {invoicesWithFull.map((data, index) => (
              <tr
                key={data.id}
                className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
              >
                <td className="h-8 px-10 text-left">
                  <Link
                    href={`/estimate/view/${data.id}`}
                    passHref
                    className="text-blue-600"
                  >
                    #{data.id}
                  </Link>
                </td>
                <td className="px-10 text-left">{data.vehicle}</td>
                <td className="px-10 text-left">
                  ${data.grandTotal?.toString()}
                </td>

                <td className="px-10 text-left">
                  {moment(data.createdAt).format("DD.MM.YYYY")}
                </td>
                <td className="px-10 text-left">{data.paymentMethod}</td>
                <td className="px-10 text-left">{data.customerNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
