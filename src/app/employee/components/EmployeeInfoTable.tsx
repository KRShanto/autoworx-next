import React from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Image from "next/image";
import Link from "next/link";

const rows = [
  {
    clientName: "John Doe",
    invoice: "INV-001",
    vehicleInfo: "ABC123",
    dateAssigned: "11.11.2023",
    dateClosed: "12.12.2023",
    status: "Closed",
    totalPayout: "$1000",
  },
  {
    clientName: "Jane Smith",
    invoice: "INV-002",
    vehicleInfo: "XYZ789",
    dateAssigned: "13.11.2023",
    dateClosed: "14.12.2023",
    status: "Open",
    totalPayout: "$1500",
  },
  {
    clientName: "Jane Smith",
    invoice: "INV-002",
    vehicleInfo: "XYZ789",
    dateAssigned: "13.11.2023",
    dateClosed: "14.12.2023",
    status: "Open",
    totalPayout: "$1500",
  },
  {
    clientName: "Jane Smith",
    invoice: "INV-002",
    vehicleInfo: "XYZ789",
    dateAssigned: "13.11.2023",
    dateClosed: "14.12.2023",
    status: "Open",
    totalPayout: "$1500",
  },
  {
    clientName: "Jane Smith",
    invoice: "INV-002",
    vehicleInfo: "XYZ789",
    dateAssigned: "13.11.2023",
    dateClosed: "14.12.2023",
    status: "Open",
    totalPayout: "$1500",
  },
  {
    clientName: "Jane Smith",
    invoice: "INV-002",
    vehicleInfo: "XYZ789",
    dateAssigned: "13.11.2023",
    dateClosed: "14.12.2023",
    status: "Open",
    totalPayout: "$1500",
  },
  {
    clientName: "Jane Smith",
    invoice: "INV-002",
    vehicleInfo: "XYZ789",
    dateAssigned: "13.11.2023",
    dateClosed: "14.12.2023",
    status: "Open",
    totalPayout: "$1500",
  },
  //dummy data
];

const deleteIcon ='/icons/deleteEmp.png';
export default function EmployeeInfoTable() {
  return (
    <div className="mt-5 w-full">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Invoice/Estimate</th>
            <th className="py-2 px-4 border-b">Client Name</th>
            <th className="py-2 px-4 border-b">Vehicle Info</th>
            <th className="py-2 px-4 border-b">Date Assigned</th>
            <th className="py-2 px-4 border-b">Date Closed</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Total Payout</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}
            >
              <td className="py-2 px-4 border-b text-center">
                <Link href="/" className="text-blue-500 hover:underline">
                  {row.invoice}
                </Link>
              </td>
              <td className="py-2 px-4 border-b text-center">{row.clientName}</td>
              <td className="py-2 px-4 border-b text-center">{row.vehicleInfo}</td>
              <td className="py-2 px-4 border-b text-center">{row.dateAssigned}</td>
              <td className="py-2 px-4 border-b text-center ">{row.dateClosed}</td>
              <td className="py-2 px-4 border-b text-center ">{row.status}</td>
              <td className="py-2 px-4 border-b backdrop text-center ">{row.totalPayout}</td>
              <td className="py-2 px-4 border-b bg-white text-blue-600 cursor-pointer text-center">
                <div className="flex gap-2 justify-center items-center">
                  <EditOutlined className="cursor-pointer" />
                  <Image src={deleteIcon} className="your-icon-class-name" width={20} height={20} alt="Icon" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
