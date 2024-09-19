import Layout from "@/components/Layout";
import { TooltipProvider } from "@/components/Tooltip";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import TopLoader from "../components/TopLoader";
import { auth } from "./auth";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { PublicEnvScript } from "next-runtime-env";

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
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body className={inter.className}>
        <TopLoader />
        <Toaster position="top-right" reverseOrder={false} />
        <SessionProvider session={session}>
          <TooltipProvider delayDuration={150}>
            <Layout session={session}>{children}</Layout>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
