"use client";
import Title from "@/components/Title";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Link from "next/link";
import HeaderSearch from "./components/HeaderSearch";

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

export default function Page() {
  return (
    <div>
      <Title>Payments</Title>

      {/* Header */}
      <div className="mt-5 flex justify-between">
        <HeaderSearch />
      </div>

      <Tabs defaultValue="transactions" className="mt-5 grid-cols-1">
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Table data={dummyData} />
        </TabsContent>

        <TabsContent value="integrations">
          <Table data={[]} />
        </TabsContent>
        <TabsContent value="coupons">
          <Table data={[]} />
        </TabsContent>
      </Tabs>
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
              <td className="border-b px-4 py-2 text-center">
                <Link href="/" className="text-blue-500 hover:underline">
                  {item.customer}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-center">
                {item.vehicleInfo}
              </td>
              <td className="border-b px-4 py-2 text-center">
                {item.transactionDate}
              </td>
              <td className="border-b px-4 py-2 text-center">
                {item.amount.toFixed(2)}
              </td>
              <td className="border-b px-4 py-2 text-center">{item.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
