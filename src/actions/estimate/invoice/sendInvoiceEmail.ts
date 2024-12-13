"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import getUser from "@/lib/getUser";

/**
 * Sends an email with the invoice details to the client.
 * @param invoiceId - The ID of the invoice to send.
 * @returns An object indicating success or error.
 */
export async function sendInvoiceEmail({ invoiceId }: { invoiceId: string }) {
  const user = await getUser();
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      company: true,
      invoiceItems: {
        include: {
          service: true,
          materials: true,
          labor: true,
        },
      },
      photos: true,
      tasks: true,
      column: true,
      user: true,
      client: true,
      vehicle: true,
    },
  });

  let template = await db.companyEmailTemplate.findFirst({
    where: { companyId: user.companyId },
  });

  if (!template) {
    return {
      success: false,
      message:
        "No Email Template Found. Please create one in Settings > Estimates & Invoice",
    };
  }
  if (!invoice || !invoice.client) {
    throw new Error("Invoice not found");
  }

  // Replace placeholders in the email template with actual values
  let variabledSubject = template.subject
    ?.replace("<CLIENT>", invoice.client?.firstName)
    .replace(
      "<VEHICLE>",
      invoice.vehicle?.make +
        " " +
        invoice.vehicle?.model +
        " " +
        invoice.vehicle?.year,
    );
  let variabledBody = template.message
    ?.replace("<CLIENT>", invoice.client?.firstName)
    .replace(
      "<VEHICLE>",
      invoice.vehicle?.make +
        " " +
        invoice.vehicle?.model +
        " " +
        invoice.vehicle?.year,
    );

  const html = `
    <html>
      <body>
        ${variabledBody}
      </body>
    </html>
  `;

  // Send the email
  await sendEmail({
    to: invoice.client.email!,
    subject: variabledSubject,
    html: variabledBody,
    text: variabledBody || "",
  });
  return {
    success: true,
  };
}
