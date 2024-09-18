import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import DetailsComponent from "./DetailsComponent";
import { Service } from "@prisma/client";
import { getConversations } from "../utils/getConversations";
import { fetchClientData } from "../utils/fetchClientsData";

export default async function Details({
  searchParams,
}: {
  searchParams: { clientId: string };
}) {
  const clientId = searchParams.clientId;

  const { client, company } = await fetchClientData(clientId);

  if (!client || !company) {
    return <></>;
  }

  const conversations = await getConversations(clientId);

  const invoices = await db.invoice.findMany({
    where: { clientId: parseInt(clientId) },
    include: {
      invoiceItems: {
        include: { service: true },
      },
    },
  });
  const invoiceServices = invoices.map((invoice) =>
    invoice.invoiceItems.map((item) => item.service),
  );

  const services = invoiceServices
    .flat()
    .filter((service): service is Service => service !== null);

  const estimates = await db.invoice.findMany({
    where: { clientId: parseInt(clientId) },
  });

  const vehicles = await db.vehicle.findMany({
    where: { clientId: parseInt(clientId) },
  });

  return (
    <DetailsComponent
      conversations={conversations}
      client={client}
      services={services}
      vehicles={vehicles}
      estimates={estimates}
    />
  );
}
