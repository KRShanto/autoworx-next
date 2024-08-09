import formidable from "formidable";
import fs from "fs";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import { pipeline } from "stream";
import { promisify } from "util";
const pump = promisify(pipeline);
export async function GET(request) {
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
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);

    oAuth2Client.setCredentials({ refresh_token: refreshToken });

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
          id: message.id,
          format: "full",
        });

        const parts = msg.data.payload.parts || [];
        const attachments = await Promise.all(
          parts.map(async (part) => {
            if (part.filename && part.body.attachmentId) {
              const attachment = await gmail.users.messages.attachments.get({
                userId: "me",
                messageId: message.id,
                id: part.body.attachmentId,
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
          internalDate: parseInt(msg.data.internalDate),
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
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch emails" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// send mail with attachments
export async function POST(req) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const recipient = formData.get("recipient");
    const subject = formData.get("subject");
    const text = formData.get("text");

    // Save the file to the server temporarily
    const filePath = `./public/uploads/${file.name}`;
    await pump(file.stream(), fs.createWriteStream(filePath));

    // Nodemailer transporter with OAuth2
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send the email with the file attachment
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: file.name,
          path: filePath, // Attach the file using the path where it was saved
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);

    // Remove the file from the server after sending the email
    fs.unlinkSync(filePath);

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ success: false, error: error.message });
  }
}
