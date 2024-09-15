import { db } from "@/lib/db";
import fs from "fs";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import { pipeline, Readable } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const ClientId = url.searchParams.get("clientId");

    if (!ClientId) {
      return new Response(
        JSON.stringify({ error: "Client Id query parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const client = await db.client.findFirst({
      where: { id: parseInt(ClientId) },
    });

    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = cookies().get("gmail_refresh_token");

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    if (refreshToken)
      oAuth2Client.setCredentials({ refresh_token: refreshToken.value });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // Fetch emails sent from or received by the provided email address
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `from:${client.email} OR to:${client.email}`,
      maxResults: 100,
    });

    const messages = res.data.messages || [];
    const emails = [];

    if (messages.length > 0) {
      for (const message of messages) {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id as string, // Ensure `message.id` is treated as a string
          format: "full",
        });

        const parts = msg.data.payload?.parts || [];
        const attachments = await Promise.all(
          parts.map(async (part) => {
            // Ensure that part.body and part.body.attachmentId are defined
            if (part.filename && part.body && part.body.attachmentId) {
              const attachment = await gmail.users.messages.attachments.get({
                userId: "me",
                messageId: message.id as string, // Ensure `message.id` is treated as a string
                id: part.body.attachmentId as string, // Ensure `attachmentId` is treated as a string
              });

              const data = attachment.data.data; // base64 data

              return {
                filename: part.filename,
                mimeType: part.mimeType,
                data: data, // Keep it base64
              };
            }
            return null;
          }),
        );

        emails.push({
          ...msg.data,
          internalDate: parseInt(msg.data.internalDate as string), // Ensure `internalDate` is treated as a string
          attachments: attachments.filter(Boolean),
        });
      }

      emails.sort((a, b) => a.internalDate - b.internalDate);
    }

    return new Response(JSON.stringify(emails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    cookies().delete("gmail_refresh_token");
    return new Response(JSON.stringify({ error: "Failed to fetch emails" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to convert Web Stream to Node.js Readable stream
function webStreamToNodeStream(
  webStream: ReadableStream<Uint8Array>,
): Readable {
  const reader = webStream.getReader();

  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null); // End of stream
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}

// Helper function to create the email content (with attachment if needed)
function makeEmail({ to, from, subject, text, file }: any) {
  let message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="boundary"',
    "",
    "--boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    text,
  ];

  if (file) {
    const attachmentContent = fs.readFileSync(file.path).toString("base64");
    message = [
      ...message,
      "",
      "--boundary",
      `Content-Type: ${file.type}; name="${file.name}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${file.name}"`,
      "",
      attachmentContent,
    ];
  }

  message.push("--boundary--");

  return Buffer.from(message.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const recipient = formData.get("recipient") as string | null;
    const subject = "Autoworx";
    // const subject = formData.get("subject") as string | null;
    const text = formData.get("text") as string | null;
    let filePath;

    if (!recipient) throw new Error("Recipient not provided");

    const client = await db.client.findFirst({
      where: { id: parseInt(recipient) },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    if (!recipient || !subject || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required form data" },
        { status: 400 },
      );
    }

    // Handle file if exists
    if (file) {
      const nodeStream = webStreamToNodeStream(file.stream());
      filePath = path.join("./public/uploads", file.name);
      await pump(nodeStream, fs.createWriteStream(filePath));
    }

    // Load OAuth2 credentials and token
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}communication/client/auth`,
    );
    let refreshToken = (cookies().get("gmail_refresh_token")?.value ||
      "") as string;
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    // Set credentials (this assumes you already have a valid token)
    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // Create the email content
    const rawMessage = makeEmail({
      to: client.email,
      from: process.env.GMAIL_USER as string,
      subject: subject,
      text: text,
      file: file
        ? {
            name: file.name,
            path: filePath,
            type: file.type,
          }
        : null,
    });

    // Send the email using Gmail API
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    // Clean up the file after sending
    if (filePath) fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
