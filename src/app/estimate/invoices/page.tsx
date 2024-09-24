import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import Table from "../Table";
import Link from "next/link";
import { fetchAndTransformData } from "@/lib/fetchAndTransformData";
import { AuthSession } from "@/types/auth";

import { InvoiceType } from "@prisma/client";
import Header from "../Header";
import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { db } from "@/lib/db";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string; status?: string };
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const invoices = await fetchAndTransformData(
    InvoiceType.Invoice,
    companyId,
    searchParams,
  );
  //
  const categories = await db.category.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const statuses = await db.status.findMany({ where: { companyId } });
  return (
    <div>
      <Title>Invoices</Title>

      {/* TODO: find a better way. fetch these values from client side in where they are actually needed */}
      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      <Tabs defaultValue="b-invoice" className="mt-5">
        <TabsList>
          <Link href="/estimate">
            <TabsTrigger value="a-estimate">Estimates</TabsTrigger>
          </Link>
          <Link href="/estimate/canned">
            <TabsTrigger value="c-canned">Canned</TabsTrigger>
          </Link>
          <TabsTrigger value="b-invoice">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="b-invoice">
          <Table data={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
