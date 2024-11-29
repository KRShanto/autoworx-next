"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type TCompanyData = {
  name: string;
  businessId: string | null;
  businessType: string | null;
  phone: string | null;
  email: string | null;
  industry: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  image?: string | null;
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
    email,
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
        email,
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
