import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import DateRange from "../../../components/DateRange";
import FilterBySelection from "../../reporting/components/filter/FilterBySelection";
import Filter from "./Filter";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

type Props = {};

const WorkOrders = async (props: Props) => {
  const companyId = await getCompanyId();
  const invoices = await db.invoice.findMany({
    where: {
      companyId,
    },
    include: {
      client: true,
      vehicle: true,
      invoiceItems: {
        include: {
          service: {
            include: {},
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
            <span className="">
              <IoSearchOutline />
            </span>
            <input
              name="search"
              type="text"
              className="w-full rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
          </div>
          {/* <DateRange onOk={(start, end) => {}} onCancel={() => {}} /> */}
          <Filter />
        </div>
      </div>
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Work Order#</th>
              <th className="border-b px-4 py-2 text-center">Client </th>
              <th className="border-b px-4 py-2 text-center">Vehicle Info</th>
              <th className="border-b px-4 py-2 text-center">Services</th>
              <th className="border-b px-4 py-2 text-center">Time Created</th>
              <th className="border-b px-4 py-2 text-center">Due Date</th>
              <th className="border-b px-4 py-2 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice, index) => {
              const id = invoice.id;
              const client =
                invoice.client?.firstName + " " + invoice.client?.lastName;
              const vehicle = `${invoice.vehicle?.year} ${invoice.vehicle?.make} ${invoice.vehicle?.model}`;
              const serviceString = invoice.invoiceItems
                .map((item) => item.service?.name)
                .join(", ");
              const timeCreated = invoice.createdAt.toDateString();

              return (
                <tr
                  key={index}
                  className={cn(
                    "rounded-md",
                    index % 2 === 0 ? "bg-white" : "bg-blue-100",
                  )}
                >
                  <td className="border-b px-4 py-2 text-center">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="text-[#6571FF]"
                    >
                      {id}
                    </Link>
                  </td>
                  <td className="border-b px-4 py-2 text-center">{client}</td>
                  <td className="border-b px-4 py-2 text-center">{vehicle}</td>
                  <td className="border-b px-4 py-2 text-center">
                    {serviceString}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {timeCreated}
                  </td>
                  <td className="border-b px-4 py-2 text-center"></td>
                  <td className="border-b px-4 py-2 text-center"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkOrders;
