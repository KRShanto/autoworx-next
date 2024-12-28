import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_TOKEN;
// const from = process.env.TWILIO_NUMBER;
// const client = twilio(accountSid, authToken);

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { to, message } = body;

//   try {
//     await client.messages.create({
//       body: message,
//       from,
//       to,
//     });
//     return NextResponse.json({ status: 200, body: "Message sent" });
//   } catch (error) {
//     console.log("Error sending message", error);
//     return NextResponse.json({ status: 500, body: "Error sending message" });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log("Twilio Webhook Subscription Data:", body);

//     const client = await db.client.findFirst({
//       where: {
//         mobile: body.from,
//       },
//     });
//     if (client) {
//       const dbMessage = await db.clientSMS.create({
//         data: {
//           from: body.from,
//           to: body.to,
//           message: body.body,
//           sentBy: "Client",
//           clientId: client.id,
//           companyId: client.companyId,
//         },
//       });
//     }

//     // Send response
//     return Response.json(
//       { message: "Webhook subscription successful", data: body },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Subscription error:", error);
//     return Response.json(
//       { message: "Webhook subscription failed", error: error?.message },
//       { status: 500 },
//     );
//   }
// }
// export async function DELETE(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log("Webhook Unsubscribe Data:", body);

//     // Send response
//     return Response.json(
//       { message: "Webhook unsubscribed successfully", data: body },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Unsubscribe error:", error);
//     return Response.json(
//       { message: "Webhook unsubscribe failed", error: error?.message },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    let body;

    // Check for Twilio's default content type
    const contentType = req.headers.get("content-type");
    if (contentType === "application/x-www-form-urlencoded") {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData).entries());
    } else {
      throw new Error(
        "Unsupported content type: Twilio webhook expects form-encoded data",
      );
    }

    console.log("Twilio Webhook Data:", body);

    // Find the client in your database
    const client = await db.client.findFirst({
      where: {
        mobile: body.From, // Twilio sends 'From' and 'To' in title case
      },
    });
    console.log("🚀 ~ POST ~ client:", client);

    if (client) {
      const dbMessage = await db.clientSMS.create({
        data: {
          from: body.From,
          to: body.To,
          message: body.Body,
          sentBy: "Client",
          clientId: client.id,
          companyId: client.companyId,
        },
      });
      console.log("🚀 ~ POST ~ dbMessage:", dbMessage);
    }

    // Send a success response
    return Response.json(
      { message: "Webhook subscription successful", data: body },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Subscription error:", error);
    return Response.json(
      { message: "Webhook subscription failed", error: error?.message },
      { status: 500 },
    );
  }
}
