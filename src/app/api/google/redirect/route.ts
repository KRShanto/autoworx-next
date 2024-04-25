import { getGoogleAuthUrl } from "@/lib/google";

export async function GET() {
  const url = getGoogleAuthUrl();

  return Response.redirect(url);
}
