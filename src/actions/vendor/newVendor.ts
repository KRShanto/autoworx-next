"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { createVendorValidationSchema } from "@/validations/schemas/vendor/vendor.validation";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { validate } from "node-cron";
import { TErrorHandler } from "@/types/globalError";

export async function newVendor({
  name,
  email,
  phone,
  address,
  city,
  state,
  zip,
  company,
  website,
  notes,
}: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  company?: string;
  website?: string;
  notes?: string;
}): Promise<ServerAction | TErrorHandler> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session?.user?.companyId;

    const validatedVendorData = await createVendorValidationSchema.parseAsync({
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      companyName: company,
      website,
      notes,
    });

    const newVendor = await db.vendor.create({
      data: {
        name: validatedVendorData.name,
        email: validatedVendorData.email,
        phone: validatedVendorData.phone,
        address: validatedVendorData.address,
        city: validatedVendorData.city,
        state: validatedVendorData.state,
        zip: validatedVendorData.zip,
        companyName: validatedVendorData.companyName,
        website: validatedVendorData.website,
        notes: validatedVendorData.notes,
        companyId,
      },
    });

    revalidatePath("/inventory/vendor");

    return {
      type: "success",
      data: newVendor,
    };
  } catch (err) {
    return errorHandler(err);
  }
}
