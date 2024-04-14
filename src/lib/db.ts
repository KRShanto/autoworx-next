import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

if (!db) {
  db = new PrismaClient();
}

export { db };
