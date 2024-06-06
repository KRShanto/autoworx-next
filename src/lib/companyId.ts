import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import "server-only";

// TODO: use this everywhere
export async function getCompanyId() {
  const session = (await auth()) as AuthSession;
  return session.user.companyId;
}
