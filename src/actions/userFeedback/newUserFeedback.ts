"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";

export async function newUserFeedback(data: {
  title: string;
  description: string;
  snapshotImage?: string;
  attachments?: string[];
}) {
  const user = await getUser();
  const feedback = await db.userFeedback.create({
    data: {
      title: data.title,
      description: data.description,
      snapshotImage: data.snapshotImage,
      companyId: user.companyId,
      userId: user.id,
      UserFeedbackAttachment: {
        create: data?.attachments?.map((attachment: string) => ({
          fileName: attachment,
        })),
      },
    },
  });
  return {
    success: true,
    data: feedback,
  };
}
