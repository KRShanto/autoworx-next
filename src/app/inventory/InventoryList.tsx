"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductTable from "./ProductTable";
import Sidebar from "./Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import SearchFilter from "./SearchFilter";

export default function InventoryList({
  products,
  supplies,
  productId,
}: {
  products: any;
  supplies: any;
  productId: number;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const view = search.get("view") || "products";

  return (
    <Tabs
      value={view}
      className="col-start-1 mt-3 flex h-[93%] min-h-0 w-1/2 flex-col overflow-clip text-xs 2xl:text-base"
    >
      <TabsList>
        <TabsTrigger
          value="procurement"
          onClick={() => router.push("/inventory?view=procurement")}
        >
          Procurement
        </TabsTrigger>
        <TabsTrigger
          value="supplies"
          onClick={() => router.push("/inventory?view=supplies")}
        >
          Supplies
        </TabsTrigger>
        <TabsTrigger
          value="products"
          onClick={() => router.push("/inventory?view=products")}
        >
          Products
        </TabsTrigger>
      </TabsList>

      <TabsContent value="procurement">
        <p>Procurement</p>
      </TabsContent>

      <TabsContent value="products" className="#overflow-x-scroll">
        <SearchFilter />
        <ProductTable products={products as any} currentProductId={productId} />
      </TabsContent>

      <TabsContent value="supplies">
        <SearchFilter />
        <ProductTable products={supplies as any} currentProductId={productId} />
      </TabsContent>
    </Tabs>
  );
}
