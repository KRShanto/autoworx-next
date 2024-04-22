import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { getGoogleToken } from "@/lib/google";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.redirect("/login");
  }

  const code = req.nextUrl.searchParams.get("code") as string;

  const tokens = await getGoogleToken(code);

  // Save the tokens to the database. Create or Update
  await db.oAuthToken.upsert({
    where: { userId: parseInt(session.user.id!) },
    create: {
      userId: parseInt(session.user.id!),
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      provider: "google",
    },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
    },
  });

  return Response.redirect(process.env.NEXT_PUBLIC_APP_URL!);
}
