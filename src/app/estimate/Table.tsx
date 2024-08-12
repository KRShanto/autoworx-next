"use client";

import Link from "next/link";
import ConvertTo from "./ConvertTo";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import { cn } from "@/lib/cn";
import { useEstimateFilterStore } from "@/stores/estimate-filter";
import { useEffect, useState } from "react";

interface InvoiceData {
  id: string;
  clientName: string;
  vehicle: string;
  email: string;
  phone: string;
  grandTotal: number;
  createdAt: Date;
  status?: string;
  textColor?: string;
  bgColor?: string;
}

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default function Table({ data }: { data: InvoiceData[] }) {
  const { dateRange, status, search } = useEstimateFilterStore();
  const [filteredData, setFilteredData] = useState<InvoiceData[]>(data);

  useEffect(() => {
    const filtered = data.filter((row) => {
      if (search) {
        const searchValue = search.toLowerCase();
        if (
          row.id.toLowerCase().includes(searchValue) ||
          row.clientName.toLowerCase().includes(searchValue) ||
          row.vehicle.toLowerCase().includes(searchValue)
        ) {
          return true;
        }
        return false;
      }
      return true;
    });

    const filteredStatus = filtered.filter((row) => {
      console.log(row.status, status);
      if (status) {
        return row.status === status;
      }
      return true;
    });

    const filteredDate = filteredStatus.filter((row) => {
      if (dateRange) {
        const [start, end] = dateRange;
        if (start && end) {
          const rowDate = moment(row.createdAt);
          return (
            rowDate.isSameOrAfter(start, "day") &&
            rowDate.isSameOrBefore(end, "day")
          );
        }
        return true;
      }
      return true;
    });

    setFilteredData(filteredDate);
  }, [search, dateRange, status]);

  return (
    <div className="min-h-[65vh] overflow-x-scroll rounded-md bg-white xl:overflow-hidden">
      <table className="w-full">
        {/* Estimate Header */}
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="px-10 text-left">Invoice ID</th>
            <th className="px-10 text-left">Client</th>
            <th className="px-10 text-left">Vehicle</th>
            <th className="px-10 text-left">Email</th>
            <th className="px-10 text-left">Phone</th>
            <th className="px-10 text-left">Price</th>
            <th className="px-10 text-left">Date</th>
            <th className="px-10 text-left">Status</th>
            <th className="px-10 text-left">Edit</th>
          </tr>
        </thead>

        {/* Estimate List */}
        <tbody>
          {filteredData.map((data, index) => (
            <tr
              key={data.id}
              className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
            >
              <td className="h-12 px-10 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  passHref
                  className="text-blue-600"
                >
                  {data.id}
                </Link>
              </td>
              <td className="px-10 text-left">{data.clientName}</td>
              <td className="px-10 text-left">{data.vehicle}</td>
              <td className="px-10 text-left">{data.email}</td>
              <td className="px-10 text-left">{data.phone}</td>
              <td className="px-10 text-left text-[#006D77]">
                {data.grandTotal?.toString()}
              </td>
              <td className="px-10 text-left">
                {/* format: date.month.year */}
                {moment(data.createdAt).format("DD.MM.YYYY")}
              </td>
              <td className="px-10 text-left">
                <p
                  className="rounded-md text-center text-white"
                  style={{
                    backgroundColor: data.bgColor,
                    color: data.textColor,
                  }}
                >
                  {data.status}
                </p>
              </td>
              <td className="flex items-center gap-3 px-10">
                <ConvertTo id={data.id} />
                <Link
                  href={`/estimate/edit/${data.id}`}
                  className="text-2xl text-blue-600"
                >
                  <CiEdit />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
