"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";

export async function newUserFeedback(data: any) {
  console.log("🚀 ~ newUserFeedback ~ data:", data);
  const user = await getUser();
  const feedback = await db.userFeedback.create({
    data: {
      title: data.title,
      description: data.description,
      snapshotImage: data.snapshotImage,
      companyId: user.companyId,
      userId: user.id,
    },
  });
  return {
    success: true,
    data: feedback,
  };
}
