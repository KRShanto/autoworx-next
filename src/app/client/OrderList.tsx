"use client";
import { cn } from "@/lib/cn";
import React from "react";

type Props = {
  orders: { id: number; invoiceId: number; price: number; status: string }[];
};

const OrderList = ({ orders }: Props) => {
  return (
    <div className="w-full">
      <div className="table w-full">
        {orders ? (
          <table className="w-full shadow-md">
            <thead className="bg-white">
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
                    "cursor-pointer rounded-md py-3",
                    index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                  )}
                >
                  <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
                    {order.invoiceId}
                  </td>
                  <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
                    {order.price}
                  </td>
                  <td className="px-4 py-1 text-left 2xl:px-10">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center">
            Select a vehicle to view orders
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
