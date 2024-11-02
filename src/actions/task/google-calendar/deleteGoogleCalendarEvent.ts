import { google } from "googleapis";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";

// Function to delete event in Google Calendar
async function deleteGoogleCalendarEvent(eventId: string) {
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

export default deleteGoogleCalendarEvent;
