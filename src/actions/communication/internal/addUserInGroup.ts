"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";

type TAddGroupInUser = {
  groupId: number;
  users: { id: number }[];
};

const pusher = getPusherInstance();
// add new user in group
export const addUserInGroup = async ({ groupId, users }: TAddGroupInUser) => {
  try {
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

    if (groupData) {
      pusher.trigger("add-member-in-group", "add-member", {
        groupId: groupData.id,
        userIds: users,
      });
    }
    return { status: 200, data: groupData };
  } catch (err) {
    throw err;
  }
};
