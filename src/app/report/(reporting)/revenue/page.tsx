import React from "react";
import Calculation from "../components/Calculation";
import FilterBySearchBox from "../components/filter/FilterBySearchBox";
import FilterByDateRange from "../components/filter/FilterByDateRange";
import FilterByCategory from "../components/filter/FilterByCategory";
import FilterByService from "../components/filter/FilterByService";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { cn } from "@/lib/cn";

const clients = [
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
];

export default function ReportingPage() {
  return (
    <div className="space-y-5">
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="week" amount={0} />
        <Calculation content="month" amount={0} />
        <Calculation content="ytd" amount={0} />
        <Calculation content="revenue" amount={0} />
      </div>
      {/* filter section */}
      <div className="flex w-full items-center justify-between gap-x-3">
        <div className="flex flex-1 items-center space-x-4">
          <FilterBySearchBox />
          <FilterByDateRange />
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex max-w-80 items-center gap-2 rounded-lg border border-gray-400 p-1 px-5 text-sm text-gray-400 hover:border-blue-600">
            <span>Filter</span>
            <IoMdArrowDropdown />
          </button>
          <FilterByCategory />
          <FilterByService />
        </div>
      </div>
      {/* table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Customer</th>
              <th className="border-b px-4 py-2 text-center">Vehicle Info </th>
              <th className="border-b px-4 py-2 text-center">Invoice #</th>
              <th className="border-b px-4 py-2 text-center">Date Delivered</th>
              <th className="border-b px-4 py-2 text-center">Price</th>
              <th className="border-b px-4 py-2 text-center">Cost</th>
              <th className="border-b px-4 py-2 text-center">Profit</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => (
              <tr
                key={index}
                className={cn(
                  "cursor-pointer rounded-md py-3",
                  index % 2 === 0 ? "bg-white" : "bg-blue-100",
                )}
              >
                <td className="border-b px-4 py-2 text-center">
                  <Link className="text-blue-500" href={`/client/${client.id}`}>
                    {client.name}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.email}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.phone}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.phone}
                </td>
                <td className="border-b px-4 py-2 text-center">0</td>
                <td className="border-b px-4 py-2 text-center">0</td>
                <td className="border-b px-4 py-2 text-center">0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
