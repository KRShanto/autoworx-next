import formData from "form-data";
import Mailgun from "mailgun.js";
import { env } from "next-runtime-env";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: env("MAILGUN_API_KEY") as string,
});

export default async function sendMail() {
  mg.messages
    .create("sandbox-123.mailgun.org", {
      from: "Excited User <mailgun@sandbox1035bad1137946f88f9ad42e2a329524.mailgun.org>",
      to: ["example@example.com"],
      subject: "Hello",
      text: "Testing some Mailgun awesomeness!",
      html: "<h1>Testing some Mailgun awesomeness!</h1>",
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
}
