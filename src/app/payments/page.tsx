"use client";
import Title from "@/components/Title";
import React, { useEffect, useState } from "react";
import {
  PaymentTab,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/PaymentTab";
import HeaderSearch from "./components/HeaderSearch";
import LogoCard from "./components/LogoCard";
import CuponComponent from "./components/CuponComponent";
import { getPayments } from "@/actions/payment/getPayments";
import { useServerGet } from "@/hooks/useServerGet";
import { getCoupons } from "@/actions/coupon/getCoupons";
import PaymentTable from "./components/PaymentTable";

export default function Page() {
  const { data: payments } = useServerGet(getPayments);
  const { data: couponsData } = useServerGet(getCoupons);
  const [coupons, setCoupons] = useState(couponsData);

  useEffect(() => {
    setCoupons(couponsData);
  }, [couponsData]);

  return (
    <div>
      <Title>Payments</Title>

      {/* Header */}
      <div className="mt-5 flex justify-between">
        <HeaderSearch />
      </div>

      <PaymentTab defaultValue="transactions" className="mt-5 grid-cols-1">
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <PaymentTable data={payments || []} />
        </TabsContent>

        <TabsContent value="integrations">
          <div className="flex justify-evenly">
            <LogoCard />
            <LogoCard />
            <LogoCard />
          </div>
        </TabsContent>

        <TabsContent
          value="coupons"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            padding: 0,
          }}
        >
          <CuponComponent coupons={coupons || []} setCoupons={setCoupons} />
        </TabsContent>
      </PaymentTab>
    </div>
  );
}
