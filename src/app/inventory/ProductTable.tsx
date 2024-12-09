"use client";

import { deleteInventory } from "@/actions/inventory/delete";
import { cn } from "@/lib/cn";
import getUser from "@/lib/getUser";
import { useInventoryFilterStore } from "@/stores/inventoryFilter";
import { Category, InventoryProduct, User, Vendor } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { userAgent } from "next/server";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import EditProduct from "./EditProduct";
const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default function ProductTable({
  currentProductId,
  products,
}: {
  currentProductId: number | undefined;
  products: (InventoryProduct & {
    category: Category;
    vendor: Vendor;
    User?: User;
  })[];
}) {
  const router = useRouter();
  const search = useSearchParams();
  async function getUserInfo() {
    getUser().then((user) => {
      setUser(user);
    });
  }
  const { search: productSearch, category } = useInventoryFilterStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const filtered = products.filter((product) => {
      if (
        productSearch &&
        !product.name.toLowerCase().includes(productSearch.toLowerCase())
      ) {
        return false;
      }
      if (category && !product.category) {
        return false;
      }
      if (category && product.category.name !== category) {
        return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  }, [productSearch, category, products]);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="h-[95%] overflow-auto">
      <table className="w-full">
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="px-4 text-left 2xl:px-10">#</th>
            <th className="px-4 text-left 2xl:px-10">Name</th>
            <th className="px-4 text-left 2xl:px-10">Category</th>
            <th className="px-4 text-left 2xl:px-10">Quantity</th>
            <th className="px-4 text-left 2xl:px-10">Unit</th>
            {(user?.employeeType === "Admin" ||
              user?.employeeType === "Manager") && (
              <th className="px-4 text-left 2xl:px-10">Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product, index) => (
            <tr
              key={product.id}
              className={cn(
                "cursor-pointer rounded-md py-3",
                index % 2 === 0 ? evenColor : oddColor,
                currentProductId === product.id && "border-2 border-[#6571FF]",
              )}
              onClick={() =>
                router.push(
                  `/inventory?view=${search.get("view")}&productId=${product.id}`,
                )
              }
            >
              <td className="h-12 px-4 text-left 2xl:px-10">
                <p>{product.id}</p>
              </td>
              <td className="text-nowrap px-4 text-left 2xl:px-10">
                {product.name}
              </td>
              <td className="text-nowrap px-4 text-left 2xl:px-10">
                {product.category?.name}
              </td>
              <td className="px-4 text-left 2xl:px-10">{product.quantity}</td>
              <td className="px-4 text-left 2xl:px-10">{product.unit}</td>
              {(user?.employeeType === "Admin" ||
                user?.employeeType === "Manager") && (
                <td className="item-center mt-2 flex gap-3 px-4 2xl:px-10">
                  <button className="text-2xl text-blue-600">
                    <EditProduct productData={product} />
                  </button>
                  <button
                    className="text-xl text-red-400"
                    onClick={async () => {
                      await deleteInventory(product.id);
                      router.push(`/inventory?view=${search.get("view")}`);
                    }}
                  >
                    <FaTimes />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
