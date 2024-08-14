"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteUserFromGroup = async (userId: number, groupId: number) => {
  try {
    const deleteUser = db.group.update({
      where: { id: groupId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });
    revalidatePath("/communication/internal");
    return {
      status: 200,
      data: deleteUser,
      message: "User deleted from group",
    };
  } catch (err) {
    throw err;
  }
};
