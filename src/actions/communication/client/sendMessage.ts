"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { env } from "next-runtime-env";
import Twilio from "twilio";

const accountSid = env("TWILIO_SID") || process.env.TWILIO_SID;
const authToken = env("TWILIO_TOKEN") || process.env.TWILIO_TOKEN;
const fromNumber = env("TWILIO_NUMBER") || process.env.TWILIO_NUMBER;

const twilio = Twilio(accountSid, authToken);

export async function sendMessage({
  message,
  clientId,
}: {
  message: string;
  clientId: number;
}) {
  try {
    console.log("🚀 ~ sendMessage ~ message:");
    const user = await getUser();
    const client = await db.client.findFirst({
      where: {
        id: clientId,
      },
    });

    let to = client?.mobile;

    if (fromNumber && to && message && clientId) {
      const messageResponse = await twilio.messages.create({
        body: message,
        from: fromNumber,
        to,
      });
      console.log("🚀 ~ createMessage ~ messageResponse:", messageResponse);

      const dbMessage = await db.clientSMS.create({
        data: {
          from: fromNumber,
          to,
          message,
          sentBy: "Company",
          userId: user.id,
          clientId,
          companyId: user.companyId,
        },
      });
      return {
        success: true,
        data: dbMessage,
      };
    } else {
      throw new Error("Missing required parameters");
    }
  } catch (error) {
    console.log("Error sending message", error);
    return {
      success: false,
      error,
    };
  }
}
