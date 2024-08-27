import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import crypto from "crypto";
import { google } from "googleapis";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import React from "react";

type Props = {};
function generateAuthURL() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}/communication/client/auth`,
  );
  const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];
  const state = crypto.randomBytes(32).toString("hex");
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state: state,
  });
  return authorizationUrl;
}

const Page = async (props: Props) => {
  const cookieStore = cookies();
  const hasCookie = cookieStore.has("gmail_refresh_token");
  if (!hasCookie) {
    redirect(generateAuthURL());
  }
  const companyId = await getCompanyId();
  const clients = await db.client.findMany({
    where: { companyId },
    include: { tag: true, source: true },
  });

  if (clients.length === 0) {
    return <div>No Clients</div>;
  } else {
    redirect(`/communication/client/${clients[0].id}`);
  }
};

export default Page;
