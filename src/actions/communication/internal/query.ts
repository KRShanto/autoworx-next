"use server";

import { db } from "@/lib/db";

export const getGroupsData = async (userId: number) => {
  return await db.group.findMany({
    where: { users: { some: { id: userId } } },
    include: {
      users: true,
    },
  });
};

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
  return group;
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
      OR: [
        {
          from: userId,
        },
        {
          to: userId,
        },
        {
          groupId: null,
        },
      ],
    },
    include: {
      attachment: true,
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
