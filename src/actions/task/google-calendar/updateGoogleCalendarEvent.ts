// "use server";
// import { AppointmentToUpdate } from "@/actions/appointment/editAppointment";
// import { google } from "googleapis";
// import { env } from "next-runtime-env";
// import { cookies } from "next/headers";
// import { TaskType } from "../createTask";
// // Function to update event in Google Calendar
// async function updateGoogleCalendarEvent(
//   eventId: string,
//   task: TaskType | AppointmentToUpdate,
// ) {
//   if (!task.date) return;

//   const cookie = await cookies();
//   const refreshToken = cookie.get("googleCalendarToken")?.value;

//   const clientId = env("GMAIL_CLIENT_ID");
//   const clientSecret = env("GMAIL_CLIENT_SECRET");

//   const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);

//   if (refreshToken)
//     oAuth2Client.setCredentials({ refresh_token: refreshToken });

//   const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

//   const startDateTime = new Date(
//     `${task.date.split("T")[0]}T${task.startTime}:00.000Z`,
//   );
//   const endDateTime = new Date(
//     `${task.date.split("T")[0]}T${task.endTime}:00.000Z`,
//   );

//   const event: {
//     summary: string;
//     start: {
//       dateTime: string;
//       timeZone: string;
//     };
//     end: {
//       dateTime: string;
//       timeZone: string;
//     };
//     description?: string;
//   } = {
//     summary: task.title,

//     start: {
//       dateTime: startDateTime.toISOString(),
//       timeZone: "UTC", // Adjust timezone if necessary
//     },
//     end: {
//       dateTime: endDateTime.toISOString(),
//       timeZone: "UTC",
//     },
//   };

//   if ("description" in task) event.description = task.description;

//   try {
//     const response = await calendar.events.update({
//       auth: oAuth2Client,
//       calendarId: "primary",
//       eventId: eventId,
//       resource: event,
//     });

//     console.log("Google Calendar Event updated:", response);
//     return response.data;
//   } catch (error) {
//     //@ts-ignore
//     if (error?.response?.data?.error === "invalid_grant") {
//       const cookieStore = await cookies();
//       cookieStore.delete("googleCalendarToken");
//       console.log("Invalid or expired refresh token. Token deleted.");
//     }
//     console.error("Error updating Google Calendar event:", error);
//     throw error;
//   }
// }

// export default updateGoogleCalendarEvent;

"use server";
import { AppointmentToUpdate } from "@/actions/appointment/editAppointment";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import { TaskType } from "../createTask";

// Function to update event in Google Calendar
async function updateGoogleCalendarEvent(
  eventId: string,
  task: TaskType | AppointmentToUpdate,
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
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "UTC",
    },
    description:
      "description" in task && task.description ? task.description : undefined,
  };

  try {
    const response = await calendar.events.update({
      calendarId: "primary",
      eventId: eventId,
      requestBody: event, // Use requestBody instead of resource
    });

    // console.log("Google Calendar Event updated:", response);
    return response.data;
  } catch (error) {
    // @ts-ignore
    if (error?.response?.data?.error === "invalid_grant") {
      const cookieStore = await cookies();
      cookieStore.delete("googleCalendarToken");
      console.log("Invalid or expired refresh token. Token deleted.");
    }
    console.error("Error updating Google Calendar event:", error);
    throw error;
  }
}

export default updateGoogleCalendarEvent;
