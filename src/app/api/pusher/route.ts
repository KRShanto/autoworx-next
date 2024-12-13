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

/**
 * Handles POST requests to trigger a message to the client.
 *
 * @param req - The request object.
 * @returns A response indicating the result of the operation.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { to, message, type, attachmentFiles, requestEstimate } = body;
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession | null;
    if (!session) throw new Error("Unauthorized");
    const userId = parseInt(session.user.id);
    if (!to || (!message && !attachmentFiles && !requestEstimate)) {
      throw new Error("Missing some argument for message");
    }
    let channel = `user-${userId}`;
    let messageData: TMessageDate = {
      from: userId,
      to,
      message,
      requestEstimateId: requestEstimate ? requestEstimate?.id : null,
    };

    // Send a message for group
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

    // Save the message to the database
    const createdMessage = await db.message.create({
      data: messageData,
    });

    let attachments = null;
    // Handle attachment file upload
    if (attachmentFiles) {
      const attachmentFromDB = await db.message.update({
        where: {
          id: createdMessage.id,
        },
        data: {
          attachment: {
            create: attachmentFiles.map((attachmentFile: any) => ({
              fileName: attachmentFile.fileName, // File name (e.g., 'image.png')
              fileType: attachmentFile.fileType, // File type (e.g., 'image/png', 'application/pdf')
              fileUrl: attachmentFile.fileUrl,
              fileSize: `${(attachmentFile.fileSize / 1024 / 1024).toPrecision(2)} MB`,
            })),
          },
        },
        include: {
          attachment: true,
        },
      });
      attachments = attachmentFromDB.attachment;
    }

    // Send the raw message to the room
    pusher.trigger(channel, "message", {
      groupId: type === sendType.Group ? to : null,
      to: type !== sendType.Group ? to : null,
      from: userId,
      message,
      attachment: attachmentFiles
        ? attachmentFiles.map((attachmentFile: any) => ({
            ...attachmentFile,
            fileSize: `${(attachmentFile?.fileSize / 1024 / 1024).toPrecision(2)} MB`,
          }))
        : null,
      requestEstimate: requestEstimate ? requestEstimate : null,
    });

    // Revalidate paths to update the cache
    revalidatePath("/communication/internal");
    revalidatePath("/communication/collaboration");

    // Send JSON response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent",
        attachments,
        newMessage: createdMessage,
      }),
    );
  } catch (e: any) {
    console.error(e);
    return new Response(
      JSON.stringify({ message: "Failed to send message", success: false }),
      {
        status: 500,
      },
    );
  }
}
