"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";
import moment from "moment";
import { WORK_ORDER_STATUS_COLOR } from "@/lib/consts";
import { useEmployeeWorkFilterStore } from "@/stores/employeeWorkFilter";

export default function EmployeeInfoTable({
  info,
}: {
  info: EmployeeWorkInfo;
}) {
  const { amount, dateRange, search, service, category } =
    useEmployeeWorkFilterStore();
  const [filteredInfo, setFilteredInfo] =
    React.useState<EmployeeWorkInfo>(info);
  // filter through search, dateRange and amount
  // search by invoice id, client name, vehicle info
  // filter dateRange by dateAssigned
  useEffect(() => {
    const filtered = search
      ? info.filter((row) => {
          if (search) {
            const searchValue = search.toLowerCase();
            if (
              row.invoice?.id.toLowerCase().includes(searchValue) ||
              `${row.invoice?.client?.firstName} ${row.invoice?.client?.lastName}`
                .toLowerCase()
                .includes(searchValue) ||
              `${row.invoice?.vehicle?.make} ${row.invoice?.vehicle?.model}`
                .toLowerCase()
                .includes(searchValue)
            ) {
              return true;
            }
            return false;
          }
          return true;
        })
      : info;

    const filteredDate =
      dateRange[0] && dateRange[1]
        ? filtered.filter((row) => {
            if (dateRange) {
              const [start, end] = dateRange;
              if (start && end) {
                const rowDate = moment(Number(row.date));
                return (
                  rowDate.isSameOrAfter(start, "day") &&
                  rowDate.isSameOrBefore(end, "day")
                );
              }
              return true;
            }
            return true;
          })
        : filtered;

    const filteredAmount = amount
      ? filteredDate.filter((row) => {
          if (amount) {
            return (
              Number(row.amount) >= amount[0] && Number(row.amount) <= amount[1]
            );
          }
          return true;
        })
      : filteredDate;

    const filteredService = service
      ? filteredAmount.filter((row: any) => {
          const serviceName: string[] = row.invoice?.invoiceItems?.map(
            (item: any) => item?.service?.name,
          );
          return !!serviceName.find((s) => s === service);
        })
      : filteredAmount;

    const filteredCategory = category
      ? filteredAmount.filter((row: any) => {
          const categoryName: string[] = row.invoice?.invoiceItems?.map(
            (item: any) => item?.service?.category?.name,
          );
          return !!categoryName.find((cate) => cate === category);
        })
      : filteredService;

    setFilteredInfo(filteredCategory);
  }, [search, dateRange, amount, service, category]);

  return (
    <div className="mt-5 w-full">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left">Invoice/Estimate</th>
            <th className="border-b px-4 py-2 text-left">Client Name</th>
            <th className="border-b px-4 py-2 text-left">Vehicle Info</th>
            <th className="border-b px-4 py-2 text-left">Date Assigned</th>
            <th className="border-b px-4 py-2 text-left">Date Closed</th>
            <th className="border-b px-4 py-2 text-left">Total Payout</th>
            <th className="border-b px-4 py-2 text-center">Status</th>
            {/* <th className="border-b px-4 py-2 text-center">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredInfo.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}
            >
              <td className="border-b px-4 py-2 text-left">
                <Link
                  href={`/estimate/view/${row.invoice?.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {row.invoice?.id}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-left">
                {row.invoice?.client?.firstName} {row.invoice?.client?.lastName}
              </td>
              <td className="border-b px-4 py-2 text-left">
                {row.invoice?.vehicle?.make} {row.invoice?.vehicle?.model}
              </td>
              <td className="border-b px-4 py-2 text-left">
                {moment.utc(Number(row.date)).format("DD.MM.YYYY")}
              </td>
              <td className="border-b px-4 py-2 text-left">
                {row.dateClosed
                  ? moment.utc(Number(row.dateClosed)).format("DD.MM.YYYY")
                  : "-"}
              </td>
              <td className="backdrop border-b px-4 py-2 text-left">
                ${Number(row.amount)}
              </td>
              <td className="border-b py-2 text-center">
                <p
                  style={{
                    backgroundColor: WORK_ORDER_STATUS_COLOR[row.status!],
                  }}
                  className="rounded-full px-2 py-0.5 text-white"
                >
                  {row.status}
                </p>
              </td>
              {/* <td className="cursor-pointer border-b bg-white px-4 py-2 text-left">
                <div className="flex items-center justify-center gap-2">
                  <EditOutlined className="cursor-pointer text-blue-600" />
                  <FaTimes className="cursor-pointer text-red-500" />
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
