import "server-only";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";

export async function getUserFromSession() {
  const session = (await auth()) as AuthSession;

  if (!session || !session.user) {
    throw new Error("No session or user found");
  }
  console.log("User from session:", session.user);

  return session.user;
}
