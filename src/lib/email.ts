import "server-only";
import nodemailer from "nodemailer";

export async function sendEmail(props: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER as string,
      pass: process.env.GMAIL_PASS as string,
    },
  });

  await transporter.sendMail(props);
}
