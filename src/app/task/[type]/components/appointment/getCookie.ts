"use server";
import crypto from "crypto";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCookies() {
  const cookieStore = await cookies();
  return cookieStore.get("googleCalendarToken");
}

export async function generateAuthURL() {
  const oauth2Client = new google.auth.OAuth2(
    env("GMAIL_CLIENT_ID"),
    env("GMAIL_CLIENT_SECRET"),
    `${env("NEXT_PUBLIC_APP_URL")}/task/auth`,
  );

  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const state = crypto.randomBytes(32).toString("hex");

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state: state,
  });
  console.log("🚀 ~ generateAuthURL ~ authorizationUrl:", authorizationUrl);

  return redirect(authorizationUrl);
}
