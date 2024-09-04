"use server";
import { auth } from "@/app/auth";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { Company, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getAllCompany(): Promise<{
  success: boolean;
  data?: {
    connectedCompanies: Company[] | [];
    unconnectedCompanies: Company[] | [];
  };
}> {
  try {
    const userCompanyId = await getCompanyId();

    const connectedCompanyIds = await db.companyJoin.findMany({
      where: {
        OR: [{ companyOneId: userCompanyId }, { companyTwoId: userCompanyId }],
      },
      select: {
        companyOneId: true,
        companyTwoId: true,
      },
    });

    const connectedIds = connectedCompanyIds.flatMap((join) =>
      [join.companyOneId, join.companyTwoId].filter(
        (id) => id !== userCompanyId,
      ),
    );

    const connectedCompanies = await db.company.findMany({
      where: {
        id: {
          in: connectedIds,
        },
      },
    });

    const unconnectedCompanies = await db.company.findMany({
      where: {
        id: {
          notIn: connectedIds,
          not: userCompanyId,
        },
      },
    });

    return {
      success: true,
      data: { connectedCompanies, unconnectedCompanies },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

export async function connectWithCompany(targetCompanyId: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const userCompanyId = await getCompanyId();

    // Check if the connection already exists
    const existingConnection = await db.companyJoin.findFirst({
      where: {
        OR: [
          { companyOneId: userCompanyId, companyTwoId: targetCompanyId },
          { companyOneId: targetCompanyId, companyTwoId: userCompanyId },
        ],
      },
    });

    if (existingConnection) {
      return {
        success: false,
        message: "Connection already exists with this company.",
      };
    }

    // Create a new connection
    await db.companyJoin.create({
      data: {
        companyOneId: userCompanyId,
        companyTwoId: targetCompanyId,
      },
    });

    return {
      success: true,
      message: "Successfully connected with the company.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to connect with the company.",
    };
  }
}
