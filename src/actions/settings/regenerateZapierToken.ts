"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import generateZapierToken from "@/lib/generateZapierToken";
import { revalidatePath } from "next/cache";

export const regenerateZapierToken = async () => {
  try {
    let companyId = await getCompanyId();
    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        zapierToken: generateZapierToken(),
      },
    });
    revalidatePath("/settings/security");
    return { type: "success", data: updatedCompany };
  } catch (err: any) {
    throw new Error(err);
  }
};
