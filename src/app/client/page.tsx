import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { IoSearchOutline } from "react-icons/io5";
import EditClient from "./EditClient";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import DeleteClient from "./DeleteClient";
import NewCustomer from "@/components/Lists/NewCustomer";

export default async function Page() {
  const companyId = await getCompanyId();
  const clients = await db.customer.findMany({
    where: { companyId },
    include: { tag: true, source: true },
  });

  return (
    <div className="h-full w-full space-y-8">
      <Title>Client List</Title>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8 bg-white">
          <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
            <span className="">
              <IoSearchOutline />
            </span>
            <input
              name="search"
              type="text"
              className="w-full rounded-md border border-slate-400 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
          </div>
        </div>
        <NewCustomer
          buttonElement={
            <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
              + Add New Client
            </button>
          }
        />
      </div>
      <div>
        <div className="app-shadow w-full rounded-lg bg-white p-3">
          <table className="w-full">
            <thead className="">
              <tr className="h-10 border-b">
                <th className="border-b px-4 py-2 text-left">Client ID</th>
                <th className="border-b px-4 py-2 text-left">Client </th>
                <th className="border-b px-4 py-2 text-left">Email</th>
                <th className="border-b px-4 py-2 text-left">Phone</th>
                <th className="border-b px-4 py-2 text-center">Edit</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client, index) => (
                <tr
                  key={index}
                  className={cn(
                    "py-3",
                    index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                  )}
                >
                  <td className="border-b px-4 py-2 text-left">
                    <Link
                      className="text-blue-500"
                      href={`/client/${client.id}`}
                    >
                      {client.id}
                    </Link>
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    {client.firstName} {client.lastName}
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    {client.email}
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    {client.mobile}
                  </td>
                  <td className="border-b border-l bg-white px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <EditClient client={client} />
                      <DeleteClient id={client.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
