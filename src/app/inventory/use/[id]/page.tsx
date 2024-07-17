import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";
import UseProductForm from "../../UseProductForm";
import ReplenishProductForm from "../../ReplenishProductForm";
import { getCompanyId } from "@/lib/companyId";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id) return notFound();

  const companyId = await getCompanyId();

  const productId = parseInt(id);
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
  });
  const invoices = await db.invoice.findMany({
    where: { companyId, type: "Invoice" },
    select: { id: true },
  });
  const lastHistory = await db.inventoryProductHistory.findFirst({
    where: { productId },
    orderBy: { date: "desc" },
  });

  if (!product) return notFound();

  return (
    <div className="app-shadow mx-auto mt-10 w-[60rem] rounded-lg bg-white p-4">
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
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-3">
        <UseProductForm
          productId={productId}
          invoiceIds={invoices.map((invoice) => invoice.id)}
          cost={parseInt(lastHistory?.price?.toString() || "0")}
        />
        <ReplenishProductForm productId={productId} />
      </div>
    </div>
  );
}
