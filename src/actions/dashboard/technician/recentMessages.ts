import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import {
  Attachment,
  Group,
  Message as PrismaMessage,
  User as PrismaUser,
} from "@prisma/client";

interface FullMessage {
  id: number;
  to: PrismaUser | null; // Modified to include user object instead of ID
  from: PrismaUser | null; // Modified to include user object instead of ID
  message: string;
  groupId: number | null;
  requestEstimateId: number | null;
  createdAt: Date;
  updatedAt: Date;
  attachment: Attachment | null; // Including attachment if available
  group: Group | null; // Including group info if available
}

export const fetchRecentMessages = async (): Promise<FullMessage[]> => {
  try {
    const user = await getUser();
    const messages = await db.message.findMany({
      where: {
        OR: [{ from: user.id }, { to: user.id }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        attachment: true,
        group: true,
      },
    });

    let fullMessages: FullMessage[] = []; // Array to store the processed messages

    for (const message of messages) {
      if (message.from === user.id) {
        const to = message.to
          ? await db.user.findFirst({ where: { id: message.to } })
          : null;
        fullMessages.push({
          ...message,
          from: user,
          to,
        });
      } else {
        const from = await db.user.findFirst({ where: { id: message.from } });
        fullMessages.push({
          ...message,
          to: user,
          from,
        });
      }
    }

    return fullMessages;
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    throw new Error("Failed to fetch recent messages");
  }
};
