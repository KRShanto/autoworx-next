"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";

type TAddGroupInUser = {
  groupId: number;
  users: { id: number }[];
};

const pusher = getPusherInstance();

/**
 * Adds new users to a group and triggers a pusher event.
 * @param groupId - The ID of the group.
 * @param users - The users to be added to the group.
 * @returns An object containing the status and the updated group data.
 */
export const addUserInGroup = async ({ groupId, users }: TAddGroupInUser) => {
  try {
    // Update the group to connect the new users
    const groupData = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        users: {
          connect: users,
        },
      },
      include: {
        users: true,
      },
    });

    // Trigger a pusher event if the users were successfully added
    if (groupData) {
      pusher.trigger("add-member-in-group", "add-member", {
        groupId: groupData.id,
        userIds: users,
      });
    }
    return { status: 200, data: groupData };
  } catch (err) {
    // Handle any errors that occur during the process
    throw err;
  }
};
