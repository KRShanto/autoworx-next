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
  );
  const endDateTime = new Date(
    `${task.date.split("T")[0]}T${task.endTime}:00.000Z`,
  );

  // Define the event object with appropriate properties
  const event = {
    summary: task.title,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: task.timezone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: task.timezone,
    },
    description:
      "description" in task && task.description ? task.description : undefined,
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    // console.log("Google Calendar Event created:", response);
    return response.data;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    // @ts-ignore
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
