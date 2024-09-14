import { SyncLists } from "@/components/SyncLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { InvoiceType } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { auth } from "../auth";
import CannedTable from "./CannedTable";
import ConvertTo from "./ConvertTo";
import { Filter } from "./Filter";
import Header from "./Header";
import Table from "./Table";

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
        gte: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
        lte: endDate ? new Date(`${endDate}T23:59:59.999`) : undefined,
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
      const client = item.clientId
        ? await db.client.findFirst({
            where: { id: item.clientId },
          })
        : null;
      const status = item.statusId
        ? await db.status.findFirst({
            where: { id: item.statusId },
          })
        : null;

      return {
        id: item.id,
        clientName: client?.firstName + " " + client?.lastName || "",
        vehicle: vehicle?.model || "",
        email: client?.email || "",
        phone: client?.mobile || "",
        grandTotal: item.grandTotal as any,
        createdAt: item.createdAt,
        status: status?.name || "",
        textColor: status?.textColor || "",
        bgColor: status?.bgColor || "",
      };
    }),
  );
}

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

  const labors = await db.labor.findMany({
    where: { companyId },
    include: { category: true },
  });
  const categories = await db.category.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });

  return (
    <div>
      <Title>Estimates</Title>

      {/* TODO: find a better way. fetch these values from client side in where they are actually needed */}
      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      <Tabs defaultValue="a-estimate" className="mt-5 grid-cols-1">
        <TabsList>
          <TabsTrigger value="c-canned">Canned</TabsTrigger>
          <TabsTrigger value="b-invoice">Invoices</TabsTrigger>
          <TabsTrigger value="a-estimate">Estimates</TabsTrigger>
        </TabsList>

        <TabsContent value="a-estimate">
          <Table data={estimates} />
        </TabsContent>

        <TabsContent value="b-invoice">
          <Table data={invoices} />
        </TabsContent>

        <TabsContent value="c-canned">
          <CannedTable labors={labors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
