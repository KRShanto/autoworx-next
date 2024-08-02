"use client";
import Title from "@/components/Title";
import React from "react";
import { PaymentTab, TabsContent, TabsList, TabsTrigger } from "./components/PaymentTab";
import Link from "next/link";
import HeaderSearch from "./components/HeaderSearch";
import LogoCard from "./components/LogoCard";
import CuponComponent from "./components/CuponComponent";


interface TransactionData {
  invoiceNumber: string;
  customer: string;
  vehicleInfo: string;
  transactionDate: string;
  amount: number;
  method: string;
}

const dummyData: TransactionData[] = [
  {
    invoiceNumber: "INV001",
    customer: "John Doe",
    vehicleInfo: "Toyota Camry 2020",
    transactionDate: "2024-07-01",
    amount: 250.0,
    method: "Credit Card",
  },
  {
    invoiceNumber: "INV002",
    customer: "Jane Smith",
    vehicleInfo: "Honda Accord 2019",
    transactionDate: "2024-07-02",
    amount: 300.0,
    method: "PayPal",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
  {
    invoiceNumber: "INV003",
    customer: "Mike Johnson",
    vehicleInfo: "Ford Focus 2018",
    transactionDate: "2024-07-03",
    amount: 150.0,
    method: "Bank Transfer",
  },
];
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
          <Table data={dummyData} />
        </TabsContent>

        <TabsContent value="integrations" >
          
          <div className="flex justify-evenly">
          <LogoCard/>
          <LogoCard/>
          <LogoCard/>
          </div>
        </TabsContent>
        <TabsContent value="coupons" style={{ width: '100%',height: '100%' , backgroundColor: 'transparent' ,padding: 0}}>
          <CuponComponent coupons={dummyCoupons}/>
          
        </TabsContent>
      </PaymentTab>
    </div>
  );
}

function Table({ data }: { data: TransactionData[] }) {
  return (
    <div className="min-h-[65vh] overflow-x-scroll rounded-md bg-white xl:overflow-hidden">
      <table className="w-full">
        {/*  Header */}
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="border-b px-4 py-2">Invoice#</th>
            <th className="border-b px-4 py-2">Customer</th>
            <th className="border-b px-4 py-2">Vehicle Info</th>
            <th className="border-b px-4 py-2">Transaction Date</th>
            <th className="border-b px-4 py-2">Amount</th>
            <th className="border-b px-4 py-2">Method</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]"}
            >
              <td className="border-b px-4 py-2 text-center">
                <Link href="/" className="text-blue-500 hover:underline">
                  {item.invoiceNumber}
                </Link>
              </td>
              <td className="border-b px-4 py-2 ">
                <Link href="/" className="text-blue-500 hover:underline">
                  {item.customer}
                </Link>
              </td>
              <td className="border-b px-4 py-2 ">
                {item.vehicleInfo}
              </td>
              <td className="border-b px-4 py-2 ">
                {item.transactionDate}
              </td>
              <td className="border-b px-4 py-2 ">
                {item.amount.toFixed(2)}
              </td>
              <td className="border-b px-4 py-2 ">{item.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
