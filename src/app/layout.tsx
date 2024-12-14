import Layout from "@/components/Layout";
import { TooltipProvider } from "@/components/Tooltip";
import { EmployeeType } from "@prisma/client";
import type { Metadata } from "next";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PublicEnvScript } from "next-runtime-env";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import TopLoader from "../components/TopLoader";
import { auth } from "./auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | AutoWorx`,
    default: "AutoWorx",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) as Session & {
    user: { employeeType: string };
  };

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body className={inter.className}>
        <TopLoader />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              style: {
                border: "1px solid rgba(0, 255, 0, 0.5)",
              },
            },
            error: {
              style: {
                border: "1px solid rgba(255, 0, 0, 0.5)",
              },
            },
          }}
        />
        <SessionProvider session={session}>
          <TooltipProvider delayDuration={150}>
            <Layout session={session}>{children}</Layout>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
