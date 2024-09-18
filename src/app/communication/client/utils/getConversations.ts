import { Conversation } from "./types";
import { decodeEmails } from "./decodeEmails";
import { MessagePart } from "./types";

type EmailData = {
  id: string;
  payload: {
    mimeType: string;
    parts: MessagePart[];
    body?: {
      data?: string;
    };
  };
};

export async function getConversations(
  clientId: string,
): Promise<Conversation[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/communication/client?clientId=${clientId}`,
  );

  const data: EmailData[] = await res.json();

  const conversations = data?.map((emailData) => {
    const body = decodeEmails(emailData) || "";
    return {
      ...emailData,
      body,
    };
  });

  return conversations;
}
