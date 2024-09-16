"use client";
import Title from "@/components/Title";
import { convert } from "html-to-text";
import { Metadata } from "next";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getVehicles } from "../actions/actions";
import Details from "./Details";
import List from "./List";
import MessageBox from "./MessageBox";

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

// Helper functions
const decodeBase64Url = (str: string): string => {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
};

const extractPlainText = (parts: MessagePart[] | undefined): string => {
  let text = "";

  if (!parts) return text;

  for (const part of parts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      text += decodeBase64Url(part.body.data);
    } else if (part.parts) {
      text += extractPlainText(part.parts);
    }
  }

  return text;
};

const extractHtml = (parts: MessagePart[] | undefined): string => {
  let html = "";

  if (!parts) return html;

  for (const part of parts) {
    if (part.mimeType === "text/html" && part.body?.data) {
      html += decodeBase64Url(part.body.data);
    } else if (part.parts) {
      html += extractHtml(part.parts);
    }
  }

  return html;
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

// React Component
export default function Page({
  params,
}: {
  params: { clientId: string };
}): JSX.Element {
  const [conversations, setConversations] = useState<DecodedEmail[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [base64Data, setBase64Data] = useState("");
  const router = useRouter();
  async function getEmails(clientId: string) {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/communication/client?clientId=${decodeURIComponent(clientId)}`,
      );

      const data: EmailData[] = await res.json();
      console.log("🚀 ~ getEmails ~ data:", data);
      setLoading(false);

      const emailsWithBody = data?.map((emailData) => {
        let body = decodeEmails(emailData) || "";
        return {
          ...emailData,
          body,
        };
      });
      console.log("🚀 ~ emailsWithBody ~ emailsWithBody:", emailsWithBody);

      setConversations(emailsWithBody);
    } catch (error) {
      setLoading(false);
      router.push("/communication/client");
    }
  }

  useEffect(() => {
    getEmails(params.clientId);
    getVehicles(params.clientId)
      .then((res) => {
        setVehicles(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params]);

  return (
    <div>
      <Title>Communication Hub - Client</Title>

      <div className="mt-5 flex justify-around">
        <List id={params.clientId} />
        <MessageBox
          conversations={conversations}
          clientId={params.clientId}
          loading={loading}
          base64Data={base64Data}
          setBase64Data={setBase64Data}
          setConversations={setConversations}
        />
        <Details
          id={params.clientId}
          conversations={conversations}
          vehicles={vehicles}
          clientId={parseInt(params.clientId)}
        />
      </div>
    </div>
  );
}
