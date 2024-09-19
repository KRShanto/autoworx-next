import Pusher from "pusher-js";
import { env } from "next-runtime-env";

export const pusher = new Pusher(env("NEXT_PUBLIC_PUSHER_KEY") as string, {
  cluster: env("NEXT_PUBLIC_PUSHER_CLUSTER") as string,
});
