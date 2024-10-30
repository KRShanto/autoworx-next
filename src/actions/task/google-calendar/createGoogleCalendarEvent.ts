"use server";
import { AppointmentToAdd } from "@/actions/appointment/addAppointment";
import { AppointmentToUpdate } from "@/actions/appointment/editAppointment";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import { TaskType } from "../createTask";
// Function to insert event into Google Calendar
async function createGoogleCalendarEvent(
  task: TaskType | AppointmentToAdd | AppointmentToUpdate,
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
  ); // Add seconds
  const endDateTime = new Date(
    `${task.date.split("T")[0]}T${task.endTime}:00.000Z`,
  ); // Add seconds

  const event: {
    summary: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    description?: string;
  } = {
    summary: task.title,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "UTC",
    },
  };
  if ("description" in task && task.description) {
    event.description = task.description;
  }

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

export default createGoogleCalendarEvent;