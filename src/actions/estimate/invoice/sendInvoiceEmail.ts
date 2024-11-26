"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import getUser from "@/lib/getUser";

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

  // const html = `
  //   <html>
  //     <body>
  //       <h1>Invoice</h1>
  //       <p>Invoice ID: ${invoice.id}</p>
  //       <p>Invoice Date: ${invoice.createdAt}</p>
  //       <p>Amount: ${invoice.grandTotal}</p>
  //       <p>Company: ${invoice.company.name}</p>
  //       <p>Client: ${invoice.client?.firstName} ${invoice.client?.lastName}</p>
  //       <p>Vehicle: ${invoice.vehicle?.make} ${invoice.vehicle?.model} ${invoice.vehicle?.year}</p>
  //       <p>Invoice Items:</p>
  //       <ul>
  //         ${invoice.invoiceItems
  //           .map(
  //             (item) => `
  //           <li>
  //             <p>Service: ${item.service?.name}</p>
  //             <p>Materials: ${item.materials.map((m) => m.name).join(", ")}</p>
  //             <p>Labor: ${item.labor?.hours} hours</p>
  //           </li>
  //         `,
  //           )
  //           .join("")}
  //       </ul>
  //     </body>
  //   </html>
  // `;

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

  await sendEmail({
    from: "AutoWorx",
    to: invoice.client.email!,
    subject: variabledSubject,
    html: variabledBody,
    text: variabledBody || "",
  });
  return {
    success: true,
  };
}
