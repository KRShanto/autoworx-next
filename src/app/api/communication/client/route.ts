// import { google } from "googleapis";

// export async function GET(request) {
//   try {
//     const url = new URL(request.url);
//     const emailAddress = url.searchParams.get("email");

//     if (!emailAddress) {
//       return new Response(
//         JSON.stringify({ error: "Email query parameter is required" }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         },
//       );
//     }

//     const clientId = process.env.GMAIL_CLIENT_ID;
//     const clientSecret = process.env.GMAIL_CLIENT_SECRET;
//     const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

//     const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);

//     oAuth2Client.setCredentials({ refresh_token: refreshToken });

//     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

//     // Fetch emails sent from or received by the provided email address
//     const res = await gmail.users.messages.list({
//       userId: "me",
//       q: `from:${emailAddress} OR to:${emailAddress}`,
//       maxResults: 100, // You can adjust the number of results as needed
//     });

//     const messages = res.data.messages || [];
//     const emails = [];

//     if (messages.length > 0) {
//       for (const message of messages) {
//         const msg = await gmail.users.messages.get({
//           userId: "me",
//           id: message.id,
//           format: "full", // Fetch the full message to get all details, including attachments
//         });

//         // Process each message to extract attachments
//         const parts = msg.data.payload.parts || [];
//         const attachments = await Promise.all(
//           parts.map(async (part) => {
//             if (part.filename && part.body.attachmentId) {
//               const attachment = await gmail.users.messages.attachments.get({
//                 userId: "me",
//                 messageId: message.id,
//                 id: part.body.attachmentId,
//               });

//               const data = attachment.data.data;
//               const decodedData = Buffer.from(data, "base64").toString("utf-8");

//               return {
//                 filename: part.filename,
//                 mimeType: part.mimeType,
//                 data: decodedData,
//               };
//             }
//             return null;
//           })
//         );

//         emails.push({
//           ...msg.data,
//           internalDate: parseInt(msg.data.internalDate), // Ensure internalDate is a number for sorting
//           attachments: attachments.filter(Boolean),
//         });
//       }

//       // Sort emails by internalDate to maintain a sequential order
//       emails.sort((a, b) => a.internalDate - b.internalDate);
//     }

//     return new Response(JSON.stringify(emails), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Failed to fetch emails" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }


// with attachment
import { google } from "googleapis";

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
          })
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
