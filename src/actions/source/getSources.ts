"use server";

// Import necessary modules and types
import { Source } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Retrieves all sources from the database.
 *
 * @returns {Promise<Source[]>} A list of all sources.
 */
export async function getSources() {
  // Fetch all sources from the database
  return db.source.findMany();
}
