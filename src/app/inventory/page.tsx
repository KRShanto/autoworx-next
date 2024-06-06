import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import AddNewProduct from "./AddNewProduct";
import { db } from "@/lib/db";
import { SyncLists } from "@/components/SyncLists";
import Sidebar from "./Sidebar";
import { getCompanyId } from "@/lib/companyId";
import ProductTable from "./ProductTable";

export default async function Page({
  searchParams: { productId },
}: {
  searchParams: { productId: string };
}) {
  const companyId = await getCompanyId();
  const supplies = await db.inventoryProduct.findMany({
    where: { companyId, type: "Supply" },
    select: {
      category: true,
      name: true,
      quantity: true,
      unit: true,
      id: true,
    },
  });
  const products = await db.inventoryProduct.findMany({
    where: { companyId, type: "Product" },
    select: {
      category: true,
      name: true,
      quantity: true,
      unit: true,
      id: true,
    },
  });

  const categories = await db.category.findMany({
    where: { companyId },
  });

  return (
    <div className="h-full">
      <SyncLists categories={categories} />

      <header className="flex justify-between">
        <Title>Inventory</Title>
        <AddNewProduct />
      </header>

      <div className="flex h-full w-full justify-between gap-3">
        <Tabs
          defaultValue="supplies"
          className="col-start-1 mt-3 flex h-[93%] min-h-0 flex-col overflow-clip"
        >
          <TabsList>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="supplies">Supplies</TabsTrigger>
          </TabsList>

          <TabsContent value="procurement">
            <p>Procurement</p>
          </TabsContent>

          <TabsContent value="products">
            <ProductTable
              products={products as any}
              currentProductId={parseInt(productId)}
            />
          </TabsContent>

          <TabsContent value="supplies">
            <ProductTable
              products={supplies as any}
              currentProductId={parseInt(productId)}
            />
          </TabsContent>
        </Tabs>

        <Sidebar productId={parseInt(productId)} />
      </div>
    </div>
  );
}
