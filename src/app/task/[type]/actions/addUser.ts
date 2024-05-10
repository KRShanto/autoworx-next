"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function addUser({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match",
      field: "password",
    };
  }

  const encPassword = await bcrypt.hash(password, 10);
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  await db.user.create({
    data: {
      name,
      email,
      password: encPassword,
      role: "employee",
      companyId,
    },
  });

  revalidatePath("/employee");
}
