"use server";

/**
 * Updates the notification settings in the database.
 *
 * @param updatedNotification - The new notification settings to be saved.
 * @returns An object containing the status and the updated notification settings.
 * @throws Will throw an error if the update operation fails.
 */
import { TNotification } from "@/types/notification";
import { db } from "@/lib/db";

export const updateNotification = async (
  updatedNotification: TNotification,
) => {
  try {
    // Update the notification settings in the database
    const updatedNotificationSettings = await db.notificationSettings.update({
      where: {
        type: "notification",
      },
      data: {
        notifications: updatedNotification,
      },
    });
    // Return success response with updated settings
    return { type: "success", data: updatedNotificationSettings };
  } catch (err: any) {
    // Throw an error if the update operation fails
    throw new Error(err);
  }
};
