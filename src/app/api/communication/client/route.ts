import fs from "fs";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { pipeline, Readable } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const emailAddress = url.searchParams.get("email");

    if (!emailAddress) {
      return new Response(
        JSON.stringify({ error: "Email query parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
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
      q: `from:${emailAddress} OR to:${emailAddress}`,
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const recipient = formData.get("recipient") as string | null;
    const subject = formData.get("subject") as string | null;
    const text = formData.get("text") as string | null;
    let filePath;

    console.log("Form data:", { file, recipient, subject, text });

    if (!recipient || !subject || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required form data" },
        { status: 400 },
      );
    }

    if (file) {
      // Convert Web Stream to Node.js Readable stream
      const nodeStream = webStreamToNodeStream(file.stream());

      // Save the file to the server temporarily
      filePath = `./public/uploads/${file.name}`;
      await pump(nodeStream, fs.createWriteStream(filePath));
    }

    // Nodemailer transporter with OAuth2
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER as string,
        pass: process.env.GMAIL_PASS as string,
      },
    });

    // Send the email with the file attachment
    const mailOptions = {
      from: process.env.GMAIL_USER as string,
      to: recipient,
      subject: subject,
      text: text,
      attachments: file
        ? [
            {
              filename: file.name,
              path: filePath, // Attach the file using the path where it was saved
            },
          ]
        : [],
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent:", result);

    // Remove the file from the server after sending the email
    filePath && fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
