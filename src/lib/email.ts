import "server-only";
import nodemailer from "nodemailer";

export async function sendEmail(props: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  // console.log("email props: ", props);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail(props);
}
