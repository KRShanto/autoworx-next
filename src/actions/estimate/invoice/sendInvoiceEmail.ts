"use server";

import { sendEmail } from "@/lib/email";
import { db } from "@/lib/db";

export async function sendInvoiceEmail({ invoiceId }: { invoiceId: string }) {
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
      status: true,
      user: true,
      client: true,
      vehicle: true,
    },
  });

  if (!invoice || !invoice.client) {
    throw new Error("Invoice not found");
  }

  const html = `
    <html>
      <body>
        <h1>Invoice</h1>
        <p>Invoice ID: ${invoice.id}</p>
        <p>Invoice Date: ${invoice.createdAt}</p>        
        <p>Amount: ${invoice.grandTotal}</p>
        <p>Company: ${invoice.company.name}</p>
        <p>Client: ${invoice.client?.firstName} ${invoice.client?.lastName}</p>
        <p>Vehicle: ${invoice.vehicle?.make} ${invoice.vehicle?.model} ${invoice.vehicle?.year}</p>
        <p>Invoice Items:</p>
        <ul>
          ${invoice.invoiceItems
            .map(
              (item) => `
            <li>
              <p>Service: ${item.service?.name}</p>
              <p>Materials: ${item.materials.map((m) => m.name).join(", ")}</p>
              <p>Labor: ${item.labor?.hours} hours</p>
            </li>
          `,
            )
            .join("")}
        </ul>
      </body>
    </html>
  `;

  await sendEmail({
    from: "AutoWorx",
    to: invoice.client.email!,
    subject: "Invoice from AutoWorx",
    html,
    text: "You've received an invoice from AutoWorx",
  });
}
