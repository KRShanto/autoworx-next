import { getGoogleAuthUrl } from "@/lib/google";

export async function GET(res: Response) {
  const url = getGoogleAuthUrl();

  return Response.redirect(url);
}
