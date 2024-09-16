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
      `${process.env.NEXT_PUBLIC_APP_URL}/communication/client/auth`,
    );
    const { tokens } = await oauth2Client.getToken(code);
    if (tokens.refresh_token) {
      console.log("Refresh token", tokens.refresh_token);
      cookies().set("gmail_refresh_token", tokens.refresh_token.toString(), {
        httpOnly: true,
      });
    }

    redirect("/settings/communications");
  } catch (error) {
    console.log("Error getting token", error);
  }
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
  return vehicles;
}

export async function getClient(clientId: string) {
  const client = await db.client.findFirst({
    where: { id: parseInt(clientId) },
  });
  return client;
}

export async function getServices(clientId: string) {
  const invoices = await db.invoice.findMany({
    where: { clientId: parseInt(clientId) },
    include: {
      invoiceItems: {
        include: { service: true },
      },
    },
  });
  const services = invoices.map((invoice) =>
    invoice.invoiceItems.map((item) => item.service?.name),
  );

  return services;
}

export async function getEstimates(clientId: string) {
  const estimates = await db.invoice.findMany({
    where: { clientId: parseInt(clientId) },
  });

  return estimates.map((estimate) => estimate.id);
}

export async function saveNotes(clientId: number, notes: string) {
  await db.client.update({
    where: { id: clientId },
    data: { notes },
  });
}
