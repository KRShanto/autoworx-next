"use server";

import { db } from "@/lib/db";

export const getGroupMessagesById = async (id: number) => {
  const groupMessage = await db.message.findMany({
    where: {
      groupId: id,
    },
  });
  return groupMessage;
};
