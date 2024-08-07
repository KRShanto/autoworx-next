"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

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

  const encPassword = await bcrypt.hash(password, 10);
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

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

  revalidatePath("/task");
  revalidatePath("/employee");

  return {
    type: "success",
  };
}
