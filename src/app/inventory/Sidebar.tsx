import { db } from "@/lib/db";
import React from "react";
import { FaPrint } from "react-icons/fa6";
import UseProductForm from "./UseProductForm";
import SalesPurchaseHistory from "./SalesPurchaseHistory";
import ReplenishProductForm from "./ReplenishProductForm";

export default async function Sidebar({ productId }: { productId: number }) {
  const product = productId
    ? await db.inventoryProduct.findUnique({ where: { id: productId } })
    : null;

  return (
    <div className="mt-12 h-[88.5%] w-full">
      <div className="flex h-[35%] gap-4">
        <div className="flex flex-col justify-between">
          <div className="app-shadow rounded-lg bg-white p-6 px-6">
            {product ? (
              <div className="h-16 w-32">
                <h3 className="text-nowrap text-center font-semibold">
                  Total Value
                </h3>
                <p className="mt-2 text-center text-4xl font-bold">
                  $
                  {parseFloat(product?.price?.toString() || "0") *
                    parseFloat(product?.quantity?.toString() || "0")}
                </p>
              </div>
            ) : (
              <div className="h-16 w-32"></div>
            )}
          </div>
          <div className="app-shadow rounded-lg bg-white p-6 px-6">
            {product ? (
              <div className="h-16 w-32">
                <h3 className="text-center font-semibold">Price</h3>
                <p className="mt-2 text-nowrap text-center text-3xl font-bold">
                  ${parseFloat(product?.price?.toString()!)}
                  <span className="text-base">/{product.unit}</span>
                </p>
              </div>
            ) : (
              <div className="h-16 w-32"></div>
            )}
          </div>
        </div>
        <div className="app-shadow w-full rounded-lg bg-white p-4">
          <h3 className="text-lg font-semibold">Inventory Details</h3>

          {product ? (
            <>
              <div className="flex gap-4">
                <div className="w-[70%]">
                  <p className="mt-2">
                    <span className="font-semibold">Name: </span> {product.name}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Type: </span> {product.type}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Description: </span>{" "}
                    {product.description}
                  </p>
                </div>
                <div className="w-[30%]">
                  <p className="text-nowrap text-center font-semibold">
                    {product.quantity} {product.unit} remaining
                  </p>
                  {/* qr code */}
                  <div></div>
                  <button className="mx-auto mt-3 flex items-center gap-1 rounded-md border border-slate-400 p-1 px-3">
                    <FaPrint className="text-sm" />
                    Print
                  </button>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-3">
                <UseProductForm productId={productId} />
                <ReplenishProductForm productId={productId} />
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <SalesPurchaseHistory productId={productId} />
    </div>
  );
}
