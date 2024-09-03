"use server";

import { db } from "@/lib/db";
import { Company } from "@prisma/client";
import { revalidatePath } from "next/cache";

type TCompanyData = {
  name: string;
  businessId: string | null;
  businessType: string | null;
  phone: string | null;
  industry: string | null;
  website: string | null;
  address: string | null;
  city: string;
  state: string;
  zip: string;
  image?: string;
};

export const updateCompany = async (
  companyId: number,
  companyData: TCompanyData,
) => {
  const {
    name,
    businessId,
    businessType,
    phone,
    industry,
    website,
    address,
    city,
    state,
    zip,
    image,
  } = companyData;
  try {
    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        name,
        businessId,
        businessType,
        phone,
        industry,
        website,
        address,
        city,
        state,
        zip,
        image,
      },
    });
    revalidatePath("/settings/business");
    return { type: "success", data: updatedCompany };
  } catch (err: any) {
    throw new Error(err);
  }
};
