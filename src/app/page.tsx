import Title from "@/components/Title";
import { auth } from "./auth";

export default async function Page() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("AUTH_SECRET:", process.env.AUTH_SECRET);
  console.log("PUSHER_ID:", process.env.PUSHER_ID);
  console.log("PUSHER_KEY:", process.env.PUSHER_KEY);
  console.log("PUSHER_SECRET:", process.env.PUSHER_SECRET);
  console.log("PUSHER_CLUSTER:", process.env.PUSHER_CLUSTER);
  console.log("NEXT_PUBLIC_PUSHER_KEY:", process.env.NEXT_PUBLIC_PUSHER_KEY);
  console.log(
    "NEXT_PUBLIC_PUSHER_CLUSTER:",
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  );
  console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
  console.log("GMAIL_CLIENT_ID:", process.env.GMAIL_CLIENT_ID);
  console.log("GMAIL_CLIENT_SECRET:", process.env.GMAIL_CLIENT_SECRET);
  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

  return <Title>Dashboard</Title>;
}
