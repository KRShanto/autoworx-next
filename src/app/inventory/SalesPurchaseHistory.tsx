import { db } from "@/lib/db";
import SalesPurchaseHistoryClient from "./SalesPurchaseHistoryClient";

export default async function SalesPurchaseHistory({
  productId,
}: {
  productId: number | undefined;
}) {
  const product = productId
    ? await db.inventoryProduct.findUnique({
        where: { id: productId },
        select: { vendor: true, price: true, quantity: true },
      })
    : undefined;
  const history = productId
    ? await db.inventoryProductHistory.findMany({
        where: { productId },
        orderBy: { date: "desc" },
      })
    : [];

  return (
    <SalesPurchaseHistoryClient
      histories={history}
      vendorName={product?.vendor?.name || ""}
      price={product?.price as any}
      productId={productId}
    />
  );
}
