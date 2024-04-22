import "server-only";
import { google } from "googleapis";
import { Task, User } from "@prisma/client";
import { db } from "./db";

const GOOGLE_URL_CALLBACK = process.env.GOOGLE_URL_CALLBACK;
const GOOGLE_URL_REDIRECT = process.env.GOOGLE_URL_REDIRECT;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_URL_CALLBACK,
);

// Generate a URL that asks permissions for Google Calendar scopes
export function getGoogleAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });
}

// Get the token from the code
export async function getGoogleToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// TODO: Not sure this feature is needed
// // Get events from Google Calendar
// export async function getGoogleEvents(tokens: {
//   access_token: string;
//   refresh_token: string;
// }) {
//   oauth2Client.setCredentials(tokens);

//   const calendar = google.calendar({ version: "v3", auth: oauth2Client });
//   const res = await calendar.events.list({
//     calendarId: "primary",
//     timeMin: new Date().toISOString(),
//     orderBy: "startTime",
//   });

//   return res.data.items;
// }

// Add an event to Google Calendar
export async function addGoogleEvent({
  userId,
  taskId,
}: {
  userId: number;
  taskId: number;
}) {
  const task = await db.task.findUnique({ where: { id: taskId } });
  const oauthTokens = await db.oAuthToken.findFirst({
    where: { userId },
  });

  if (!oauthTokens) return;

  oauth2Client.setCredentials({
    refresh_token: oauthTokens.refreshToken,
    access_token: oauthTokens.accessToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const res = calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: task?.title,
      start: { dateTime: task?.startTime, date: task?.date },
      end: { dateTime: task?.endTime, date: task?.date },
    },
  });

  console.log("response: ", res);

  return res.data;
}
