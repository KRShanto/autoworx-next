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
    <div className="app-shadow mt-4 h-[63%] w-full overflow-y-auto rounded-lg bg-white p-4">
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
              histories={histories.filter((history) => history.type === "Sale")}
              vendorName={vendorName}
              price={price}
            />
          </Tabs.Content>
          <Tabs.Content value={Tab.Purchase}>
            <Table
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
  histories,
  vendorName,
  price,
}: {
  histories: InventoryProductHistory[];
  vendorName: string;
  price: number;
}) {
  return (
    <table className="w-full text-sm 2xl:text-base">
      <thead className="bg-white">
        <tr className="h-10 border-b">
          <th className="text-center">#</th>
          <th className="text-center">Name</th>
          <th className="text-center">Price</th>
          <th className="text-center">Quantity</th>
          <th className="text-center">Total</th>
          <th className="text-center">Date</th>
          <th className="text-center">Invoice</th>
        </tr>
      </thead>

      <tbody>
        {histories.map((history, index) => (
          <tr
            key={history.id}
            className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
          >
            <td className="h-12 text-center">
              <p>{history.id}</p>
            </td>
            <td className="text-nowrap text-center">{vendorName}</td>
            <td className="text-nowrap text-center">${price}</td>
            <td className="text-center">{history.quantity}</td>
            <td className="text-center">${price * history.quantity}</td>
            <td className="text-center">
              {moment(history.date).format(
                // date.month.year
                "DD.MM.YYYY",
              )}
            </td>
            <td className="">
              {history.invoiceId && (
                <Link
                  href={`/estimate/view/${history.invoiceId}`}
                  className="relative left-1/2 -translate-x-1/2 transform"
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
