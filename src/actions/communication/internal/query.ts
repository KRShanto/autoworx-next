"use server";

import { db } from "@/lib/db";
import { planObject } from "@/utils/planObject";

export const getGroupById = async (groupId: number, userId: number) => {
  const group = await db.group.findUnique({
    where: {
      id: groupId,
      users: { some: { id: userId } },
    },
    include: {
      users: true,
    },
  });
  return planObject(group);
};

export const getGroupMessagesById = async (groupId: number) => {
  const groupMessage = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      messages: {
        include: {
          attachment: true,
        },
      },
    },
  });
  return groupMessage;
};

export const getUserMessagesById = async (userId: number) => {
  const messages = await db.message.findMany({
    where: {
      AND: [{ OR: [{ from: userId }, { to: userId }] }, { groupId: null }],
    },
    include: {
      attachment: true,
      requestEstimate: true,
    },
  });
  return messages;
};

export const getUserInGroup = async (userId: number, groupId: number) => {
  const isUserInExistGroup = await db.group.findFirst({
    where: {
      id: groupId,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
  if (!isUserInExistGroup) {
    return false;
  }
  return true;
};
