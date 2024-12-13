"use server";
import { ASANA_BASE_URL, USER_FEEDBACK_EMAILS } from "@/lib/consts";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import getUser from "@/lib/getUser";
import {
  Company,
  User,
  UserFeedback,
  UserFeedbackAttachment,
} from "@prisma/client";
import { env } from "next-runtime-env";

/**
 * Creates a new user feedback entry in the database and sends notifications.
 *
 * @param {Object} data - The feedback details.
 * @param {string} data.whatHappened - Description of what happened.
 * @param {string} data.whatExpected - Description of what was expected.
 * @param {string} [data.snapshotImage] - URL of the snapshot image.
 * @param {string[]} [data.attachments] - List of attachment URLs.
 * @returns {Promise<Object>} The result of the operation.
 */
export async function newUserFeedback(data: {
  whatHappened: string;
  whatExpected: string;
  snapshotImage?: string;
  attachments?: string[];
}) {
  // Get the current user
  const user = await getUser();

  // Create a new user feedback entry in the database
  const feedback = await db.userFeedback.create({
    data: {
      whatHappened: data.whatHappened,
      whatExpected: data.whatExpected,
      snapshotImage: data.snapshotImage,
      companyId: user.companyId,
      userId: user.id,
      UserFeedbackAttachment: {
        create: data?.attachments?.map((attachment: string) => ({
          fileName: attachment,
        })),
      },
    },
    include: {
      UserFeedbackAttachment: true,
      user: true,
      company: true,
    },
  });

  // Create a new task in Asana for the feedback
  await createAsanaTask(feedback);

  return {
    success: true,
    data: feedback,
  };
}

/**
 * Creates a new task in Asana for the user feedback.
 *
 * @param {Object} data - The feedback data.
 * @param {UserFeedback} data - The user feedback data.
 * @param {UserFeedbackAttachment[]} data.UserFeedbackAttachment - List of feedback attachments.
 * @param {User} data.user - The user who submitted the feedback.
 * @param {Company} data.company - The company of the user.
 */
async function createAsanaTask(
  data: UserFeedback & {
    UserFeedbackAttachment: UserFeedbackAttachment[];
    user: User;
    company: Company;
  },
) {
  console.log("Creating Asana task...");

  // Send a request to Asana to create a new task
  const res = await fetch(`${ASANA_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env("ASANA_PERSONAL_TOKEN")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        custom_fields: {
          // Priority: High
          1208787743472524: "1208787743472527",
          // User Reported Issue: True
          1208863541738742: "1208863541738745",
        },
        name: data.whatHappened,
        notes: `User Id: ${data.userId}\nUser Name: ${data.user.firstName}\nCompany Id: ${data.companyId}\nCompany Name: ${data.company.name}\n\nWhat Happened: ${data.whatHappened}\n\nWhat Was Expected: ${data.whatExpected}`,
        projects: [
          // Autoworx Software
          "1208787725739116",
        ],
        workspace: `${env("ASANA_WORKSPACE")}`,
      },
    }),
  });

  const json = await res.json();
  console.log("Asana task created:", json);

  // Send email notifications to the specified recipients
  USER_FEEDBACK_EMAILS.forEach(async (email) => {
    sendEmail({
      to: email,
      subject: `New User Feedback: ${data.user.firstName} ${data.user.lastName}`,
      text: `A new user feedback has been submitted by ${data.user.firstName} ${data.user.lastName}.`,
      html: (await generateFeedbackHTML(data)).fullHTML,
    });
  });
}

/**
 * Generates the HTML content for the user feedback email.
 *
 * @param {Object} feedback - The feedback data.
 * @param {UserFeedback} feedback - The user feedback data.
 * @param {UserFeedbackAttachment[]} feedback.UserFeedbackAttachment - List of feedback attachments.
 * @param {User} feedback.user - The user who submitted the feedback.
 * @param {Company} feedback.company - The company of the user.
 * @returns {Promise<Object>} The generated HTML content.
 */
export async function generateFeedbackHTML(
  feedback: UserFeedback & {
    UserFeedbackAttachment: UserFeedbackAttachment[];
    user: User;
    company: Company;
  },
) {
  const {
    whatHappened,
    whatExpected,
    snapshotImage,
    UserFeedbackAttachment,
    userId,
    companyId,
    createdAt,
  } = feedback;

  // Generate HTML for the attachments
  const attachmentsHTML = UserFeedbackAttachment?.length
    ? UserFeedbackAttachment.map(
        (attachment) =>
          `<li><img src="${attachment.fileName}" alt="Attachment" style="max-width: 100%; margin-bottom: 10px;"/></li>`,
      ).join("")
    : "<li>No attachments</li>";

  // Generate the body HTML content
  const bodyHTML = `
    <body>
      <div>
        <h1>User Feedback</h1>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Username:</strong> ${feedback.user.firstName} ${feedback.user.lastName}</p>
        <p><strong>Company ID:</strong> ${companyId}</p>
        <p><strong>Company Name:</strong> ${feedback.company.name}</p>
        <p><strong>Submitted On:</strong> ${new Date(createdAt).toLocaleString()}</p>

        <h2>What Happened</h2>
        <p>${whatHappened}</p>

        <h2>What Was Expected</h2>
        <p>${whatExpected}</p>

        ${snapshotImage ? `<h2>Snapshot Image</h2><img src="${snapshotImage}" alt="Snapshot" style="max-width:100%;"/>` : ""}

        <h2>Attachments</h2>
        <div>
          <ul>
            ${attachmentsHTML}
          </ul>
        </div>
      </div>
    </body>
  `;

  // Generate the full HTML content
  const fullHTML = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
          .attachments {
            margin-top: 15px;
          }
          .attachments ul {
            list-style-type: none;
            padding: 0;
          }
          .attachments li {
            margin: 10px 0;
          }
          img {
            border: 1px solid #ddd;
            border-radius: 4px;
          }
        </style>
      </head>
      ${bodyHTML}
    </html>
  `;

  return {
    fullHTML,
    bodyHTML,
  };
}
