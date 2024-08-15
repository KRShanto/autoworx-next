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
      })
    : undefined;
  const history = productId
    ? await db.inventoryProductHistory.findMany({
        where: { productId },
        orderBy: { date: "desc" },
        include: { vendor: true },
      })
    : [];

  return <SalesPurchaseHistoryClient histories={history} product={product!} />;
}
