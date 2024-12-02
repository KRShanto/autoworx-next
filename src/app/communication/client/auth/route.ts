import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") as string;

  console.log("Code found from google: ", code);

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${env("NEXT_PUBLIC_APP_URL")}/communication/client/auth`,
    );

    const { tokens } = await oauth2Client.getToken(code);
    //@ts-expect-error Fix later
    const emailAddress = await fetchEmailAddress(tokens);
    const companyId = await getCompanyId();
    if (emailAddress) {
      await db.company.update({
        where: { id: companyId },
        data: {
          googleEmail: emailAddress,
        },
      });
    }

    if (tokens.refresh_token) {
      await db.company.update({
        where: { id: companyId },
        data: {
          googleRefreshToken: tokens.refresh_token,
        },
      });
    } else {
      console.log("No refresh token found in response from google");
      // redirect("/settings/communications/error");
    }
  } catch (error) {
    console.log("Error getting token", error);
    // redirect("/settings/communications/error");
  }

  redirect("/settings/communications");
}

interface Tokens {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}
async function fetchEmailAddress(tokens: Tokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${env("NEXT_PUBLIC_APP_URL")}/communication/client/auth`,
  );

  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    const profile = await gmail.users.getProfile({ userId: "me" });
    const emailAddress = profile.data.emailAddress;
    console.log("Authenticated user's email address: ", emailAddress);
    return emailAddress;
  } catch (error) {
    console.error("Error fetching user's email address: ", error);
    throw error;
  }
}
