"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";

type TCreateGroup = {
  name: string;
  users: { id: number }[];
};



const pusher = getPusherInstance();

// create a new group with user
export const createGroup = async ({ name, users }: TCreateGroup) => {
  try {
    const groupData = await db.group.create({
      data: {
        name: name,
        users: {
          connect: users,
        },
      },
    });

    if (groupData) {
      pusher.trigger("create-group", "create", {
        groupId: groupData.id,
        usersIds: users,
      });
    }
    // revalidatePath("/communication/internal");
    return { status: 200, data: groupData };
  } catch (err) {
    throw err;
  }
};


