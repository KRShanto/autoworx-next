"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";
import { revalidatePath } from "next/cache";

const pusher = getPusherInstance();

export const deleteUserFromGroup = async (userId: number, groupId: number) => {
  try {
    const deleteUser = await db.group.update({
      where: { id: groupId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });
    if (deleteUser) {
      pusher.trigger("delete-group", "delete", {
        userId,
        groupId,
      });
    }
    // revalidatePath("/communication/internal");
    return {
      status: 200,
      message: "User deleted from group",
    };
  } catch (err) {
    throw err;
  }
};
