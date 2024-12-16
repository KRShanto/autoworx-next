import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authConfig = {
  adapter: PrismaAdapter(db),
  secret: process.env.SECRET!,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light",
  },
  providers: [],
};
