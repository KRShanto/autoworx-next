"use server";

import { db } from "@/lib/db";

/**
 * Fetches a user by their ID.
 * @param id - The ID of the user to fetch.
 * @returns An object containing the status and user data or null if not found.
 */
export const getUserById = async (id: number) => {
  try {
    // Query the database to find a user by ID
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return { type: "success", data: user };
    } else {
      return { type: "fail", data: null };
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

/**
 * Fetches a user by their email.
 * @param email - The email of the user to fetch.
 * @returns An object containing the status and user data or null if not found.
 */
export const getUserByEmail = async (email: string) => {
  try {
    // Query the database to find a user by email
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return { type: "success", data: user };
    } else {
      return { type: "fail", data: null };
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
