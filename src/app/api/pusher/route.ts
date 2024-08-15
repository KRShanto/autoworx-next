import { getPusherInstance } from "@/lib/pusher/server";
import { AuthSession } from "@/types/auth";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import { sendType } from "@/types/Chat";

type TMessageDate = {
  from: number;
  to?: number;
  groupId?: number;
  message: string;
};

const pusher = getPusherInstance();

// POST /api/pusher/trigger
// Trigger a message to the client
// Body: { message, roomId }
export async function POST(req: Request, res: Response) {
  const session = (await auth()) as AuthSession | null;
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = parseInt(session.user.id);
  const body = await req.json();
  const { to, message, type } = body;

  if (!to || !message) {
    return new Response("Missing to or message", { status: 400 });
  }

  try {
    let channel = `user-${to}`;
    let messageData: TMessageDate = {
      from: userId,
      to,
      message,
    };
    if (type === sendType.Group) {
      channel = `group-${to}`;
      messageData = {
        from: userId,
        groupId: to,
        message,
      };
    }
    // send the raw message to the room
    pusher.trigger(channel, "message", {
      from: userId,
      message,
    });
    // Save to the database
    await db.message.create({
      data: messageData,
    });

    revalidatePath("/communication/internal");

    // send json
    return new Response(
      JSON.stringify({ success: true, message: "Message sent" }),
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to send message", { status: 500 });
  }
}
