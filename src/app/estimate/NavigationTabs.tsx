// components/InvoicesTabs.tsx
"use client"; // This makes the component a Client Component

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useRouter } from 'next/navigation';


interface NavigationsTabProps{
  activeTab:string;
  children:React.ReactNode;
}
export default function NavigationTabs({ activeTab, children }: Readonly<NavigationsTabProps>) {
  const router = useRouter();

  return (
    <Tabs defaultValue={activeTab} className="mt-5">
      <TabsList>
        
        
        <TabsTrigger value="c-canned" onClick={() => router.push("/estimate/canned")}>
          Canned
        </TabsTrigger>
        <TabsTrigger value="b-invoice" onClick={() => router.push("/estimate/invoices")}>
          Invoices
        </TabsTrigger>
        <TabsTrigger value="a-estimate" onClick={() => router.push("/estimate")}>
          Estimates
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab}>{children}</TabsContent>
    </Tabs>
  );
}
