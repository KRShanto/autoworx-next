"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

/**
 * Creates a new tag for the current company.
 * @param name - The name of the tag.
 * @param textColor - The text color of the tag (optional).
 * @param bgColor - The background color of the tag (optional).
 * @returns An object containing the status and the new tag data.
 */
export default async function newTag({
  name,
  textColor,
  bgColor,
}: {
  name: string;
  textColor?: string;
  bgColor?: string;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession; // Get the current session
  const companyId = session.user.companyId; // Get the company ID from the session

  // Create a new tag in the database
  const newTag = await db.tag.create({
    data: {
      companyId,
      name,
      textColor: textColor || "black",
      bgColor: bgColor || "white",
    },
  });

  // Revalidate paths to update the cache
  revalidatePath("/estimate/create");
  revalidatePath("/estimate/edit");

  return {
    type: "success",
    data: newTag,
  };
}
