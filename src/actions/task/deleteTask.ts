"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteTask(id: number): Promise<ServerAction> {
  try {
    // find the task users
    const taskUsers = await db.taskUser.findMany({
      where: {
        taskId: id,
      },
    });

    // remove the task users
    for (const user of taskUsers) {
      // TODO: Remove the task from the user's Google Calendar
    }

    // remove the task
    let deletedTask = await db.task.delete({
      where: {
        id,
      },
    });

    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && deletedTask.googleEventId) {
      await deleteGoogleCalendarEvent(deletedTask.googleEventId);
    }

    revalidatePath("/task");
    revalidatePath("/communication/client");

    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ deleteTask ~ error:", error);
    return {
      type: "error",
    };
  }
}

// Function to delete event in Google Calendar
export async function deleteGoogleCalendarEvent(eventId: string) {
  const cookie = await cookies();
  const refreshToken = cookie.get("googleCalendarToken")?.value;

  const clientId = env("GMAIL_CLIENT_ID");
  const clientSecret = env("GMAIL_CLIENT_SECRET");

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);

  if (refreshToken)
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    await calendar.events.delete({
      auth: oAuth2Client,
      calendarId: "primary",
      eventId: eventId,
    });

    console.log(`Google Calendar Event with ID ${eventId} deleted.`);
  } catch (error) {
    //@ts-ignore
    if (error?.response?.data?.error === "invalid_grant") {
      const cookieStore = await cookies();
      cookieStore.delete("googleCalendarToken");
      console.log("Invalid or expired refresh token. Token deleted.");
    }
    console.error("Error deleting Google Calendar event:", error);
    throw error;
  }
}
