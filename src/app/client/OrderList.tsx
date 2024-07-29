"use client";
import { cn } from "@/lib/cn";
import React from "react";
import { Order } from "./[clientId]/page";

type Props = {};

const OrderList = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="app-shadow h-full w-full rounded-lg bg-white p-4">
      <h3 className="text-lg font-semibold">Order List</h3>

      <div className="table h-full w-full">
        {orders ? (
          <table className="w-full">
            <thead>
              <tr className="h-10 border-b">
                <th className="px-4 text-left 2xl:px-10">Invoice#</th>
                <th className="px-4 text-left 2xl:px-10">Price</th>
                <th className="px-4 text-left 2xl:px-10">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order, index) => (
                <tr
                  key={index}
                  className={cn(
                    "cursor-pointer rounded-md",
                    index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                  )}
                >
                  <td className="text-nowrap px-4 py-2 text-left 2xl:px-10">
                    {order.invoiceId}
                  </td>
                  <td className="text-nowrap px-4 py-2 text-left 2xl:px-10">
                    {order.price}
                  </td>
                  <td className="px-4 py-2 text-left 2xl:px-10">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            Select a vehicle to view orders
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
