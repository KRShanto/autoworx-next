"use server";
import { TNotification } from "@/types/notification";
import { db } from "@/lib/db";
export const updateNotification = async (
  updatedNotification: TNotification,
) => {
  try {
    const updatedNotificationSettings = await db.notificationSettings.update({
      where: {
        type: "notification",
      },
      data: {
        notifications: updatedNotification,
      },
    });
    return { type: "success", data: updatedNotificationSettings };
  } catch (err: any) {
    throw new Error(err);
  }
};
