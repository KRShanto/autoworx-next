"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type TGroup = {
  name: string;
  users: { id: number }[];
};

export const createGroup = async ({ name, users }: TGroup) => {
  try {
    const groupData = await db.group.create({
      data: {
        name: name,
        users: {
          connect: users,
        },
      },
    });
    revalidatePath("/communication/internal");
    return { status: 200, data: groupData };
  } catch (err) {
    throw err;
  }
};
