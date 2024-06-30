import { db } from "@/lib/db";
import QRCode from "qrcode";
import React from "react";
import { FaPrint } from "react-icons/fa6";
import ReplenishProductForm from "./ReplenishProductForm";
import SalesPurchaseHistory from "./SalesPurchaseHistory";
import UseProductForm from "./UseProductForm";

export default async function Sidebar({ productId }: { productId: number }) {
  const product = productId
    ? await db.inventoryProduct.findUnique({ where: { id: productId } })
    : null;

  const imgUrl = product
    ? await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_APP_URL}inventory/use/${product.id}`,
      )
    : null;

  return (
    <div className="mt-12 h-[88.5%] w-1/2 flex flex-col">
      <div className="#h-[35%] flex gap-4">
        <div className="flex flex-col justify-between">
          <div className="app-shadow rounded-lg bg-white py-2 2xl:py-6 px-6">
            {product ? (
              <div className="#h-16 #w-32 px-2 py-0 2xl:p-4">
                <h3 className="text-md text-nowrap text-center font-semibold 2xl:text-2xl">
                  Total Value
                </h3>
                <p className="mt-2 text-center text-2xl font-bold 2xl:text-4xl">
                  $
                  {parseFloat(product?.price?.toString() || "0") *
                    parseFloat(product?.quantity?.toString() || "0")}
                </p>
              </div>
            ) : (
              <div className="h-16 w-32"></div>
            )}
          </div>
          <div className="app-shadow mt-4 rounded-lg bg-white p-6 px-6">
            {product ? (
              <div className="#h-16 #w-32 px-2 py-0 2xl:p-4">
                <h3 className="text-md text-center font-semibold 2xl:text-2xl">
                  Price
                </h3>
                <p className="mt-2 text-nowrap text-center text-2xl font-bold 2xl:text-3xl">
                  ${parseFloat(product?.price?.toString()!)}
                  <span className="text-base">/{product.unit}</span>
                </p>
              </div>
            ) : (
              <div className="h-16 w-32"></div>
            )}
          </div>
        </div>
        <div className="app-shadow w-full rounded-lg bg-white p-4 text-xs 2xl:text-base">
          {product ? (
            <>
              <div className="flex gap-4">
                <div className="w-[70%]">
                  <h3 className="text-lg font-semibold">Inventory Details</h3>
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
                  <div>
                    {imgUrl && (
                      //  eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgUrl}
                        alt="qr code"
                        className="mx-auto h-24 w-24"
                      />
                    )}
                  </div>
                  <a
                    className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-md border border-slate-400 p-1 px-3"
                    href={imgUrl!}
                    download={`${product.name} Qrcode.png`}
                  >
                    <FaPrint className="text-sm" />
                    Print
                  </a>
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
