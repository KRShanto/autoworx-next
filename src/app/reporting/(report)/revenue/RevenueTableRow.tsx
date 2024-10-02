import { cn } from "@/lib/cn";
import { Prisma } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import React from "react";

type TProps = {
  invoice: TInvoice;
  index: number;
};

type TInvoice = Prisma.InvoiceGetPayload<{
  include: {
    invoiceItems: {
      include: {
        materials: true;
        labor: true;
      };
    };
    vehicle: {
      select: {
        make: true;
        model: true;
        submodel: true;
      };
    };
    client: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
  };
}>;

export default function RevenueTableRow({ invoice, index }: TProps) {
  const formattedDate = moment(invoice.createdAt).format("MMM Do, YYYY");
  const { costPrice, profitPrice } = invoice.invoiceItems.reduce(
    (
      acc,
      cur: Prisma.InvoiceItemGetPayload<{
        include: {
          materials: true;
          labor: true;
        };
      }>,
    ) => {
      const materialCostPrice = cur.materials.reduce(
        (acc, cur) => acc + Number(cur?.cost) * Number(cur?.quantity),
        0,
      );
      // labor cost price is assumed to be per hour
      const laborCostPrice = Number(cur.labor?.charge) * cur?.labor?.hours!;
      const costPrice = materialCostPrice + laborCostPrice;
      acc.costPrice = costPrice;
      acc.profitPrice = Number(invoice.grandTotal) - acc.costPrice;
      return acc;
    },
    {
      costPrice: 0,
      profitPrice: 0,
    },
  );
  return (
    <tr
      className={cn(
        "cursor-pointer rounded-md py-3",
        index % 2 === 0 ? "bg-white" : "bg-blue-100",
      )}
    >
      <td className="border-b px-4 py-2 text-center">
        <Link className="text-blue-500" href={`/client/${invoice.id}`}>
          {invoice?.client?.firstName} {invoice?.client?.lastName!}
        </Link>
      </td>
      <td className="border-b px-4 py-2 text-center">
        {invoice.vehicle?.make} {invoice.vehicle?.model}{" "}
        {invoice.vehicle?.submodel}
      </td>
      <td className="border-b px-4 py-2 text-center">
        <Link className="text-blue-500" href={`/estimate/view/${invoice.id}`}>
          {invoice?.id}
        </Link>
      </td>
      <td className="border-b px-4 py-2 text-center">{formattedDate}</td>
      <td className="border-b px-4 py-2 text-center">
        {Number(invoice.grandTotal)}
      </td>
      <td className="border-b px-4 py-2 text-center">{costPrice}</td>
      <td className="border-b px-4 py-2 text-center">{profitPrice}</td>
    </tr>
  );
}
