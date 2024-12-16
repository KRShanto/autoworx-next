"use server";

import { db } from "@/lib/db";
import { planObject } from "@/utils/planObject";

/**
 * Retrieves a group by its ID and checks if the user is part of the group.
 * @param groupId - The ID of the group.
 * @param userId - The ID of the user.
 * @returns The group data including its users.
 */
export const getGroupById = async (groupId: number, userId: number) => {
  // Fetch the group from the database and include its users
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

/**
 * Retrieves messages of a group by its ID.
 * @param groupId - The ID of the group.
 * @returns The group messages including attachments.
 */
export const getGroupMessagesById = async (groupId: number) => {
  // Fetch the group messages from the database and include attachments
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

/**
 * Retrieves messages for a user by their ID.
 * @param userId - The ID of the user.
 * @returns The user messages including attachments and request estimates.
 */
export const getUserMessagesById = async (userId: number) => {
  // Fetch the user messages from the database and include attachments and request estimates
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

/**
 * Checks if a user is part of a specific group.
 * @param userId - The ID of the user.
 * @param groupId - The ID of the group.
 * @returns A boolean indicating if the user is part of the group.
 */
export const getUserInGroup = async (userId: number, groupId: number) => {
  // Check if the user is part of the specified group
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
