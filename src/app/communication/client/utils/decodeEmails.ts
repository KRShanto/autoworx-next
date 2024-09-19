import { convert } from "html-to-text";
import { EmailMessage, MessagePart } from "./types";

// Decodes email messages
export function decodeEmails(message: EmailMessage): string {
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
