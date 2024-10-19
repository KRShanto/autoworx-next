"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

export const getCompanyUser = async () => {
  const companyId = await getCompanyId();
  try {
    const user = await db.user.findMany({
      where: { companyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        companyId: true,
        employeeType: true,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
