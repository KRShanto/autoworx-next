import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import "server-only";

export async function getCompanyId() {
  const session = (await auth()) as AuthSession;
  return session.user.companyId;
}
