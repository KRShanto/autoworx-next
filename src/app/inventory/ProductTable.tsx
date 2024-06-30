"use client";

import { cn } from "@/lib/cn";
import { Category, InventoryProduct } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import EditProduct from "./EditProduct";

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default function ProductTable({
  currentProductId,
  products,
}: {
  currentProductId: number | undefined;
  products: (InventoryProduct & { category: Category })[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div>
      <table className="w-full">
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="px-10 text-left">#</th>
            <th className="px-10 text-left">Name</th>
            <th className="px-10 text-left">Category</th>
            <th className="px-10 text-left">Quantity</th>
            <th className="px-10 text-left">Unit</th>
            <th className="px-10 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={cn(
                "cursor-pointer rounded-md py-3",
                index % 2 === 0 ? evenColor : oddColor,
                currentProductId === product.id && "border-2 border-[#6571FF]",
              )}
              onClick={() => router.push(`/inventory?productId=${product.id}`)}
            >
              <td className="h-12 px-10 text-left">
                <p>{product.id}</p>
              </td>
              <td className="text-nowrap px-10 text-left">{product.name}</td>
              <td className="text-nowrap px-10 text-left">
                {product.category?.name}
              </td>
              <td className="px-10 text-left">{product.quantity}</td>
              <td className="px-10 text-left">{product.unit}</td>
              <td className="item-center mt-2 flex gap-3 px-10">
                <button className="text-2xl text-blue-600">
                  <EditProduct currentProductId={product?.id as number} />
                </button>
                <button className="text-xl text-red-400">
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
