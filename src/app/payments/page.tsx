"use client";
import Title from "@/components/Title";
import React, { useEffect, useState } from "react";
import {
  PaymentTab,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/PaymentTab";
import Link from "next/link";
import HeaderSearch from "./components/HeaderSearch";
import LogoCard from "./components/LogoCard";
import CuponComponent from "./components/CuponComponent";
import { ReturnPayment, getPayments } from "@/actions/payment/getPayments";
import { useServerGet } from "@/hooks/useServerGet";
import moment from "moment";
import { getCoupons } from "@/actions/coupon/getCoupons";
import { usePaymentFilterStore } from "@/stores/paymentFilter";

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
          <Table data={payments || []} />
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

function Table({ data }: { data: ReturnPayment[] }) {
  const { search, dateRange, amount, paidStatus, paymentMethod } =
    usePaymentFilterStore();
  const [filteredData, setFilteredData] = useState(data);

  function checkPaymentMethod(method: string) {
    if (paymentMethod === "All") {
      return true;
    } else if (method === paymentMethod) {
      return true;
    } else if (
      paymentMethod === "Other" &&
      method !== "Card" &&
      method !== "Cash" &&
      method !== "Cheque"
    ) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    setFilteredData(
      data.filter((item) => {
        const isWithinDateRange =
          dateRange[0] && dateRange[1]
            ? moment(item.date).isSameOrAfter(dateRange[0], "day") &&
              moment(item.date).isSameOrBefore(dateRange[1], "day")
            : true;

        const isWithinAmountRange =
          item.amount >= amount[0] && item.amount <= amount[1];

        const isPaymentMethodMatch = checkPaymentMethod(item.method);

        const isPaidStatusMatch =
          paidStatus === "All"
            ? true
            : paidStatus === "Paid"
              ? item.paid
              : !item.paid;

        const isSearchMatch = search
          ? item.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
            item.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
            item.client.name?.toLowerCase().includes(search.toLowerCase())
          : true;

        return (
          isWithinDateRange &&
          isWithinAmountRange &&
          isPaymentMethodMatch &&
          isPaidStatusMatch &&
          isSearchMatch
        );
      }),
    );
  }, [data, dateRange, amount, paidStatus, paymentMethod, search]);

  return (
    <div className="min-h-[65vh] overflow-x-scroll rounded-md bg-white xl:overflow-hidden">
      <table className="w-full">
        {/*  Header */}
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="border-b px-4 py-2 text-left">Invoice#</th>
            <th className="border-b px-4 py-2 text-left">Customer</th>
            <th className="border-b px-4 py-2 text-left">Vehicle Info</th>
            <th className="border-b px-4 py-2 text-left">Transaction Date</th>
            <th className="border-b px-4 py-2 text-left">Amount</th>
            <th className="border-b px-4 py-2 text-left">Method</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]"}
            >
              <td className="border-b px-4 py-2">
                <Link
                  href={`/estimate/view/${item.invoiceId}`}
                  className="text-blue-500 hover:underline"
                >
                  {item.invoiceId}
                </Link>
              </td>
              <td className="border-b px-4 py-2">
                <Link
                  href={`/client/${item.client.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {item.client.name}
                </Link>
              </td>
              <td className="border-b px-4 py-2">{item.vehicle}</td>
              <td className="border-b px-4 py-2">
                {moment(item.date).format("YYYY-MM-DD")}
              </td>
              <td className="border-b px-4 py-2">${item.amount}</td>
              <td className="border-b px-4 py-2">{item.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
