import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { Client, InventoryProductHistory, User, Vendor } from "@prisma/client";
import SalesPurchaseHistoryClient from "./SalesPurchaseHistoryClient";

export default async function SalesPurchaseHistory({
  user,
  productId,
  invoiceIds,
}: {
  user: User;
  productId: number | undefined;
  invoiceIds: string[];
}) {
  const product = productId
    ? await db.inventoryProduct.findUnique({
        where: { id: productId },
        include: { User: true },
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
    <SalesPurchaseHistoryClient
      user={user}
      histories={histories}
      product={product!}
      invoiceIds={invoiceIds}
    />
  );
}
