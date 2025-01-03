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
import {
  InventoryProduct,
  InvoiceType,
  Labor,
  Material,
  Tag,
} from "@prisma/client";
import EstimateLogo from "@/components/EstimateLogo";
import PaymentTab from "./tabs/PaymentTab";

export default async function Page({
  searchParams,
}: {
  searchParams: { clientId?: string };
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const customers = await db.client.findMany({ where: { companyId } });
  const vehicles = await db.vehicle.findMany({ where: { companyId } });
  const categories = await db.category.findMany({ where: { companyId } });
  const services = await db.service.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const vendors = await db.vendor.findMany({ where: { companyId } });
  const statuses = await db.column.findMany({ where: { companyId } });
  const paymentMethods = await db.paymentMethod.findMany({
    where: { companyId },
  });
  const products = (await db.inventoryProduct.findMany({
    where: { companyId, type: "Product" },
  })) as (InventoryProduct & { tags: Tag[] })[];

  // TODO: try to improve this query
  const materials = (await db.material.findMany({
    where: { companyId, invoiceId: null },
  })) as (Material & { tags: Tag[] })[];

  const labors = (await db.labor.findMany({
    where: { companyId, cannedLabor: true },
  })) as (Labor & { tags: Tag[] })[];

  const productTags = await db.inventoryProductTag.findMany({
    where: {
      inventoryId: { in: products.map((product) => product.id) },
    },
    include: { tag: true },
  });

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

  return (
    <div className="gap-3 space-y-4 overflow-clip py-2 md:-my-2 md:min-h-[93vh] lg:grid lg:grid-cols-[1fr,24rem] lg:grid-rows-[auto,auto,1fr] lg:space-y-0">
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
      <div>
        <ConvertButton
          type={InvoiceType.Estimate}
          text="Save as Estimate"
          className="border-none bg-[#6470FF] text-white"
          icon={<EstimateLogo />}
        />
      </div>

      <Header />

      <Tabs
        defaultValue="create"
        className="col-start-1 flex min-h-0 flex-col overflow-clip"
      >
        <TabsList className="grid grid-cols-4 md:inline-flex">
          <TabsTrigger value="payments" className="order-4 md:order-1">
            Payments
          </TabsTrigger>
          <TabsTrigger value="inspections" className="order-3 md:order-2">
            Inspections
          </TabsTrigger>
          <TabsTrigger value="attachment" className="order-2 md:order-3">
            Attachment
          </TabsTrigger>
          <TabsTrigger value="create" className="order-1 md:order-4">
            Create
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="h-auto w-full">
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

      <div className="app-shadow col-start-2 row-start-2 row-end-4 grid grid-rows-[1fr,auto,auto] divide-y rounded-md md:min-h-[85vh]">
        <Create />
        <BillSummary />
      </div>
    </div>
  );
}
