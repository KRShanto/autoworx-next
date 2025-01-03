"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { User } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import ProductTable from "./ProductTable";
import SearchFilter from "./SearchFilter";
import Sidebar from "./Sidebar";
import { useEffect } from "react";

export default function InventoryList({
  products,
  supplies,
  productId,
  user,
}: {
  products: any;
  supplies: any;
  productId: number;
  user: User;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const view = search.get("view") ?? "products";

  useEffect(() => {
    if (!search.get("view")) {
      router.push("/inventory?view=products");
    }
  }, [search, router]);

  return (
    <Tabs
      value={view}
      className="col-start-1 mt-3 flex h-[93%] min-h-0 w-full flex-col overflow-clip text-xs md:w-1/2 2xl:text-base"
    >
      <TabsList>
        {/* TODO: comment this for now. */}
        {/* <TabsTrigger
          value="procurement"
          onClick={() => router.push("/inventory?view=procurement")}
        >
          Procurement
        </TabsTrigger> */}

        {(user.employeeType === "Admin" || user.employeeType === "Manager") && (
          <TabsTrigger
            value="supplies"
            onClick={() => router.push("/inventory?view=supplies")}
          >
            Supplies
          </TabsTrigger>
        )}
        {user.employeeType !== "Technician" && (
          <TabsTrigger
            value="products"
            onClick={() => router.push("/inventory?view=products")}
          >
            Products
          </TabsTrigger>
        )}
      </TabsList>

      {/* <TabsContent value="procurement">
        <p>Procurement</p>
      </TabsContent> */}

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
