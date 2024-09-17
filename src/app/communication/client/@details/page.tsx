import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import { convert } from "html-to-text";
import DetailsComponent from "./DetailsComponent";
import { Service } from "@prisma/client";

export const dynamic = "force-dynamic";

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

export default async function Details({
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
    return <></>;
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

  console.log("From the details page");

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
