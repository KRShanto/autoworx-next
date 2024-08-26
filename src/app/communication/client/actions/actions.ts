"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken(code: string) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.FRONTEND_URL}/communication/client/auth`,
    );
    const { tokens } = await oauth2Client.getToken(code);
    if (tokens.refresh_token) {
      cookies().set("gmail_refresh_token", tokens.refresh_token.toString(), {
        httpOnly: true,
      });
    }
  } catch (error) {}
  redirect("/communication/client");
}

export async function getClients() {
  const companyId = await getCompanyId();
  const clients = await db.client.findMany({
    where: { companyId },
    include: { tag: true, source: true },
  });
  return clients;
}

export async function getVehicles(clientId: string) {
  const vehicles = await db.vehicle.findMany({
    where: { clientId: parseInt(clientId) },
  });
  console.log("🚀 ~ getVehicles ~ vehicles:", vehicles);
  return vehicles;
}
