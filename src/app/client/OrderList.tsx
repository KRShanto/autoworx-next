"use client";
import { cn } from "@/lib/cn";
import { Appointment, Invoice, Status, Vehicle } from "@prisma/client";
import Link from "next/link";

const OrderList = ({
  vehicle,
}: {
  vehicle: Vehicle & { invoices: (Invoice & { status: Status })[] };
}) => {
  return (
    <div className="app-shadow h-full w-full rounded-lg bg-white p-4">
      <h3 className="text-lg font-semibold">Order List</h3>

      <div className="table h-full w-full">
        <table className="w-full">
          <thead>
            <tr className="h-10 border-b">
              <th className="px-4 text-left 2xl:px-10">Invoice#</th>
              <th className="px-4 text-left 2xl:px-10">Price</th>
              <th className="px-4 text-left 2xl:px-10">Status</th>
            </tr>
          </thead>

          <tbody>
            {vehicle.invoices?.map((invoice, index) => (
              <tr
                key={index}
                className={cn(
                  "rounded-md",
                  index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                )}
              >
                <td className="text-nowrap px-4 py-2 text-left text-[#6571FF] 2xl:px-10">
                  <Link href={`/estimate/view/${invoice.id}`}>
                    {invoice.id}
                  </Link>
                </td>
                <td className="text-nowrap px-4 py-2 text-left 2xl:px-10">
                  {invoice.grandTotal as any}
                </td>
                <td className="px-4 py-2 text-left 2xl:px-10">
                  {invoice.status?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
