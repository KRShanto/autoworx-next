import { db } from "@/lib/db";
import SalesPurchaseHistoryClient from "./SalesPurchaseHistoryClient";

export default async function SalesPurchaseHistory({
  productId,
}: {
  productId: number;
}) {
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
    select: { vendor: true, price: true, quantity: true },
  });
  const history = await db.inventoryProductHistory.findMany({
    where: { productId },
    orderBy: { date: "desc" },
  });

  return (
    <SalesPurchaseHistoryClient
      histories={history}
      vendorName={product?.vendor?.name || ""}
      price={product?.price as any}
      productId={productId}
    />
  );
}
