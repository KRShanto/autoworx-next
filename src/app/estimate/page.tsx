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
import { fetchAndTransformData } from "@/lib/fetchAndTransformData";


export default async function EstimatesPage({ searchParams }: { searchParams: { startDate?: string; endDate?: string; status?: string } }) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const estimates = await fetchAndTransformData(InvoiceType.Estimate, companyId, searchParams);
  //
  const categories = await db.category.findMany({ where: { companyId } });
const tags = await db.tag.findMany({ where: { companyId } });
const statuses = await db.status.findMany({ where: { companyId } });

  return (
    <div>
      <Title>Estimates</Title>

      {/* TODO: find a better way. fetch these values from client side in where they are actually needed */}
      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      <Tabs defaultValue="a-estimate" className="mt-5 ">
         <TabsList>
          
          <Link href="/estimate/invoices">
            <TabsTrigger value="b-invoice">Invoices</TabsTrigger>
          </Link>
          <Link href="/estimate/canned">
            <TabsTrigger value="c-canned">Canned</TabsTrigger>
          </Link>
          <TabsTrigger value="a-estimate">
            Estimates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a-estimate">
          <Table data={estimates} />
        </TabsContent>

        
      </Tabs>
    </div>
  );
}
