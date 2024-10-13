"use server";

import { db } from "@/lib/db";

export const getUserById = async (id: number) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return { type: "success", data: user };
    } else {
      return { type: "fail", data: null };
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return { type: "success", data: user };
    } else {
      return { type: "fail", data: null };
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
