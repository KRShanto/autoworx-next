import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { BillSummary } from "./BillSummary";
import Create from "./Create";
import { CreateTab } from "./tabs/CreateTab";
import { AttachmentTab } from "./tabs/AttachmentTab";
import Header from "./Header";
import ConvertButton from "./ConvertButton";
import { InvoiceType, Labor, Material, Tag } from "@prisma/client";
import { GoFileCode } from "react-icons/go";
import EstimateLogo from "@/components/EstimateLogo";

export default async function Page() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const customers = await db.customer.findMany({ where: { companyId } });
  const vehicles = await db.vehicle.findMany({ where: { companyId } });
  const categories = await db.category.findMany({ where: { companyId } });
  const services = await db.service.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const vendors = await db.vendor.findMany({ where: { companyId } });
  const statuses = await db.status.findMany({ where: { companyId } });
  const paymentMethods = await db.paymentMethod.findMany({
    where: { companyId },
  });

  const materials = (await db.material.findMany({
    where: { companyId },
  })) as (Material & { tags: Tag[] })[];

  const labors = (await db.labor.findMany({
    where: { companyId },
  })) as (Labor & { tags: Tag[] })[];

  const materialTags = await db.materialTag.findMany({
    where: {
      materialId: { in: materials.map((material) => material.id) },
    },
    include: { tag: true },
  });

  const laborTags = await db.laborTag.findMany({
    where: {
      laborId: { in: labors.map((labor) => labor.id) },
    },
    include: { tag: true },
  });

  materials.forEach((material) => {
    material.tags = materialTags
      .filter((materialTag) => materialTag.materialId === material.id)
      .map((materialTag) => materialTag.tag);
  });

  labors.forEach((labor) => {
    labor.tags = laborTags
      .filter((laborTag) => laborTag.laborId === labor.id)
      .map((laborTag) => laborTag.tag);
  });

  return (
    <form className="-my-2 grid h-[93vh] gap-3 overflow-clip py-2 md:grid-cols-[1fr,24rem] md:grid-rows-[auto,auto,1fr]">
      <Title>Estimate</Title>

      <SyncLists
        customers={customers}
        vehicles={vehicles}
        categories={categories}
        services={services}
        materials={materials}
        labors={labors}
        tags={tags}
        vendors={vendors}
        statuses={statuses}
        paymentMethods={paymentMethods}
      />
      <div className="flex">
        <ConvertButton
          type={InvoiceType.Invoice}
          text="Convert to Invoice"
          icon={<GoFileCode />}
        />
        <ConvertButton
          type={InvoiceType.Estimate}
          text="Sell as Estimate"
          className="border-none bg-[#6470FF] text-white"
          icon={<EstimateLogo />}
        />
      </div>
      <Header />

      <Tabs
        defaultValue="create"
        className="col-start-1 flex min-h-0 flex-col overflow-clip"
      >
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="attachment">Attachment</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateTab />
        </TabsContent>

        <TabsContent value="attachment">
          <AttachmentTab />
        </TabsContent>

        <TabsContent value="inspections"></TabsContent>
        <TabsContent value="payments"></TabsContent>
      </Tabs>

      <div className="app-shadow col-start-2 row-start-2 row-end-4 grid h-[85vh] grid-rows-[1fr,auto,auto] divide-y rounded-md">
        <Create />
        <BillSummary />
      </div>
    </form>
  );
}
