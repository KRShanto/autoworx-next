"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Session } from "next-auth";

/**
 * Searches for groups based on the provided search term.
 * @param searchTerm - The term to search for in group names.
 * @returns An object containing the success status and the list of groups.
 */
export const searchGroups = async (searchTerm: string) => {
  // Authenticate the user and get the session
  const session = (await auth()) as Session & { user: { companyId: number } };

  try {
    // Fetch groups from the database that the user is part of and match the search term
    const groups = await db.group.findMany({
      where: {
        users: { some: { id: parseInt(session?.user?.id!) } },
        OR: [{ name: { contains: searchTerm } }],
      },
      include: {
        users: true,
      },
    });

    // Return the list of groups
    return {
      success: true,
      data: groups,
    };
  } catch (err: any) {
    // Handle any errors that occur during the process
    throw new Error(err);
  }
};
