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
    where: { users: { some: { id: parseInt(session?.user?.id) } } },
    include: {
      users: true,
    },
  });

  const messages = await db.message.findMany({
    where: {
      OR: [
        {
          from: parseInt(session?.user?.id),
        },
        {
          to: parseInt(session?.user?.id),
        },
      ],
    },
  });
  return (
    <div className="mt-5 flex gap-5">
      <Body
        users={users}
        currentUser={session.user}
        messages={messages}
        groups={groups}
      />
    </div>
  );
}
