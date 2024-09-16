import crypto from "crypto";
import { google } from "googleapis";
import { cookies } from "next/headers";
import Link from "next/link";

function generateAuthURL() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/communication/client/auth`,
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

const ConnectGoogle = (props: Props) => {
  const cookieStore = cookies();
  const hasCookie = cookieStore.has("gmail_refresh_token");
  if (!hasCookie) {
    // redirect(generateAuthURL());
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
      <div>
        <span className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white">
          Connected with Google
        </span>
      </div>
    );
  }
};

export default ConnectGoogle;
