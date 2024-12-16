import { fetchAndTransformData } from "@/lib/fetchAndTransformData";
import { AuthSession } from "@/types/auth";
import { InvoiceType } from "@prisma/client";
import Header from "../Header";
import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { db } from "@/lib/db";
import NavigationTabs from "../NavigationTabs";
import Table from "../Table";
import Title from "@/components/Title";

export default async function InvoicesPage({
  searchParams,
}: Readonly<{
  searchParams: { startDate?: string; endDate?: string; status?: string };
}>) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const invoices = await fetchAndTransformData(
    InvoiceType.Invoice,
    companyId,
    searchParams
  );

  const categories = await db.category.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const statuses = await db.column.findMany({ where: { companyId } });

  return (
    <div>
      <Title>Invoices</Title>

      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      <NavigationTabs activeTab="b-invoice">
        <Table data={invoices} />
      </NavigationTabs>
    </div>
  );
}