import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { db } from "@/lib/db";
import { InvoiceType } from "@prisma/client";
import { Filter } from "./Filter";
import { AuthSession } from "@/types/auth";
import { auth } from "../auth";
import { SyncLists } from "@/components/SyncLists";
import ConvertTo from "./ConvertTo";

interface InvoiceData {
  id: string;
  clientName: string;
  vehicle: string;
  email: string;
  phone: string;
  grandTotal: number;
  createdAt: Date;
  status?: string;
  textColor?: string;
  bgColor?: string;
}

async function fetchAndTransformData(
  type: InvoiceType,
  companyId: number,
  searchParams: { startDate?: string; endDate?: string; status?: string },
) {
  const { startDate, endDate, status } = searchParams;

  const data = await db.invoice.findMany({
    where: {
      type,
      companyId,
      createdAt: {
        // BUG: its not working
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
      statusId: status ? parseInt(status) : undefined,
    },
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
        phone: customer?.mobile || "",
        grandTotal: item.grandTotal as any,
        createdAt: item.createdAt,
        status: status?.name || "",
        textColor: status?.textColor || "",
        bgColor: status?.bgColor || "",
      };
    }),
  );
}

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default async function Page({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string; status?: string };
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const estimates = await fetchAndTransformData(
    InvoiceType.Estimate,
    companyId,
    searchParams,
  );
  const invoices = await fetchAndTransformData(
    InvoiceType.Invoice,
    companyId,
    searchParams,
  );
  const statuses = await db.status.findMany({ where: { companyId } });

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
          <SyncLists statuses={statuses} />
          <Filter />
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
      <table className="w-full">
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
              <td className="h-12 px-10 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  passHref
                  className="text-blue-600"
                >
                  {data.id}
                </Link>
              </td>
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
                    backgroundColor: data.bgColor,
                    color: data.textColor,
                  }}
                >
                  {data.status}
                </p>
              </td>
              <td className="flex items-center gap-3 px-10">
                <ConvertTo id={data.id} />
                <Link
                  href={`/estimate/edit/${data.id}`}
                  className="text-2xl text-blue-600"
                >
                  <CiEdit />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
