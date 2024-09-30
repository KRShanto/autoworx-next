import { db } from "@/lib/db";
import QRCode from "qrcode";
import React from "react";
import { FaPrint } from "react-icons/fa6";
import ReplenishProductForm from "./ReplenishProductForm";
import SalesPurchaseHistory from "./SalesPurchaseHistory";
import UseProductForm from "./UseProductForm";
import { getCompanyId } from "@/lib/companyId";
import { FaCircleExclamation } from "react-icons/fa6";
import QRcode from "./QRcode";
import { env } from "next-runtime-env";

export default async function Sidebar({ productId }: { productId: number }) {
  const companyId = await getCompanyId();

  const product = productId
    ? await db.inventoryProduct.findUnique({ where: { id: productId } })
    : null;

  // Find the last history for this product
  const lastHistory = productId
    ? await db.inventoryProductHistory.findFirst({
        where: { productId },
        orderBy: { date: "desc" },
      })
    : null;

  const imgUrl = product
    ? await QRCode.toDataURL(
        `${env("NEXT_PUBLIC_APP_URL")}/inventory/use/${product.id}`,
      )
    : null;

  const invoices = await db.invoice.findMany({
    where: { companyId, type: "Invoice" },
    select: { id: true },
  });

  const isWarningForQuantity =
    product && (product.quantity || 0) <= (product.lowInventoryAlert || 1);

  return (
    <div className="mt-12 flex h-[88.5%] w-1/2 flex-col">
      <div className="#h-[35%] flex gap-4">
        <div className="flex flex-col justify-between">
          <div className="app-shadow rounded-lg bg-white px-6 py-2 2xl:py-6">
            <div className="#h-16 #w-32 px-2 py-0 2xl:p-4">
              <h3 className="text-md text-nowrap text-center font-semibold 2xl:text-2xl">
                Total Value
              </h3>
              <p className="mt-2 text-center text-2xl font-bold 2xl:text-4xl">
                {product && (
                  <>
                    $
                    {parseFloat(product?.price?.toString() || "0") *
                      parseFloat(product?.quantity?.toString() || "0")}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="app-shadow mt-4 rounded-lg bg-white p-6 px-6">
            <div className="#h-16 #w-32 px-2 py-0 2xl:p-4">
              <h3 className="text-md text-center font-semibold 2xl:text-2xl">
                Price
              </h3>
              <p className="mt-2 text-nowrap text-center text-2xl font-bold 2xl:text-3xl">
                {product && (
                  <>
                    ${parseFloat(product?.price?.toString()!)}
                    <span className="text-base">/{product.unit}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="app-shadow w-full rounded-lg bg-white p-4 text-xs 2xl:text-base">
          <>
            <div className="grid grid-cols-5">
              <div className="col-span-2">
                <h3 className="text-lg font-semibold">Inventory Details</h3>
                <p className="mt-2">
                  <span className="font-semibold">Name: </span>{" "}
                  {product && product.name}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Type: </span>{" "}
                  {product && product.type}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Description: </span>{" "}
                  {product && product.description}
                </p>
              </div>
              {product && (
                <div className="col-span-3 grid grid-cols-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative text-nowrap rounded-lg border p-4 text-center font-semibold">
                      {isWarningForQuantity && (
                        <div className="absolute right-2 top-2">
                          <FaCircleExclamation className="text-2xl text-red-600" />
                        </div>
                      )}
                      <div>
                        <span className="text-6xl">{product.quantity}</span>
                        <span>/{product.unit}</span>
                      </div>
                      <span>Remaining</span>
                    </div>
                    <div className="mt-3 flex flex-col space-y-2">
                      <UseProductForm
                        productId={productId}
                        invoiceIds={invoices.map((invoice) => invoice.id)}
                        cost={parseInt(lastHistory?.price?.toString() || "0")}
                      />
                      <ReplenishProductForm productId={productId} />
                    </div>
                  </div>
                  {/* qr code */}
                  <div>
                    <div>
                      {imgUrl && (
                        //  eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgUrl}
                          alt="qr code"
                          className="mx-auto h-40 w-40 rounded-lg border border-gray-500 p-0.5"
                        />
                      )}
                    </div>
                    {/* <a
                      className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-md border border-slate-400 p-1 px-3"
                      href={imgUrl!}
                      download={`${product && product.name} Qrcode.png`}
                    >
                      <FaPrint className="text-sm" />
                      Print
                    </a> */}
                    <QRcode imgUrl={imgUrl!} />
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      </div>

      <SalesPurchaseHistory productId={productId} />
    </div>
  );
}
