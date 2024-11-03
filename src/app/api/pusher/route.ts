import { getPusherInstance } from "@/lib/pusher/server";
import { AuthSession } from "@/types/auth";
import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import { sendType } from "@/types/Chat";

type TMessageDate = {
  from: number;
  to?: number;
  groupId?: number;
  message: string;
  requestEstimateId?: number;
};

const pusher = getPusherInstance();

// POST /api/pusher/trigger
// Trigger a message to the client
// Body: { message, roomId }
export async function POST(req: Request) {
  const body = await req.json();
  const { to, message, type, attachmentFile, requestEstimate } = body;
  try {
    const session = (await auth()) as AuthSession | null;
    if (!session) throw new Error("Unauthorized");
    const userId = parseInt(session.user.id);
    if (!to || (!message && !attachmentFile && !requestEstimate)) {
      throw new Error("Missing some argument for message");
    }
    let channel = `user-${userId}`;
    console.log({ requestEstimate });
    let messageData: TMessageDate = {
      from: userId,
      to,
      message,
      requestEstimateId: requestEstimate ? requestEstimate?.id : null,
    };
    console.log({ messageData });
    // send a message for group
    if (type === sendType.Group) {
      const isUserInExistGroup = await db.group.findFirst({
        where: {
          id: to,
          users: {
            some: {
              id: userId,
            },
          },
        },
      });
      if (!isUserInExistGroup) {
        return new Response(
          JSON.stringify({
            message: "User is not in the group",
            success: false,
          }),
          { status: 400 },
        );
      }
      channel = `group-${to}`;
      messageData = {
        from: userId,
        groupId: to,
        message,
      };
    }
    // send the raw message to the room
    pusher.trigger(channel, "message", {
      groupId: type === sendType.Group ? to : null,
      from: userId,
      message,
      attachment: attachmentFile
        ? {
            ...attachmentFile,
            fileSize: `${(attachmentFile?.fileSize / 1024 / 1024).toPrecision(2)} MB`,
          }
        : null,
      requestEstimate: requestEstimate ? requestEstimate : null,
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
      JSON.stringify({
        success: true,
        message: "Message sent",
        attachment,
        newMessage: createdMessage,
      }),
    );
  } catch (e: any) {
    console.log({ error: e.message });
    console.error(e);
    return new Response(
      JSON.stringify({ message: "Failed to send message", success: false }),
      {
        status: 500,
      },
    );
  }
}
