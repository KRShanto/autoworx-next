import { cn } from "@/lib/cn";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { TInvoice } from "./page";
import { formatNumber } from "@/utils/formatNumber";

type TProps = {
  invoice: TInvoice & { costPrice: number; profitPrice: number };
  index: number;
};

export default function RevenueTableRow({ invoice, index }: TProps) {
  const formattedDate = moment(invoice.createdAt).format("MMM Do, YYYY");
  return (
    <tr
      className={cn(
        "cursor-pointer rounded-md py-3",
        index % 2 === 0 ? "bg-white" : "bg-blue-100",
      )}
    >
      <td className="border-b px-4 py-2 text-left">
        <Link className="text-blue-500" href={`/client/${invoice.id}`}>
          {invoice?.client?.firstName} {invoice?.client?.lastName!}
        </Link>
      </td>
      <td className="border-b px-4 py-2 text-left">
        {invoice.vehicle?.make} {invoice.vehicle?.model}{" "}
        {invoice.vehicle?.submodel}
      </td>
      <td className="border-b px-4 py-2 text-left">
        <Link className="text-blue-500" href={`/estimate/view/${invoice.id}`}>
          {invoice?.id}
        </Link>
      </td>
      <td className="border-b px-4 py-2 text-left">{formattedDate}</td>
      <td className="border-b px-4 py-2 text-left">
        {formatNumber(invoice.grandTotal?.toString() || 0)}
      </td>
      <td className="border-b px-4 py-2 text-left">{formatNumber(invoice.costPrice)}
      </td>
      <td className="border-b px-4 py-2 text-left">
        {formatNumber(invoice.profitPrice.toString())}
      </td>
    </tr>
  );
}
