import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import DateRange from "../../../components/DateRange";
import FilterBySelection from "../../reporting/components/filter/FilterBySelection";
import Filter from "./Filter";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { useServerGet } from "@/hooks/useServerGet";
import { getWorkOrders } from "@/actions/pipelines/getWorkOrders";

type Props = {};

const WorkOrders =  (props: Props) => {
  const {data: invoices,} = useServerGet(getWorkOrders);

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
              <th className="border-b px-4 py-2 text-left">Work Order#</th>
              <th className="border-b px-4 py-2 text-left">Client </th>
              <th className="border-b px-4 py-2 text-left">Vehicle Info</th>
              <th className="border-b px-4 py-2 text-left">Services</th>
              <th className="border-b px-4 py-2 text-left">Time Created</th>
              <th className="border-b px-4 py-2 text-left">Due Date</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices && invoices.map((invoice, index) => {
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
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full text-[#6571FF]"
                    >
                      {id}
                    </Link>
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full"
                    >
                      {client}
                    </Link>
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full"
                    >
                      {vehicle}
                    </Link>
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full"
                    >
                      {serviceString}
                    </Link>
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full"
                    >
                      {timeCreated}
                    </Link>
                  </td>

                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full"
                    ></Link>
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      href={`/estimate/workorder/${id}`}
                      className="block h-full w-full"
                    ></Link>
                  </td>
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
