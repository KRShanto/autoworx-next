import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await db.twilioMessage.create({
      data: {
        from: body.from,
        to: body.to,
        message: body.body,
        timestamp: body.timestamp,
        companyId: 1,
      },
    });
    console.log("Webhook Subscription Data:", body);

    // Send response
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
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Webhook Unsubscribe Data:", body);

    // Send response
    return Response.json(
      { message: "Webhook unsubscribed successfully", data: body },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Unsubscribe error:", error);
    return Response.json(
      { message: "Webhook unsubscribe failed", error: error?.message },
      { status: 500 },
    );
  }
}
