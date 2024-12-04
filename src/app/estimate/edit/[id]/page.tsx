import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { InventoryProduct, Labor, Material, Tag } from "@prisma/client";
import { notFound } from "next/navigation";
import { FaSave } from "react-icons/fa";
import { BillSummary } from "../../create/BillSummary";
import ConvertButton from "../../create/ConvertButton";
import Create from "../../create/Create";
import Header from "../../create/Header";
import SyncEstimate from "../../create/SyncEstimate";
import { AttachmentTab } from "../../create/tabs/AttachmentTab";
import { CreateTab } from "../../create/tabs/CreateTab";
import PaymentTab from "../../create/tabs/PaymentTab";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { clientId?: string };
}) {
  const session = (await auth()) as AuthSession;
  const { id } = params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      requestEstimate: true,
    },
  });

  if (!invoice) return notFound();
  if (session.user.companyId === invoice.fromRequestedCompanyId)
    return notFound();

  const vehicle = invoice.vehicleId
    ? await db.vehicle.findUnique({ where: { id: invoice.vehicleId } })
    : null;
  const client = invoice.clientId
    ? await db.client.findUnique({ where: { id: invoice.clientId } })
    : null;
  const status = invoice.columnId
    ? await db.column.findUnique({ where: { id: invoice.columnId } })
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
    if (Array.isArray(item.materials) && item.materials.length === 0) {
      return {
        ...item,
        materials: [null],
        tags,
      };
    }
    return { ...item, tags };
  });

  const photos = await db.invoicePhoto.findMany({ where: { invoiceId: id } });
  const tasks = await db.task.findMany({ where: { invoiceId: id } });

  const companyId = session.user.companyId;
  const customers = await db.client.findMany({ where: { companyId } });
  const vehicles = await db.vehicle.findMany({ where: { companyId } });
  const categories = await db.category.findMany({ where: { companyId } });
  const services = await db.service.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const vendors = await db.vendor.findMany({ where: { companyId } });
  const statuses = await db.column.findMany({ where: { companyId } });

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

  const products = (await db.inventoryProduct.findMany({
    where: { companyId, type: "Product" },
  })) as (InventoryProduct & { tags: Tag[] })[];

  const productTags = await db.inventoryProductTag.findMany({
    where: {
      inventoryId: { in: products.map((product) => product.id) },
    },
    include: { tag: true },
  });

  products.forEach((product) => {
    product.tags = productTags
      .filter((productTag) => productTag.inventoryId === product.id)
      .map((productTag) => productTag.tag);
  });
  materials.forEach((material) => {
    material.tags = materialTags
      .filter((materialTag) => materialTag.materialId === material.id)
      .map((materialTag) => materialTag.tag);
  });

  materials.push(
    // @ts-ignore
    ...products.map((product) => ({
      ...product,
      cost: product.price,
      tags: product.tags,
      productId: product.id,
    })),
  );

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
    <div className="-my-2 grid h-[93vh] gap-3 overflow-clip py-2 md:grid-cols-[1fr,24rem] md:grid-rows-[auto,auto,1fr]">
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

      <div>
        <ConvertButton
          type={invoice.type}
          text={`Update ${invoice.type}`}
          icon={<FaSave />}
          className="border-none bg-[#6571FF] px-8 text-white"
        />
        {/* <ConvertTo invoice={invoice} /> */}
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
    </div>
  );
}
