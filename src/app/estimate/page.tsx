import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import FilterImage from "@/../public/icons/Filter.svg";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { db } from "@/lib/db";
import { InvoiceType } from "@prisma/client";

interface InvoiceData {
  id: string;
  clientName: string;
  vehicle: string;
  email: string;
  phone: number;
  grandTotal: number;
  createdAt: Date;
  status?: string;
  color?: number;
}

async function fetchAndTransformData(type: InvoiceType) {
  const data = await db.invoice.findMany({
    where: { type },
  });

  return await Promise.all(
    data.map(async (item) => {
      const vehicle = item.vehicleId
        ? await db.vehicle.findFirst({
            where: { id: item.vehicleId },
          })
        : null;
      const customer = item.customerId
        ? await db.customer.findFirst({
            where: { id: item.customerId },
          })
        : null;
      const status = item.statusId
        ? await db.status.findFirst({
            where: { id: item.statusId },
          })
        : null;

      return {
        id: item.id,
        clientName: customer?.firstName + " " + customer?.lastName || "",
        vehicle: vehicle?.model || "",
        email: customer?.email || "",
        phone: customer?.mobile || 0o0,
        grandTotal: item.grandTotal as any,
        createdAt: item.createdAt,
        status: status?.name || "",
        color: status?.hue,
      };
    }),
  );
}

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default async function Page() {
  const estimates = await fetchAndTransformData(InvoiceType.Estimate);
  const invoices = await fetchAndTransformData(InvoiceType.Invoice);

  return (
    <div>
      <Title>Estimates</Title>

      {/* Header */}
      <div className="mt-5 flex justify-between">
        <div className="app-shadow flex gap-3 rounded-md p-3 ">
          {/* Search */}
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="h-10 w-64 rounded-md border-2 border-slate-400 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filter */}
          <button className="flex h-10 items-center gap-2 rounded-md border-2 border-slate-400 p-1">
            <Image
              src={FilterImage}
              alt="Filter"
              width={20}
              height={20}
              className="cursor-pointer"
            />
            Customize
          </button>
        </div>

        {/* Create Estimate */}
        <Link
          href="/estimate/create"
          className="app-shadow flex h-10 items-center rounded-md bg-[#6571FF] px-5 text-white"
        >
          + Create Estimate
        </Link>
      </div>

      <Tabs defaultValue="estimate" className="mt-5 grid-cols-1">
        <TabsList>
          <TabsTrigger value="invoice">Invoices</TabsTrigger>
          <TabsTrigger value="estimate">Estimates</TabsTrigger>
        </TabsList>

        <TabsContent value="estimate">
          <Table data={estimates} />
        </TabsContent>

        <TabsContent value="invoice">
          <Table data={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Table({ data }: { data: InvoiceData[] }) {
  return (
    <div className="h-[65vh] rounded-md bg-white">
      <table className="h-full w-full">
        {/* Estimate Header */}
        <thead className=" bg-white">
          <tr className="h-10 border-b">
            <th className="px-10 text-left">Invoice ID</th>
            <th className="px-10 text-left">Client</th>
            <th className="px-10 text-left">Vehicle</th>
            <th className="px-10 text-left">Email</th>
            <th className="px-10 text-left">Phone</th>
            <th className="px-10 text-left">Price</th>
            <th className="px-10 text-left">Date</th>
            <th className="px-10 text-left">Status</th>
            <th className="px-10 text-left">Edit</th>
          </tr>
        </thead>

        {/* Estimate List */}
        <tbody>
          {data.map((data, index) => (
            <tr
              key={data.id}
              className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
            >
              <td className="h-12 px-10 text-left">{data.id}</td>
              <td className="px-10 text-left">{data.clientName}</td>
              <td className="px-10 text-left">{data.vehicle}</td>
              <td className="px-10 text-left">{data.email}</td>
              <td className="px-10 text-left">{data.phone}</td>
              <td className="px-10 text-left text-[#006D77]">
                {data.grandTotal?.toString()}
              </td>
              <td className="px-10 text-left">
                {/* format: date.month.year */}
                {moment(data.createdAt).format("DD.MM.YYYY")}
              </td>
              <td className="px-10 text-left">
                <p
                  className="rounded-md text-center text-white"
                  style={{
                    backgroundColor: `hsl(${data.color}, 50%, 40%)`,
                  }}
                >
                  {data.status}
                </p>
              </td>
              <td className="px-10 text-left">
                <button className="text-2xl text-blue-600">
                  <CiEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
