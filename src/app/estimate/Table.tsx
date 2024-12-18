"use client";

import Link from "next/link";
import ConvertTo from "./ConvertTo";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import { cn } from "@/lib/cn";
import { useEstimateFilterStore } from "@/stores/estimate-filter";
import { useEffect, useState } from "react";
import { useActionStoreCreateEdit } from "@/stores/createEditStore";

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
  const { setActionType } = useActionStoreCreateEdit();

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
    console.log("Filtered::::", filtered);
    const filteredStatus = filtered.filter((row) => {
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
  }, [search, dateRange, status, data]);

  return (
    <div className="min-h-[65vh] overflow-x-scroll rounded-md bg-white xl:overflow-hidden">
      <table className="w-full">
        {/* Estimate Header */}
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="px-4 py-2 text-left">Invoice ID</th>
            <th className="px-4 py-2 text-left">Client</th>
            <th className="px-4 py-2 text-left">Vehicle</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Edit</th>
          </tr>
        </thead>

        {/* Estimate List */}
        <tbody>
          {filteredData.map((data, index) => (
            <tr
              key={data.id}
              className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
            >
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  passHref
                  className="block w-full text-blue-600"
                >
                  {data.id}
                </Link>
              </td>
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  {data.clientName}
                </Link>
              </td>
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  {data.vehicle}
                </Link>
              </td>
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  {data.email}
                </Link>
              </td>
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  {data.phone}
                </Link>
              </td>
              <td className="px-4 py-2 text-left text-[#006D77]">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  ${(+data.grandTotal).toFixed(2)}
                </Link>
              </td>
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  {moment(data.createdAt).format("DD.MM.YYYY")}
                </Link>
              </td>
              <td className="px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${data.id}`}
                  className="block h-full w-full"
                >
                  <p
                    className="rounded-md text-left"
                    style={{
                      backgroundColor: data.bgColor,
                      color: data.textColor,
                    }}
                  >
                    {data.status || ""}
                  </p>
                </Link>
              </td>
              <td className="flex items-center gap-3 px-4 py-2">
                <ConvertTo id={data.id} />
                <Link
                  href={`/estimate/edit/${data.id}`}
                  className="text-2xl text-blue-600"
                  onClick={() => setActionType("edit")}
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
