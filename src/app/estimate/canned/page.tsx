import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import Table from "../Table";
import Link from "next/link";
import { AuthSession } from "@/types/auth";

import { InvoiceType } from "@prisma/client";
import Header from "../Header";
import { auth } from "@/app/auth";
import CannedTable from "../CannedTable";
import { db } from "@/lib/db";
import { SyncLists } from "@/components/SyncLists";

export default async function CannedPage() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;


  const labors = await db.labor.findMany({
    where: { companyId },
    include: { category: true },
  });

  const services = await db.service.findMany({
    where: { companyId },
    include: { category: true },
  });
//
const categories = await db.category.findMany({ where: { companyId } });
const tags = await db.tag.findMany({ where: { companyId } });
const statuses = await db.status.findMany({ where: { companyId } });
  return (
    <div>
      <Title>Canned</Title>

      {/* TODO: find a better way. fetch these values from client side in where they are actually needed */}
      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      <Tabs defaultValue="c-canned" className="mt-5">
        <TabsList>
          <Link href="/estimate">
            <TabsTrigger value="a-estimate">Estimates</TabsTrigger>
          </Link>
          <Link href="/estimate/invoices">
            <TabsTrigger value="b-invoice">Invoices</TabsTrigger>
          </Link>
          <TabsTrigger value="c-canned">Canned</TabsTrigger>
        </TabsList>
        <TabsContent value="c-canned">
          <CannedTable labors={labors as any} services={services as any} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
