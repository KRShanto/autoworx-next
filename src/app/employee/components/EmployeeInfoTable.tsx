import React from "react";
import { EditOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";
import moment from "moment";
import { WORK_ORDER_STATUS_COLOR } from "@/lib/consts";
import { FaTimes } from "react-icons/fa";

export default function EmployeeInfoTable({
  info,
}: {
  info: EmployeeWorkInfo;
}) {
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
            <th className="border-b px-4 py-2 text-left">Status</th>
            <th className="border-b px-4 py-2 text-left">Total Payout</th>
            <th className="border-b px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {info.map((row, index) => (
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
                {moment(Number(row.date)).format("DD.MM.YYYY")}
              </td>
              <td className="border-b px-4 py-2 text-left">
                {row.dateClosed
                  ? moment(Number(row.dateClosed)).format("DD.MM.YYYY")
                  : "-"}
              </td>
              <td className="border-b px-4 py-2 text-left">
                <p
                  style={{
                    backgroundColor: WORK_ORDER_STATUS_COLOR[row.status!],
                  }}
                  className="rounded-full px-2 py-0.5 text-white"
                >
                  {row.status}
                </p>
              </td>
              <td className="backdrop border-b px-4 py-2 text-left">
                ${Number(row.amount)}
              </td>
              <td className="cursor-pointer border-b bg-white px-4 py-2 text-left">
                <div className="flex items-center justify-center gap-2">
                  <EditOutlined className="cursor-pointer text-blue-600" />
                  <FaTimes className="cursor-pointer text-red-500" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
