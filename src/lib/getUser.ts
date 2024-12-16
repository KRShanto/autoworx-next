"use server";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { User } from "@prisma/client";
import { db } from "./db";
import { planObject } from "@/utils/planObject";

export default async function getUser() {
  const session = (await auth()) as AuthSession;
  // const companyId = session.user.companyId;
  let user = (await db.user.findFirst({
    where: {
      id: +session.user.id,
    },
  })) as User;
  return planObject(user);
}
