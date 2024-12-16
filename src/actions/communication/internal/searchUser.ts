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
    const usersFromDB = await db.user.findMany({
      where: {
        companyId: session?.user?.companyId,
        NOT: withoutNeedUser,
      },
    });
    const filteredUsers = usersFromDB.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    });
    return {
      success: true,
      data: filteredUsers,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};
