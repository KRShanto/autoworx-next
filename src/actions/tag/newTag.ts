"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export default async function newTag({
  name,
  textColor,
  bgColor,
}: {
  name: string;
  textColor?: string;
  bgColor?: string;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newTag = await db.tag.create({
    data: {
      companyId,
      name,
      textColor: textColor || "black",
      bgColor: bgColor || "white",
    },
  });

  revalidatePath("/estimate/create");
  revalidatePath("/estimate/edit");

  return {
    type: "success",
    data: newTag,
  };
}
