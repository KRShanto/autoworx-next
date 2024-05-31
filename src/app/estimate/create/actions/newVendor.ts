"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";

export async function newVendor({
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  state,
  zip,
  company,
  description,
}: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  company?: string;
  description?: string;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session?.user?.companyId;

  const newVendor = await db.vendor.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      companyName: company,
      description,
      companyId,
    },
  });

  return {
    type: "success",
    data: newVendor,
  };
}
