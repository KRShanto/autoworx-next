import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
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
      `${env("NEXT_PUBLIC_APP_URL")}/task/auth`,
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log("Tokens from google: ", tokens);

    if (tokens.refresh_token) {
      const cookieStore = await cookies();
      cookieStore.set("googleCalendarToken", tokens.refresh_token);
      redirect("/task/day");
    } else {
      console.log("No refresh token found in response from google");
      // redirect("/settings/communications/error");
    }
  } catch (error) {
    // Check if the error is related to invalid grants
    if (error instanceof Error) {
      if (error.message.includes("invalid_grant")) {
        const cookieStore = await cookies();
        cookieStore.delete("googleCalendarToken");
        console.log("Invalid or expired refresh token. Token deleted.");
      } else {
        console.error("Error getting token:", error.message);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    console.log("Error getting token", error);
    // redirect("/settings/communications/error");
  }

  redirect("/task/day");
}
