import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { fetchClientData } from "../utils/fetchClientsData";
import { getConversations } from "../utils/getConversations";
import BoxComponent from "./BoxComponent";

export default async function Box({
  searchParams,
}: {
  searchParams: { clientId: string };
}) {
  const clientId = searchParams.clientId;
  const user = await getUser();
  const { client, company } = await fetchClientData(clientId);

  if (!client || !company) {
    return <></>;
  }

  const conversations = await getConversations(clientId);

  const allSms = await db.clientSMS.findMany({
    where: {
      clientId: parseInt(clientId),
      companyId: user.companyId,
    },
  });

  return (
    <BoxComponent
      conversations={conversations}
      allSms={allSms}
      client={client}
      clientId={parseInt(clientId)}
    />
  );
}
