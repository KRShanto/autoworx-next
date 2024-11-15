// components/InvoicesTabs.tsx
"use client"; // This makes the component a Client Component

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface NavigationsTabProps {
  activeTab: string;
  children: React.ReactNode;
}
export default function NavigationTabs({
  activeTab,
  children,
}: Readonly<NavigationsTabProps>) {
  const router = useRouter();
  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/estimate/canned");
    router.prefetch("/estimate/invoices");
    router.prefetch("/estimate");
  }, [router]);

  return (
    <Tabs defaultValue={activeTab} className="mt-5">
      <TabsList>
        <TabsTrigger
          value="c-canned"
          onClick={() => router.push("/estimate/canned")}
        >
          Canned
        </TabsTrigger>
        <TabsTrigger
          value="b-invoice"
          onClick={() => router.push("/estimate/invoices")}
        >
          Invoices
        </TabsTrigger>
        <TabsTrigger
          value="a-estimate"
          onClick={() => router.push("/estimate")}
        >
          Estimates
        </TabsTrigger>
      </TabsList>
      <div className="h-[70vh] flex-auto overflow-y-auto overflow-x-clip rounded-lg bg-background p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <TabsContent value={activeTab}>{children}</TabsContent>
      </div>
    </Tabs>
  );
}
