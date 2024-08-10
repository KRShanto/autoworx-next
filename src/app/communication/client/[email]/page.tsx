// "use client";
// import Title from "@/components/Title";
// import { convert } from "html-to-text";
// import { Metadata } from "next";
// import React, { useEffect, useState } from "react";
// import Details from "./Details";
// import List from "./List";
// import MessageBox from "./MessageBox";
// const decodeBase64Url = (str: any) => {
//   const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
//   return Buffer.from(base64, "base64").toString("utf-8");
// };

// const extractPlainText = (parts: any) => {
//   let text = "";

//   if (!parts) return text;

//   for (const part of parts) {
//     if (part.mimeType === "text/plain" && part.body?.data) {
//       text += decodeBase64Url(part.body.data);
//     } else if (part.parts) {
//       text += extractPlainText(part.parts);
//     }
//   }

//   return text;
// };

// const extractHtml = (parts: any) => {
//   let html = "";

//   if (!parts) return html;

//   for (const part of parts) {
//     if (part.mimeType === "text/html" && part.body?.data) {
//       html += decodeBase64Url(part.body.data);
//     } else if (part.parts) {
//       html += extractHtml(part.parts);
//     }
//   }

//   return html;
// };

// // export const metadata: Metadata = {
// //   title: "Communication Hub - Client",
// // };

// function decodeEmails(message: any) {
//   let body = "";

//   function findPlainTextOrHtml(parts) {
//     let plainText = "";
//     let htmlText = "";

//     parts.forEach((part) => {
//       if (part.mimeType === "text/plain") {
//         plainText = part.body.data;
//       } else if (part.mimeType === "text/html") {
//         htmlText = part.body.data;
//       } else if (part.mimeType === "multipart/alternative") {
//         // Recursively process multipart/alternative within multipart/mixed
//         const result = findPlainTextOrHtml(part.parts);
//         if (result.plainText) plainText = result.plainText;
//         if (result.htmlText) htmlText = result.htmlText;
//       }
//     });

//     return { plainText, htmlText };
//   }

//   if (
//     message.payload.mimeType === "multipart/alternative" ||
//     message.payload.mimeType === "multipart/mixed"
//   ) {
//     const result = findPlainTextOrHtml(message.payload.parts);
//     body = result.plainText || result.htmlText;
//   } else if (message.payload.parts) {
//     // Handle other multipart types or simple text/html parts
//     const result = findPlainTextOrHtml(message.payload.parts);
//     body = result.plainText || result.htmlText;
//   } else if (message.payload.body && message.payload.body.data) {
//     // Handle non-multipart message
//     body = message.payload.body.data;
//   }

//   // Decode the body from base64url format
//   body = Buffer.from(body, "base64").toString("utf-8");
//   return convert(body);
// }

// // TODO: handle `id` not found
// export default function Page({ params }: { params: { email: string } }) {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   async function getEmails(email: string) {
//     setLoading(true);
//     const res = await fetch(
//       `/api/communication/client?email=${decodeURIComponent(email)}`,
//     );

//     const data = await res.json();
//     setLoading(false);

//     // console.log("🚀 ~ getEmails ~ data:", data);
//     // const emailsWithBody = data?.map((emailData: any) => {
//     //   console.log("🚀 ~ emailsWithBody ~ emailData:", emailData);
//     //   let body = extractPlainText(emailData?.payload?.parts) || "";
//     //   let html = extractHtml(emailData?.payload?.parts) || "";
//     //   return {
//     //     ...emailData,
//     //     body,
//     //     html,
//     //   };
//     // });
//     const emailsWithBody = data?.map((emailData: any) => {
//       console.log("🚀 ~ emailsWithBody ~ emailData:", emailData);
//       let body = decodeEmails(emailData) || "";
//       // let html = extractHtml(emailData?.payload?.parts) || "";
//       return {
//         ...emailData,
//         body,
//         // html,
//       };
//     });

//     setConversations(emailsWithBody);
//     console.log("emailsWithBody", emailsWithBody[0]);
//     console.log("emailsWithBody", emailsWithBody);
//   }
//   useEffect(() => {
//     getEmails(params.email);
//   }, [params]);

//   return (
//     <div>
//       <Title>Communication Hub - Client</Title>

//       <div className="mt-5 flex justify-around">
//         <List id={1} />
//         <MessageBox
//           conversations={conversations}
//           email={decodeURIComponent(params.email)}
//           loading={loading}
//         />
//         <Details id={1} conversations={conversations} />
//       </div>
//     </div>
//   );
// }
"use client";
import Title from "@/components/Title";
import { convert } from "html-to-text";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
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
  params: { email: string };
}): JSX.Element {
  const [conversations, setConversations] = useState<DecodedEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getEmails(email: string) {
    setLoading(true);
    const res = await fetch(
      `/api/communication/client?email=${decodeURIComponent(email)}`,
    );

    const data: EmailData[] = await res.json();
    setLoading(false);

    const emailsWithBody = data?.map((emailData) => {
      let body = decodeEmails(emailData) || "";
      return {
        ...emailData,
        body,
      };
    });

    setConversations(emailsWithBody);
  }

  useEffect(() => {
    getEmails(params.email);
  }, [params]);

  return (
    <div>
      <Title>Communication Hub - Client</Title>

      <div className="mt-5 flex justify-around">
        <List id={1} />
        <MessageBox
          conversations={conversations}
          email={decodeURIComponent(params.email)}
          loading={loading}
        />
        <Details id={1} conversations={conversations} />
      </div>
    </div>
  );
}
