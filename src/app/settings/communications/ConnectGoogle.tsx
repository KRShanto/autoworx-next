import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import crypto from "crypto";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

function generateAuthURL() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${env("NEXT_PUBLIC_APP_URL")}/communication/client/auth`,
  );
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
  ];
  const state = crypto.randomBytes(32).toString("hex");
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state: state,
  });
  return authorizationUrl;
}

type Props = {};

const ConnectGoogle = async (props: Props) => {
  const companyId = await getCompanyId();
  const company = await db.company.findUnique({
    where: { id: companyId },
  });

  if (!company?.googleRefreshToken) {
    return (
      <Link
        href={generateAuthURL()}
        className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
      >
        Connect with Google
      </Link>
    );
  } else {
    return (
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
          <span className="text-green-500">
            <FaCheck />
          </span>
          <span className="text-[#6571FF]">Connected with Google</span>
        </div>

        <Link
          href={generateAuthURL()}
          className="rounded-md bg-[#6571FF] px-5 py-1.5 text-white"
        >
          Reconnect
        </Link>
      </div>
    );
  }
};

export default ConnectGoogle;
