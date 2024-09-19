import Pusher from "pusher-js";

console.log("Pusher key (client): ", process.env.NEXT_PUBLIC_PUSHER_KEY);

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});
