import { getPermissionsForRole } from "@/actions/settings/teamManagement";
import { SyncLists } from "@/components/SyncLists";
import Title from "@/components/Title";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import getPermissions from "@/lib/getPermissions";
import getUser from "@/lib/getUser";
import { PermissionForManager, PermissionForSales } from "@prisma/client";
import { redirect } from "next/navigation";
import AddNewProduct from "./AddNewProduct";
import InventoryList from "./InventoryList";
import Sidebar from "./Sidebar";

export default async function Page({
  searchParams: { productId },
}: {
  searchParams: { productId: string };
}) {
  const companyId = await getCompanyId();

  const supplies = await db.inventoryProduct.findMany({
    where: { companyId, type: "Supply" },
    include: {
      category: true,
      vendor: true,
    },
  });

  const products = await db.inventoryProduct.findMany({
    where: { companyId, type: "Product" },
    include: {
      category: true,
      vendor: true,
    },
  });

  const categories = await db.category.findMany({
    where: { companyId },
  });

  const vendors = await db.vendor.findMany({
    where: { companyId },
  });

  const user = await getUser();

  return (
    <div className="h-full w-full">
      <SyncLists categories={categories} vendors={vendors} />

      <header className="flex justify-between">
        <Title>Inventory</Title>
        {(user?.employeeType === "Admin" ||
          user?.employeeType === "Manager") && <AddNewProduct />}
      </header>

      <div className="flex h-full w-full justify-between gap-3">
        <InventoryList
          products={products}
          supplies={supplies}
          productId={parseInt(productId)}
        />

        <Sidebar productId={parseInt(productId)} />
      </div>
    </div>
  );
}
