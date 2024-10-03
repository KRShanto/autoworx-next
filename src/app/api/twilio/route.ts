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

export async function POST() {
  return NextResponse.json({ status: 200, body: "Message sent" });
}
