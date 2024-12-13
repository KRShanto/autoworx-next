"use server";

/**
 * Edits the account information of the current user.
 *
 * @param firstName - The new first name of the user.
 * @param lastName - The new last name of the user.
 * @param image - The new profile image of the user.
 * @param phone - The new phone number of the user.
 * @param address - The new address of the user.
 * @param city - The new city of the user.
 * @param state - The new state of the user.
 * @param zip - The new zip code of the user.
 * @returns An object indicating the success status of the operation.
 * @throws Will throw an error if the update operation fails.
 */
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

    // Update the user information in the database
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

    // Revalidate the cache for the my-account settings page
    revalidatePath("/settings/my-account");

    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

/**
 * Changes the password of the current user.
 *
 * @param currentPassword - The current password of the user.
 * @param newPassword - The new password to be set.
 * @param confirmNewPassword - The confirmation of the new password.
 * @returns An object indicating the success status of the operation.
 * @throws Will throw an error if the update operation fails.
 */
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

    // Compare the current password with the stored password
    let comparePassword = await bcrypt.compare(currentPassword, user.password);

    if (!comparePassword) {
      throw new Error("Password is incorrect");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("Password don't match");
    }

    // Hash the new password and update it in the database
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
