"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";

export default async function newStatus({
  name,
  hue,
}: {
  name: string;
  hue: number;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newStatus = await db.status.create({
    data: {
      companyId,
      name,
      hue,
    },
  });

  return {
    type: "success",
    data: newStatus,
  };
}
