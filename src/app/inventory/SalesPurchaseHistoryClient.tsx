"use client";

import { cn } from "@/lib/cn";
import {
  Client,
  InventoryProduct,
  InventoryProductHistory,
  InventoryProductHistoryType,
  User,
  Vendor,
} from "@prisma/client";
import * as Tabs from "@radix-ui/react-tabs";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";
import { auth } from "../auth";
import EditHistory from "./EditHistory";
import EditProductForm from "./EditProductForm";

enum Tab {
  Sales = "sales",
  Purchase = "purchase",
}

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default function SalesPurchaseHistoryClient({
  user,
  product,
  histories,
  invoiceIds,
}: {
  user: User;
  product?: (InventoryProduct & { User: User | null }) | null | undefined;
  histories: (InventoryProductHistory & {
    vendor: Vendor | null;
    client: Client | null;
  })[];
  invoiceIds: string[];
}) {
  const [tab, setTab] = useState<Tab>(Tab.Sales);

  const searchParams = useSearchParams();

  // console.log("Search params: ", searchParams.get("view"));
  const view = searchParams.get("view");

  return (
    <div className="app-shadow mt-4 hidden min-h-[300px] w-full overflow-y-auto rounded-lg bg-white p-4 md:block lg:h-[63%]">
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
            {/* Use List */}
            {view === "products" ? "Sales List" : "Use List"}
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
              type="Sale"
              product={product}
              user={user}
              invoiceIds={invoiceIds}
            />
          </Tabs.Content>
          <Tabs.Content value={Tab.Purchase}>
            <Table
              histories={histories.filter(
                (history) => history.type === "Purchase",
              )}
              user={user}
              type="Purchase"
              product={product}
            />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}

function Table({
  user,
  histories,
  type,
  product,
  invoiceIds,
}: {
  user: User;
  histories: (InventoryProductHistory & {
    vendor: Vendor | null;
    client: Client | null;
  })[];
  type: InventoryProductHistoryType;
  product?: (InventoryProduct & { User: User | null }) | null | undefined;
  invoiceIds?: string[];
}) {
  return (
    <table className="w-full text-sm 2xl:text-base">
      <thead className="bg-white">
        <tr className="h-10 border-b">
          {product?.type === "Product" && (
            <th className="text-center">
              {type === "Sale" ? "Invoice" : "Receipt"}
            </th>
          )}
          <th className="text-center">Name</th>
          <th className="text-center">Price</th>
          <th className="text-center">Quantity</th>
          <th className="text-center">Total</th>
          <th className="text-center">Date</th>
          {(user?.employeeType === "Admin" ||
            user?.employeeType === "Manager") && (
            <th className="text-center">Action</th>
          )}
        </tr>
      </thead>

      <tbody>
        {histories.map((history, index) => (
          <tr
            key={history.id}
            className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
          >
            {product?.type === "Product" && (
              <>
                {type === "Sale" ? (
                  history.invoiceId ? (
                    <td className="text-center text-[#6571FF]">
                      {history.invoiceId && (
                        <Link href={`/estimate/view/${history.invoiceId}`}>
                          {history.invoiceId}
                        </Link>
                      )}
                    </td>
                  ) : (
                    <p className="text-center text-red-500">--- Loss ---</p>
                  )
                ) : (
                  <td className="text-center text-[#6571FF]">
                    <p>{product && product.receipt}</p>
                  </td>
                )}
              </>
            )}

            {product?.type === "Product" && (
              <td className="text-nowrap text-center">
                {type === "Sale"
                  ? history.client?.firstName
                  : history.vendor?.name}
              </td>
            )}
            {product?.type === "Supply" && (
              <td className="text-nowrap text-center">
                {product?.User?.firstName}
              </td>
            )}
            <td className="text-nowrap text-center">
              ${history.price?.toString()}
            </td>
            <td className="text-center">{history.quantity}</td>
            <td className="text-center">
              ${parseFloat(history.price?.toString() || "0") * history.quantity}
            </td>
            <td className="text-center">
              {moment.utc(history.date).format(
                // date.month.year
                "DD.MM.YYYY",
              )}
            </td>
            {(user?.employeeType === "Admin" ||
              user?.employeeType === "Manager") &&
              (type === "Purchase" ? (
                <td className="text-center">
                  <EditHistory
                    historyId={history.id}
                    productId={product?.id!}
                    date={history.date!}
                    vendor={history.vendor}
                    quantity={history.quantity}
                    price={Number(history.price)}
                    unit={product?.unit!}
                    lot={product?.lot!}
                    notes={history.notes!}
                  />
                </td>
              ) : (
                <td className="text-center">
                  {history.invoiceId ? (
                    <Link
                      href={`/estimate/edit/${history.invoiceId}`}
                      className="flex items-center justify-center text-[#6571FF]"
                    >
                      <FaEdit />
                    </Link>
                  ) : (
                    <EditProductForm
                      history={history}
                      invoiceIds={invoiceIds ? invoiceIds : []}
                      productId={history.productId}
                      productType={product?.type!}
                      cost={parseInt(history?.price?.toString() || "0")}
                    />
                  )}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
