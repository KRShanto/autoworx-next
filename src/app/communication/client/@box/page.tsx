import { db } from "@/lib/db";
import { convert } from "html-to-text";
import BoxComponent from "./BoxComponent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCompanyId } from "@/lib/companyId";

// Type Definitions
type MessagePart = {
  mimeType: string;
  body?: {
    data?: string;
    attachmentId?: string;
  };
  parts?: MessagePart[];
};

type EmailMessage = {
  payload: {
    mimeType: string;
    parts?: MessagePart[];
    body?: {
      data?: string;
    };
  };
  internalDate?: string;
};

type DecodedEmail = {
  body: string;
  [key: string]: any;
};

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

// TODO: Define Conversation type
export type Conversation = any;

// Decodes email messages
function decodeEmails(message: EmailMessage): string {
  let body = "";

  function findPlainTextOrHtml(parts: MessagePart[]): {
    plainText: string;
    htmlText: string;
  } {
    let plainText = "";
    let htmlText = "";

    parts.forEach((part) => {
      if (part.mimeType === "text/plain") {
        plainText = part.body?.data || "";
      } else if (part.mimeType === "text/html") {
        htmlText = part.body?.data || "";
      } else if (part.mimeType === "multipart/alternative") {
        const result = findPlainTextOrHtml(part.parts || []);
        if (result.plainText) plainText = result.plainText;
        if (result.htmlText) htmlText = result.htmlText;
      }
    });

    return { plainText, htmlText };
  }

  if (
    message.payload.mimeType === "multipart/alternative" ||
    message.payload.mimeType === "multipart/mixed"
  ) {
    const result = findPlainTextOrHtml(message.payload.parts || []);
    body = result.plainText || result.htmlText;
  } else if (message.payload.parts) {
    const result = findPlainTextOrHtml(message.payload.parts);
    body = result.plainText || result.htmlText;
  } else if (message.payload.body?.data) {
    body = message.payload.body.data;
  }

  body = Buffer.from(body, "base64").toString("utf-8");
  return convert(body);
}

export default async function Box({
  searchParams,
}: {
  searchParams: { clientId: string };
}) {
  const clientId = searchParams.clientId;

  if (!clientId) {
    return <></>;
  }

  const client = await db.client.findFirst({
    where: { id: parseInt(clientId) },
  });

  if (!client) {
    return <></>;
  }

  const companyId = await getCompanyId();
  const company = await db.company.findFirst({
    where: { id: companyId },
  });
  if (!company?.googleRefreshToken) {
    // TODO: Show message to connect to Gmail
    redirect("/settings/communications");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/communication/client?clientId=${clientId}`,
  );

  const data: EmailData[] = await res.json();

  const conversations = data?.map((emailData) => {
    let body = decodeEmails(emailData) || "";
    return {
      ...emailData,
      body,
    };
  });

  return (
    <BoxComponent
      conversations={conversations}
      client={client}
      clientId={parseInt(clientId)}
    />
  );
}
