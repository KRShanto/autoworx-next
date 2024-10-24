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

export async function connectWithCompany(
  targetCompanyId: number,
  revalidatePathName?: string | undefined,
): Promise<{
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
    revalidatePathName && revalidatePath(revalidatePathName);
    return {
      success: true,
      message: "Successfully connected with the company.",
    };
  } catch (error) {
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

//location

export async function setLatLong(
  latitude: number | null,
  longitude: number | null,
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    let companyId = await getCompanyId();
    await db.company.update({
      where: { id: companyId },
      data: { companyLatitude: latitude, companyLongitude: longitude },
    });

    return {
      success: true,
      message: "Successfully updated location.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update location.",
    };
  }
}

// Haversine formula to calculate distance in miles
function getDistanceFromLatLonInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Function to find nearby unconnected companies
export async function findNearbyCompanies(
  latitude: number,
  longitude: number,
  range: [number, number], // e.g., [minDistance, maxDistance]
): Promise<{
  success: boolean;
  data: Company[] | [];
}> {
  try {
    const userCompanyId = await getCompanyId(); // Your function to get the user's company ID

    // Step 1: Get all connected company IDs
    const connectedCompanyIds = await db.companyJoin.findMany({
      where: {
        OR: [{ companyOneId: userCompanyId }, { companyTwoId: userCompanyId }],
      },
      select: {
        companyOneId: true,
        companyTwoId: true,
      },
    });

    // Extract connected company IDs
    const connectedIds = connectedCompanyIds.flatMap((join) =>
      [join.companyOneId, join.companyTwoId].filter(
        (id) => id !== userCompanyId,
      ),
    );

    // Step 2: Get all unconnected companies (excluding connected companies and your own company)
    const unconnectedCompanies = await db.company.findMany({
      where: {
        id: {
          notIn: connectedIds, // Exclude connected companies
          not: userCompanyId, // Exclude the user's own company
        },
        companyLatitude: { not: null },
        companyLongitude: { not: null },
      },
    });

    // Step 3: Filter unconnected companies by distance
    const nearbyUnconnectedCompanies = unconnectedCompanies.filter(
      (company) => {
        if (company.companyLatitude && company.companyLongitude) {
          const distance = getDistanceFromLatLonInMiles(
            latitude,
            longitude,
            company.companyLatitude,
            company.companyLongitude,
          );
          return distance <= range[1] && distance >= range[0]; // Filter based on the distance range
        }
        return false;
      },
    );

    return {
      success: true,
      data: nearbyUnconnectedCompanies,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [],
    };
  }
}
