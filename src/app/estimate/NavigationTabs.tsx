// components/InvoicesTabs.tsx
"use client"; // This makes the component a Client Component

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEstimateNavigationStore } from "@/stores/estimateNavigationStore";

interface NavigationsTabProps {
  activeTab: string;
  children: React.ReactNode;
}
export default function NavigationTabs({
  activeTab,
  children,
}: Readonly<NavigationsTabProps>) {
  const router = useRouter();
  const setType = useEstimateNavigationStore((state) => state.setType);
  const resetType = useEstimateNavigationStore((state) => state.resetType);
 
  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/estimate/canned");
    router.prefetch("/estimate/invoices");
    router.prefetch("/estimate");
  }, [router]);
  const handleCannedClick = () => {
    resetType(); // or another appropriate value
    router.push("/estimate/canned");
  };

  const handleInvoiceClick = () => {
    setType("invoice");
    router.push("/estimate/invoices");
  };

  const handleEstimateClick = () => {
    setType("estimate");
    router.push("/estimate");
  };
  
  return (
    <Tabs defaultValue={activeTab} className="mt-5">
      <TabsList>
        <TabsTrigger value="c-canned" onClick={handleCannedClick}>
          Canned
        </TabsTrigger>
        <TabsTrigger value="b-invoice" onClick={handleInvoiceClick}>
          Invoices
        </TabsTrigger>
        <TabsTrigger value="a-estimate" onClick={handleEstimateClick}>
          Estimates
        </TabsTrigger>
      </TabsList>
      <div className="h-[70vh] flex-auto overflow-y-auto overflow-x-clip rounded-lg bg-background p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <TabsContent value={activeTab}>{children}</TabsContent>
      </div>
    </Tabs>
  );
}
