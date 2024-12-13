"use server";

// Import necessary modules and types
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";

/**
 * Creates a new status for the authenticated user's company.
 *
 * @param {Object} params - The parameters for the new status.
 * @param {string} params.name - The name of the new status.
 * @param {string} [params.textColor] - The text color of the new status.
 * @param {string} [params.bgColor] - The background color of the new status.
 * @returns {Promise<ServerAction>} The result of the status creation.
 */
export default async function newStatus({
  name,
  textColor,
  bgColor,
}: {
  name: string;
  textColor?: string;
  bgColor?: string;
}): Promise<ServerAction> {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create a new status in the database
  const newStatus = await db.status.create({
    data: {
      companyId,
      name,
      textColor: textColor || "black", // Default text color is black
      bgColor: bgColor || "white", // Default background color is white
    },
  });

  // Return the result of the status creation
  return {
    type: "success",
    data: newStatus,
  };
}
