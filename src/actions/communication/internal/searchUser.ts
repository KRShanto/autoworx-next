"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Session } from "next-auth";

export const searchUsers = async (searchTerm: string) => {
  const session = (await auth()) as Session & { user: { companyId: number } };
  try {
    const users = await db.user.findMany({
      where: {
        companyId: session?.user?.companyId,
        NOT: [{ id: parseInt(session.user?.id!) }],
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
