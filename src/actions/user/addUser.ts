"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

/**
 * Adds a new user to the database.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param confirmPassword - The confirmation of the password.
 * @returns An object containing the status of the action.
 */
export async function addUser({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ServerAction> {
  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match",
      field: "password",
      type: "error",
    };
  }

  const encPassword = await bcrypt.hash(password, 10); // Encrypt the password
  const session = (await auth()) as AuthSession; // Get the current session
  const companyId = session.user.companyId; // Get the company ID from the session

  await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: encPassword,
      role: "employee",
      companyId,
    },
  });

  // Revalidate paths to update the cache
  revalidatePath("/task");
  revalidatePath("/employee");

  return {
    type: "success",
  };
}
