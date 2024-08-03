"use client";
import Title from "@/components/Title";
import React from "react";
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

// Dummy data for coupons
interface Coupon {
  couponName: string;
  code: string;
  discount: string;
  startDate: string;
  status: string;
  redemptionCount: string;
}

// Dummy data for coupons
const dummyCoupons: Coupon[] = [
  {
    couponName: "Summer Sale",
    code: "SUMMER2024",
    discount: "20%",
    startDate: "2024-06-01",
    status: "Active",
    redemptionCount: "150",
  },
  {
    couponName: "Winter Clearance",
    code: "WINTER2024",
    discount: "30%",
    startDate: "2024-12-01",
    status: "Scheduled",
    redemptionCount: "50",
  },
  {
    couponName: "Black Friday Deal",
    code: "BLACKFRIDAY",
    discount: "50%",
    startDate: "2024-11-25",
    status: "Expired",
    redemptionCount: "200",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
  {
    couponName: "New Year Promo",
    code: "NEWYEAR2024",
    discount: "15%",
    startDate: "2024-01-01",
    status: "Active",
    redemptionCount: "75",
  },
];

export default function Page() {
  const { data: payments, loading, error } = useServerGet(getPayments);

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
          {payments && <Table data={payments} />}
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
          <CuponComponent coupons={dummyCoupons} />
        </TabsContent>
      </PaymentTab>
    </div>
  );
}

function Table({ data }: { data: ReturnPayment[] }) {
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
          {data.map((item, index) => (
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
