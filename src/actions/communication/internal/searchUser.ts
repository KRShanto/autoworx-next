"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { Session } from "next-auth";

/**
 * Searches for users based on the provided search term, excluding specified users.
 * @param searchTerm - The term to search for in user names, emails, or phone numbers.
 * @param notNeededUser - Optional array of users to exclude from the search results.
 * @returns An object containing the success status and the filtered list of users.
 */
export const searchUsers = async (
  searchTerm: string,
  notNeededUser?: { id: number }[] | null,
) => {
  // Authenticate the user and get the session
  const session = (await auth()) as Session & { user: { companyId: number } };

  // Initialize the list of users to exclude with the current user
  let withoutNeedUser = [{ id: parseInt(session.user?.id!) }];

  // Add any additional users to exclude if provided
  if (notNeededUser && notNeededUser.length) {
    withoutNeedUser = [...withoutNeedUser, ...notNeededUser];
  }

  try {
    // Fetch users from the database that belong to the same company and are not in the exclusion list
    const usersFromDB = await db.user.findMany({
      where: {
        companyId: session?.user?.companyId,
        NOT: withoutNeedUser,
      },
    });

    // Filter users based on the search term
    const filteredUsers = usersFromDB.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    });

    // Return the filtered list of users
    return {
      success: true,
      data: filteredUsers,
    };
  } catch (err: any) {
    // Handle any errors that occur during the process
    throw new Error(err);
  }
};
