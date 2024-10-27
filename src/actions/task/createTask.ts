"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { Priority, Task } from "@prisma/client";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
  invoiceId?: string;
  startTime?: string;
  endTime?: string;
  clientId?: number | null;
  date?: string;
}

export async function createTask(task: TaskType): Promise<ServerAction> {
  try {
    const session = (await auth()) as AuthSession;

    let newTask = await db.task.create({
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        userId: parseInt(session.user.id),
        companyId: session.user.companyId,
        invoiceId: task.invoiceId,
        startTime: task.startTime,
        endTime: task.endTime,
        clientId: task.clientId,
        date: task?.date ? task?.date : new Date().toISOString(),
      },
    });

    // Loop the assigned users and add them to the Google Calendar
    for (const user of task.assignedUsers) {
      const assignedUser = await db.user.findUnique({
        where: {
          id: user,
        },
      });

      // TODO: Add the task to the user's Google Calendar

      // Create the task user
      await db.taskUser.create({
        data: {
          taskId: newTask.id,
          userId: user,
          eventId: "null-for-now",
        },
      });
    }

    // if the task has date, start time and end time, then insert it in google calendar
    // also need to check if google calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && task.startTime && task.endTime && task.date) {
      let event = await createGoogleCalendarEvent(task);

      // if event is successfully created in google calendar, then save the event id in task model
      if (event.id) {
        newTask = await db.task.update({
          where: {
            id: newTask.id,
          },
          data: {
            googleEventId: event.id,
          },
        });
      }
    }

    revalidatePath("/task");
    revalidatePath("/communication/client");

    return {
      type: "success",
      data: newTask,
    };
  } catch (error) {
    console.log("Error while creating new task", error);

    return {
      type: "error",
    };
  }
}

// Function to insert event into Google Calendar
export async function createGoogleCalendarEvent(task: TaskType) {
  if (!task.date) return;
  const cookie = await cookies();
  const refreshToken = cookie.get("googleCalendarToken")?.value;

  const clientId = env("GMAIL_CLIENT_ID");
  const clientSecret = env("GMAIL_CLIENT_SECRET");
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  if (refreshToken)
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client }); // Make sure 'auth' is correctly authorized
  const startDateTime = new Date(
    `${task.date.split("T")[0]}T${task.startTime}:00.000Z`,
  ); // Add seconds
  const endDateTime = new Date(
    `${task.date.split("T")[0]}T${task.endTime}:00.000Z`,
  ); // Add seconds

  const event = {
    summary: task.title,
    description: task?.description,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "UTC", // Adjust timezone as per requirement
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
    const response = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: "primary",
      resource: event,
    });

    console.log("Google Calendar Event created:", response);
    return response.data;
  } catch (error) {
    //@ts-ignore
    if (error?.response?.data?.error === "invalid_grant") {
      const cookieStore = await cookies();
      cookieStore.delete("googleCalendarToken");
      console.log("Invalid or expired refresh token. Token deleted.");
    }
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}
