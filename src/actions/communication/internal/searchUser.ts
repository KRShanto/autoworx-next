"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Session } from "next-auth";

export const searchUsers = async (
  searchTerm: string,
  notNeededUser?: { id: number }[] | null,
) => {
  const session = (await auth()) as Session & { user: { companyId: number } };
  let withoutNeedUser = [{ id: parseInt(session.user?.id!) }];
  if (notNeededUser && notNeededUser.length) {
    withoutNeedUser = [...withoutNeedUser, ...notNeededUser];
  }
  try {
    const users = await db.user.findMany({
      where: {
        companyId: session?.user?.companyId,
        NOT: withoutNeedUser,
        OR: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
        ],
      },
    });
    return {
      success: true,
      data: users,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};
