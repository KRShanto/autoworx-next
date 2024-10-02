import React, { Suspense } from "react";
import Calculation from "../../components/Calculation";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import FilterBySelection from "../../components/filter/FilterBySelection";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getClientsData } from "../../data";
import Analytics from "./Analytics";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
import { db } from "@/lib/db";
import RevenueTableRow from "./RevenueTableRow";
import moment from "moment";
import { QueryOptions } from "@prisma/client/runtime/library";

type TProps = {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    service?: string;
    search?: string;
  };
};

type TSliderData = {
  id: number;
  min: number;
  max: number;
  defaultValue?: [number, number];
  type: "price" | "cost" | "profit";
};
const filterMultipleSliders: TSliderData[] = [
  {
    id: 1,
    type: "price",
    min: 0,
    max: 300,
    // defaultValue: [50, 250],
  },
  {
    id: 2,
    type: "cost",
    min: 0,
    max: 400,
  },
  {
    id: 3,
    type: "profit",
    min: 0,
    max: 500,
  },
];
export default async function RevenueReportPage({ searchParams }: TProps) {
  const filterOR = [];
  if (searchParams.startDate && searchParams.endDate) {
    const formattedStartDate =
      searchParams.startDate &&
      moment(decodeURIComponent(searchParams.startDate!), "MM-DD-YYYY").format(
        "YYYY-MM-DD",
      );

    const formattedEndDate =
      searchParams.endDate &&
      moment(decodeURIComponent(searchParams.endDate!), "MM-DD-YYYY").format(
        "YYYY-MM-DD",
      );
    filterOR.push({
      createdAt: {
        gte:
          formattedStartDate && new Date(`${formattedStartDate}T00:00:00.000Z`), // Start of the day
        lte: formattedEndDate && new Date(`${formattedEndDate}T23:59:59.999Z`), // End of the day
      },
    });
  }

  const invoices = await db.invoice.findMany({
    where: {
      client: {
        OR: searchParams.search
          ? [
              { firstName: { contains: searchParams.search?.trim() } },
              { lastName: { contains: searchParams.search?.trim() } },
            ]
          : undefined,
      },
      OR: filterOR.length > 0 ? filterOR : undefined,
    },
    include: {
      invoiceItems: {
        include: {
          materials: true,
          labor: true,
        },
      },
      vehicle: {
        select: {
          make: true,
          model: true,
          submodel: true,
        },
      },
      client: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return (
    <div className="space-y-5">
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="WEEK" amount={0} />
        <Calculation content="MONTH" amount={0} />
        <Calculation content="YTD" amount={0} />
        <Calculation content="REVENUE" amount={0} />
      </div>
      {/* filter section */}
      <div className="flex w-full items-center justify-between gap-x-3">
        <div className="flex flex-1 items-center space-x-4">
          <FilterBySearchBox searchText={searchParams.search as string} />
          <FilterByDateRange
            startDate={decodeURIComponent(searchParams.startDate as string)}
            endDate={decodeURIComponent(searchParams.endDate as string)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <FilterByMultiple
            searchParamsValue={searchParams}
            filterSliders={filterMultipleSliders}
          />
          <FilterBySelection
            selectedItem={searchParams?.category as string}
            items={["product", "parts", "wheel"]}
            type="category"
          />
          <FilterBySelection
            selectedItem={searchParams?.service as string}
            items={["washing", "changing wheel", "full service"]}
            type="service"
          />
        </div>
      </div>
      {/* table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Customer</th>
              <th className="border-b px-4 py-2 text-center">Vehicle Info </th>
              <th className="border-b px-4 py-2 text-center">Invoice #</th>
              <th className="border-b px-4 py-2 text-center">Date Delivered</th>
              <th className="border-b px-4 py-2 text-center">Price</th>
              <th className="border-b px-4 py-2 text-center">Cost</th>
              <th className="border-b px-4 py-2 text-center">Profit</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice, index) => (
              <RevenueTableRow
                key={invoice.id}
                invoice={invoice}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
