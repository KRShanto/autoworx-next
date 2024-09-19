import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import ListComponent from "./ListComponent";
import { Suspense } from "react";

export default async function ListPage({
  searchParams,
}: {
  searchParams: { clientId: string };
}) {
  const clientId = searchParams.clientId;
  if (!clientId) {
    // return nothing. the page.tsx will handle this.
    return <></>;
  }

  const companyId = await getCompanyId();
  const clients = await db.client.findMany({
    where: { companyId },
  });

  return <ListComponent clients={clients} id={clientId} />;
}
