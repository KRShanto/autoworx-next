import BoxComponent from "./BoxComponent";
import { getConversations } from "../utils/getConversations";
import { fetchClientData } from "../utils/fetchClientsData";

export default async function Box({
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

  return (
    <BoxComponent
      conversations={conversations}
      client={client}
      clientId={parseInt(clientId)}
    />
  );
}
