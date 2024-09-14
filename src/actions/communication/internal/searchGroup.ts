"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Session } from "next-auth";

export const searchGroups = async (searchTerm: string) => {
  const session = (await auth()) as Session & { user: { companyId: number } };
  try {
    const groups = await db.group.findMany({
      where: {
        users: { some: { id: parseInt(session?.user?.id!) } },
        OR: [{ name: { contains: searchTerm } }],
      },
      include: {
        users: true,
      },
    });
    return {
      success: true,
      data: groups,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};
