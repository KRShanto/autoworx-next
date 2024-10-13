import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import "server-only";
import { db } from "../lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.SECRET!,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light",
  },

  providers: [
    CredentialsProvider({
      name: "AutoWorx",
      credentials: {
        email: { label: "Your Email", type: "email" },
        password: { label: "Your Password", type: "password" },
      },

      // Login the user
      // @ts-ignore
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            // throw new Error("Missing email or password");
            return null;
          }

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            // throw new Error("Invalid email or password. Please try again.");
            return null;
          }

          // if no password is set, it means the user is using a social account
          if (!user.password) {
            // throw new Error(
            //   "You are using a social account. Please login with your social account or click Forgot Password to set a password.",
            // );
            return null;
          }

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password,
          );

          if (!isPasswordMatched) {
            // throw new Error("Invalid email or password. Please try again.");
            return null;
          }
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.name = token.name;
        // @ts-ignore
        session.user.email = token.email;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.companyId = token.companyId;
        session.user.employeeType = token.employeeType;
      }
      return session;
    },

    async jwt({ token, user }: any) {
      // find the user
      const dbUser = await db.user.findUnique({
        where: { email: token.email! },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.firstName + " " + dbUser.lastName,
        email: dbUser.email,
        role: dbUser.role,
        companyId: dbUser.companyId,
        employeeType: dbUser.employeeType,
      };
    },
  },
});
