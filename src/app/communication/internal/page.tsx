import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import Body from "./Body";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communication Hub - Internal",
};

export default async function InternalPage() {
  const session = (await auth()) as AuthSession;

  const users = await db.user.findMany({
    where: {
      NOT: {
        id: parseInt(session?.user?.id),
      },
      companyId: session?.user?.companyId,
    },
  });

  const groups = await db.group.findMany({
    where: { users: { some: { id: parseInt(session?.user?.id!) } } },
    include: {
      users: true,
    },
  });

  return (
    <div className="sm:mt-5 flex gap-5">
      <Body users={users} currentUser={session.user} groups={groups} />
    </div>
  );
}
