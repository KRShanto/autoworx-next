import { getPusherInstance } from "@/lib/pusher/server";
import { AuthSession } from "@/types/auth";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";

const pusher = getPusherInstance();

// POST /api/pusher/trigger
// Trigger a message to the client
// Body: { message, roomId }
export async function POST(req: Request, res: Response) {
  const session = (await auth()) as AuthSession | null;
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = parseInt(session.user.id);
  const body = await req.json();
  const { to, message } = body;

  if (!to || !message) {
    return new Response("Missing to or message", { status: 400 });
  }

  try {
    // send the raw message to the room
    pusher.trigger(`user-${to}`, "message", {
      from: userId,
      message,
    });

    // Save to the database
    await db.message.create({
      data: {
        from: userId,
        to,
        message,
      },
    });

    // revalidatePath("/communication/internal");

    // send json
    return new Response(
      JSON.stringify({ success: true, message: "Message sent" }),
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to send message", { status: 500 });
  }
}
