import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getCompanyId } from "@/lib/companyId";

export async function fetchClientData(clientId: string) {
  if (!clientId) {
    return { client: null, company: null };
  }

  const client = await db.client.findFirst({
    where: { id: parseInt(clientId) },
  });

  if (!client) {
    return { client: null, company: null };
  }

  const companyId = await getCompanyId();
  const company = await db.company.findFirst({
    where: { id: companyId },
  });

  if (!company?.googleRefreshToken) {
    redirect("/settings/communications");
  }

  return { client, company };
}
