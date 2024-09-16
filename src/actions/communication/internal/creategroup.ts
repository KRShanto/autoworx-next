"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";
import { revalidatePath } from "next/cache";

type TGroup = {
  name: string;
  users: { id: number }[];
};

const pusher = getPusherInstance();

export const createGroup = async ({ name, users }: TGroup) => {
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
      pusher.trigger("delete-group", "delete", {
        usersIds: users,
      });
    }
    revalidatePath("/communication/internal");
    return { status: 200, data: groupData };
  } catch (err) {
    throw err;
  }
};
