import Pusher from "pusher-js";
import { env } from "next-runtime-env";

console.log("Pusher key (client): ", env("NEXT_PUBLIC_PUSHER_KEY"));

export const pusher = new Pusher(env("NEXT_PUBLIC_PUSHER_KEY") as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});
