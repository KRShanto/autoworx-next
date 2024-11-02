
import { AuthSession } from "@/types/auth";
import Header from "../Header";
import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { db } from "@/lib/db";
import NavigationTabs from "../NavigationTabs";
import CannedTable from "../CannedTable";
import Title from "@/components/Title";

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

  const categories = await db.category.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const statuses = await db.column.findMany({ where: { companyId } });

  return (
    <div>
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