"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Priority } from "@prisma/client";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
  startTime?: string;
  endTime?: string;
  date?: string;
}

export async function editTask({
  id,
  task,
}: {
  id: number;
  task: TaskType;
}): Promise<ServerAction> {
  try {
    // Find the task users
    const taskUsers = await db.taskUser.findMany({
      where: {
        taskId: id,
      },
    });

    const assignedUsers = task.assignedUsers;

    // Find the difference between the existing users and the new users
    const toRemove = taskUsers.filter(
      (taskUser) => !assignedUsers?.includes(taskUser.userId),
    );
    const toAdd = assignedUsers?.filter(
      (userId) => !taskUsers.find((taskUser) => taskUser.userId === userId),
    );

    // Remove the users
    for (const user of toRemove) {
      // TODO: Remove the task from the user's Google Calendar

      await db.taskUser.delete({
        where: {
          id: user.id,
        },
      });
    }

    if (Array.isArray(toAdd)) {
      // Add the users
      for (const user of toAdd) {
        // TODO: Add the task to the user's Google Calendar

        // Create the task user
        await db.taskUser.create({
          data: {
            taskId: id,
            userId: user,
            eventId: "null-for-now",
          },
        });
      }
    }

    // Update the task
    let updatedTask = await db.task.update({
      where: {
        id,
      },
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startTime: task.startTime,
        endTime: task.endTime,
        date: task.date,
      },
    });

    // if the task has date, start time and end time, then insert it in google calendar
    // also need to check if google calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (
      googleCalendarToken &&
      updatedTask.googleEventId &&
      updatedTask.startTime &&
      updatedTask.endTime &&
      updatedTask.date
    ) {
      await updateGoogleCalendarEvent(
        updatedTask.googleEventId,
        task,
      );
    }

    revalidatePath("/task");
    revalidatePath("/communication/client");

    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ error updating:", error);
    return {
      type: "error",
    };
  }
}

// Function to update event in Google Calendar
export async function updateGoogleCalendarEvent(
  eventId: string,
  task: TaskType,
) {
  if (!task.date) return;

  const cookie = await cookies();
  const refreshToken = cookie.get("googleCalendarToken")?.value;

  const clientId = env("GMAIL_CLIENT_ID");
  const clientSecret = env("GMAIL_CLIENT_SECRET");

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);

  if (refreshToken)
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const startDateTime = new Date(
    `${task.date.split("T")[0]}T${task.startTime}:00.000Z`,
  );
  const endDateTime = new Date(
    `${task.date.split("T")[0]}T${task.endTime}:00.000Z`,
  );

  const event = {
    summary: task.title,
    description: task.description,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "UTC", // Adjust timezone if necessary
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "UTC",
    },
    // attendees: task.assignedUsers.map((user) => ({ email: user.email })),
    // reminders: {
    //   useDefault: false,
    //   overrides: [
    //     { method: "email", minutes: 24 * 60 },
    //     { method: "popup", minutes: 10 },
    //   ],
    // },
  };

  try {
    const response = await calendar.events.update({
      auth: oAuth2Client,
      calendarId: "primary",
      eventId: eventId,
      resource: event,
    });

    console.log("Google Calendar Event updated:", response);
    return response.data;
  } catch (error) {
    //@ts-ignore
    if (error?.response?.data?.error === "invalid_grant") {
      const cookieStore = await cookies();
      cookieStore.delete("googleCalendarToken");
      console.log("Invalid or expired refresh token. Token deleted.");
    }
    console.error("Error updating Google Calendar event:", error);
    throw error;
  }
}
