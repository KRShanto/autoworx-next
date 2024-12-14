import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import CannedTable from "../CannedTable";
import Header from "../Header";
import NavigationTabs from "../NavigationTabs";

export default async function CannedPage() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const labors = await db.labor.findMany({
    where: { companyId, cannedLabor: true },
    include: { category: true },
  });

  const services = await db.service.findMany({
    where: { companyId },
    include: { category: true },
  });

  const categories = await db.category.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const statuses = await db.column.findMany({ where: { companyId } });

  return (
    <div className="h-full">
      <Title>Canned</Title>

      <SyncLists categories={categories} tags={tags} statuses={statuses} />

      <Header />

      {/* Use the NavigationTabs component with the 'c-canned' tab as active */}
      <NavigationTabs activeTab="c-canned">
        <CannedTable labors={labors as any} services={services as any} />
      </NavigationTabs>
    </div>
  );
}
