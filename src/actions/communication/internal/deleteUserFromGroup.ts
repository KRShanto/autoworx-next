"use server";

import { db } from "@/lib/db";
import { getPusherInstance } from "@/lib/pusher/server";
import { revalidatePath } from "next/cache";

const pusher = getPusherInstance();

/**
 * Deletes a user from a group and triggers a pusher event.
 * @param userId - The ID of the user to be deleted.
 * @param groupId - The ID of the group from which the user will be deleted.
 * @returns An object containing the status and message of the operation.
 */
export const deleteUserFromGroup = async (userId: number, groupId: number) => {
  try {
    // Update the group to disconnect the user
    const deleteUser = await db.group.update({
      where: { id: groupId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });

    // Trigger a pusher event if the user was successfully deleted
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
    // Handle any errors that occur during the process
    throw err;
  }
};
