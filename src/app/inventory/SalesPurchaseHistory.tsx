import { db } from "@/lib/db";
import SalesPurchaseHistoryClient from "./SalesPurchaseHistoryClient";
import { Client, InventoryProductHistory, Vendor } from "@prisma/client";

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
  // @ts-ignore
  const histories: (InventoryProductHistory & {
    vendor: Vendor | null;
    client: Client | null;
  })[] = productId
    ? await db.inventoryProductHistory.findMany({
        where: { productId },
        orderBy: { date: "desc" },
        include: { vendor: true },
      })
    : [];

  // add `client` to each history
  for (const history of histories) {
    if (history.invoiceId) {
      const invoice = await db.invoice.findUnique({
        where: { id: history.invoiceId },
        include: { client: true },
      });
      history.client = invoice?.client || null;
    }
  }

  return (
    <SalesPurchaseHistoryClient histories={histories} product={product!} />
  );
}
