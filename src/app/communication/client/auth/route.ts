import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { env } from "next-runtime-env";

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

    console.log("Tokens from google: ", tokens);

    if (tokens.refresh_token) {
      const companyId = await getCompanyId();
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
