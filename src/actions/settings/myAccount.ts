"use server";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function editMyAccountInfo({
  firstName,
  lastName,
  image,
  phone,
  address,
  city,
  state,
  zip,
}: {
  firstName: string;
  lastName: string;
  image: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}): Promise<{
  success: boolean;
}> {
  try {
    const session = (await auth()) as AuthSession;
    const userId = session.user.id;

    console.log("edit profile", { image });

    const user = await db.user.update({
      where: {
        id: +userId,
      },
      data: {
        firstName,
        lastName,
        image,
        phone,
        address,
        city,
        state,
        zip,
      },
    });

    revalidatePath("/settings/my-account");

    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
): Promise<{
  success: boolean;
}> {
  try {
    const session = (await auth()) as AuthSession;
    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: {
        id: +userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let comparePassword = await bcrypt.compare(currentPassword, user.password);

    if (!comparePassword) {
      throw new Error("Password is incorrect");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("Password don't match");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: {
        id: +userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
