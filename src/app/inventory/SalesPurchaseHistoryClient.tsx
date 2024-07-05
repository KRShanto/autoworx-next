"use client";

import { cn } from "@/lib/cn";
import { InventoryProductHistory } from "@prisma/client";
import * as Tabs from "@radix-ui/react-tabs";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { HiExternalLink } from "react-icons/hi";

enum Tab {
  Sales = "sales",
  Purchase = "purchase",
}

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default function SalesPurchaseHistoryClient({
  productId,
  histories,
  vendorName,
  price,
}: {
  productId: number | undefined;
  histories: InventoryProductHistory[];
  vendorName: string;
  price: number;
}) {
  const [tab, setTab] = useState<Tab>(Tab.Sales);

  return (
    <div className="app-shadow #h-[63%] mt-4 w-full grow rounded-lg bg-white p-4">
      <Tabs.Root value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <Tabs.List className="flex gap-5">
          <Tabs.Trigger
            value={Tab.Sales}
            className={cn(
              "rounded-md p-2 px-5 text-sm 2xl:text-lg",
              tab === Tab.Sales
                ? "bg-[#6571FF] text-white"
                : "border border-[#6571FF] text-[#6571FF]",
            )}
          >
            Sales List
          </Tabs.Trigger>
          <Tabs.Trigger
            value={Tab.Purchase}
            className={cn(
              "rounded-md p-2 px-5 text-sm 2xl:text-lg",
              tab === Tab.Purchase
                ? "bg-[#6571FF] text-white"
                : "border border-[#6571FF] text-[#6571FF]",
            )}
          >
            Purchase List
          </Tabs.Trigger>
        </Tabs.List>
        <div className="mt-3">
          <Tabs.Content value={Tab.Sales}>
            <Table
              productId={productId}
              histories={histories.filter((history) => history.type === "Sale")}
              vendorName={vendorName}
              price={price}
            />
          </Tabs.Content>
          <Tabs.Content value={Tab.Purchase}>
            <Table
              productId={productId}
              histories={histories.filter(
                (history) => history.type === "Purchase",
              )}
              vendorName={vendorName}
              price={price}
            />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}

function Table({
  productId,
  histories,
  vendorName,
  price,
}: {
  productId?: number;
  histories: InventoryProductHistory[];
  vendorName: string;
  price: number;
}) {
  return (
    <table className="w-full text-sm 2xl:text-base">
      <thead className="bg-white">
        <tr className="h-10 border-b">
          <th className="px-4 text-left 2xl:px-10">#</th>
          <th className="px-4 text-left 2xl:px-10">Name</th>
          <th className="px-4 text-left 2xl:px-10">Price</th>
          <th className="px-4 text-left 2xl:px-10">Quantity</th>
          <th className="px-4 text-left 2xl:px-10">Total</th>
          <th className="px-4 text-left 2xl:px-10">Date</th>
          <th className="px-5 text-left">Invoice</th>
        </tr>
      </thead>

      <tbody>
        {histories.map((history, index) => (
          <tr
            key={history.id}
            className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
          >
            <td className="h-12 px-4 text-left 2xl:px-10">
              <p>{history.id}</p>
            </td>
            <td className="text-nowrap px-4 text-left 2xl:px-10">
              {vendorName}
            </td>
            <td className="text-nowrap px-4 text-left 2xl:px-10">{price}</td>
            <td className="px-4 text-left 2xl:px-10">{history.quantity}</td>
            <td className="px-4 text-left 2xl:px-10">
              {price * history.quantity}
            </td>
            <td className="px-4 text-left 2xl:px-10">
              {moment(history.date).format(
                // date.month.year
                "DD.MM.YYYY",
              )}
            </td>
            <td className="mt-2 flex gap-3 px-5">
              {history.invoiceId && (
                <Link
                  href={`/estimate/view/${history.invoiceId}`}
                  className="mx-auto"
                >
                  <HiExternalLink />
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
