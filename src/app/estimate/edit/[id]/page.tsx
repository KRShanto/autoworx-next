import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { BillSummary } from "../../create/BillSummary";
import Create from "../../create/Create";
import { CreateTab } from "../../create/tabs/CreateTab";
import { AttachmentTab } from "../../create/tabs/AttachmentTab";
import Header from "../../create/Header";
import ConvertButton from "../../create/ConvertButton";
import { notFound } from "next/navigation";
import SyncEstimate from "../../create/SyncEstimate";
import { FaSave } from "react-icons/fa";
import { SiConvertio } from "react-icons/si";
import ConvertTo from "./ConvertTo";
import { Labor, Material, Tag } from "@prisma/client";
import PaymentTab from "../../create/tabs/PaymentTab";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { clientId?: string };
}) {
  const { id } = params;
  const invoice = await db.invoice.findUnique({ where: { id } });

  if (!invoice) return notFound();

  const vehicle = invoice.vehicleId
    ? await db.vehicle.findUnique({ where: { id: invoice.vehicleId } })
    : null;
  const client = invoice.clientId
    ? await db.client.findUnique({ where: { id: invoice.clientId } })
    : null;
  const status = invoice.statusId
    ? await db.status.findUnique({ where: { id: invoice.statusId } })
    : null;
  const items = await db.invoiceItem.findMany({
    where: { invoiceId: id },
    select: { service: true, materials: true, labor: true, id: true },
  });
  const itemTags = await db.itemTag.findMany({
    where: { itemId: { in: items.map((item) => item.id) } },
  });
  const itemTagsTags = await db.tag.findMany({
    where: { id: { in: itemTags.map((itemTag) => itemTag.tagId) } },
  });
  const itemWithTags = items.map((item) => {
    const tags = itemTagsTags.filter((tag) =>
      itemTags.find((itemTag) => itemTag.tagId === tag.id),
    );
    return { ...item, tags };
  });

  const photos = await db.invoicePhoto.findMany({ where: { invoiceId: id } });
  const tasks = await db.task.findMany({ where: { invoiceId: id } });

  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const customers = await db.client.findMany({ where: { companyId } });
  const vehicles = await db.vehicle.findMany({ where: { companyId } });
  const categories = await db.category.findMany({ where: { companyId } });
  const services = await db.service.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const vendors = await db.vendor.findMany({ where: { companyId } });
  const statuses = await db.status.findMany({ where: { companyId } });

  const materials = (await db.material.findMany({
    where: { companyId, invoiceId: null },
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

  const payment = await db.payment.findFirst({
    where: { invoiceId: id },
    include: {
      card: true,
      check: true,
      cash: true,
      other: {
        include: {
          paymentMethod: true,
        },
      },
    },
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
      />
      <SyncEstimate
        invoice={invoice}
        items={itemWithTags}
        photos={photos}
        tasks={tasks}
        payment={payment}
      />

      <div className="flex items-center">
        <ConvertButton
          type={invoice.type}
          text={`Update ${invoice.type}`}
          icon={<FaSave />}
          className="border-none bg-[#6571FF] px-8 text-white"
        />
        <ConvertTo invoice={invoice} />
      </div>

      <Header
        id={invoice.id}
        client={client!}
        vehicle={vehicle!}
        status={status!}
      />

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
        <TabsContent value="payments">
          <PaymentTab
            clientId={
              searchParams.clientId
                ? parseInt(searchParams.clientId)
                : undefined
            }
          />
        </TabsContent>
      </Tabs>

      <div className="app-shadow col-start-2 row-start-2 row-end-4 grid h-[85vh] grid-rows-[1fr,auto,auto] divide-y rounded-md">
        <Create />
        <BillSummary />
      </div>
    </form>
  );
}
