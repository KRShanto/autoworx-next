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
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
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
  const { to, message, type, attachmentFile } = body;
  if (!to || (!message && !attachmentFile)) {
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
        ...messageData,
        groupId: to,
        message,
      };
    }
    // send the raw message to the room
    pusher.trigger(channel, "message", {
      from: userId,
      message,
      attachment: attachmentFile
        ? {
            ...attachmentFile,
            fileSize: `${(attachmentFile?.fileSize / 1024 / 1024).toPrecision(2)} MB`,
          }
        : null,
    });
    // Save to the database
    const createdMessage = await db.message.create({
      data: messageData,
    });
    let attachment = null;
    // attachment file upload
    if (attachmentFile) {
      attachment = await db.attachment.create({
        data: {
          messageId: createdMessage.id,
          fileName: attachmentFile.fileName, // File name (e.g., 'image.png')
          fileType: attachmentFile.fileType, // File type (e.g., 'image/png', 'application/pdf')
          fileUrl: attachmentFile.fileUrl,
          fileSize: `${(attachmentFile.fileSize / 1024 / 1024).toPrecision(2)} MB`,
        },
      });
    }

    revalidatePath("/communication/internal");

    // send json
    return new Response(
      JSON.stringify({ success: true, message: "Message sent", attachment }),
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to send message", { status: 500 });
  }
}
