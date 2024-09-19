import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") as string;

  console.log("Code found from google: ", code);

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/communication/client/auth`,
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

      redirect("/settings/communications");
    } else {
      console.log("No refresh token found in response from google");
    }
  } catch (error) {
    console.log("Error getting token", error);
  }
}
