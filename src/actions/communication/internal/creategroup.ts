"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";

type TCreateGroup = {
  name: string;
  users: { id: number }[];
};

const pusher = getPusherInstance();

/**
 * Creates a new group with the specified users and triggers a pusher event.
 * @param name - The name of the group.
 * @param users - The users to be added to the group.
 * @returns An object containing the status and the created group data.
 */
export const createGroup = async ({ name, users }: TCreateGroup) => {
  try {
    // Create a new group in the database with the specified users
    const groupData = await db.group.create({
      data: {
        name: name,
        users: {
          connect: users,
        },
      },
      include: {
        users: true,
      },
    });

    // Trigger a pusher event if the group was successfully created
    if (groupData) {
      pusher.trigger("create-group", "create", {
        groupId: groupData.id,
        usersIds: users,
      });
    }
    // revalidatePath("/communication/internal");
    return { status: 200, data: groupData };
  } catch (err) {
    // Handle any errors that occur during the process
    throw err;
  }
};
