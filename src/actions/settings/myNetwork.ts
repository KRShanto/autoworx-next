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
    currentCompany: Company | null;
  };
}> {
  try {
    const userCompanyId = await getCompanyId();

    const currentCompany = await db.company.findUnique({
      where: {
        id: userCompanyId,
      },
    });

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
      data: { connectedCompanies, unconnectedCompanies, currentCompany },
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

export async function toggleBusinessVisibility(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const companyId = await getCompanyId();

    // Fetch the current business visibility status
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { businessVisibility: true },
    });

    if (!company) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    // Toggle the business visibility status
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: { businessVisibility: !company.businessVisibility },
    });

    return {
      success: true,
      message: `Business visibility is now ${updatedCompany.businessVisibility ? "enabled" : "disabled"}.`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to toggle business visibility.",
    };
  }
}

export async function togglePhoneVisibility(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const companyId = await getCompanyId();

    // Fetch the current phone visibility status
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { phoneVisibility: true },
    });

    if (!company) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    // Toggle the phone visibility status
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: { phoneVisibility: !company.phoneVisibility },
    });

    return {
      success: true,
      message: `Phone visibility is now ${updatedCompany.phoneVisibility ? "enabled" : "disabled"}.`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to toggle phone visibility.",
    };
  }
}

export async function toggleAddressVisibility(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const companyId = await getCompanyId();

    // Fetch the current address visibility status
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { addressVisibility: true },
    });

    if (!company) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    // Toggle the address visibility status
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: { addressVisibility: !company.addressVisibility },
    });

    return {
      success: true,
      message: `Address visibility is now ${updatedCompany.addressVisibility ? "enabled" : "disabled"}.`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to toggle address visibility.",
    };
  }
}
