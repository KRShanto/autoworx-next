"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";

export async function newUserFeedback(data: {
  whatHappened: string;
  whatExpected: string;
  snapshotImage?: string;
  attachments?: string[];
}) {
  const user = await getUser();
  const feedback = await db.userFeedback.create({
    data: {
      whatHappened: data.whatHappened,
      whatExpected: data.whatExpected,
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
