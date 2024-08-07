import Input from "@/components/Input";
import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FaTimes } from "react-icons/fa";
import { IoPieChartOutline, IoSearchOutline } from "react-icons/io5";

import AddNewEmployee from "./AddNewEmployee";
import EditEmployee from "./EditEmployee";
import DateRange from "./components/DateRange";
import HorizontalPayoutCard from "./components/HorizontalPayoutCard";
import PayoutCard from "./components/PayoutCard";
const evenColor = "bg-white";
const oddColor = "bg-slate-100";
const employees = [
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    type: "Employee",
    joined: "2023-01-01",
  },
];
export default function Page() {
  return (
    <div className="h-full w-full space-y-8">
      <Title>Employee List</Title>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <HorizontalPayoutCard
            title="Monthly Payout"
            amount="$3464"
            percentage="100%"
          />
          <HorizontalPayoutCard
            title="YTD Payout"
            amount="$3464"
            percentage="100%"
          />
        </div>
        <div>
          <button className="flex items-center gap-x-2 rounded-md bg-slate-100 p-2 px-5 text-[#6571FF] shadow-md">
            <IoPieChartOutline />
            <span>Workforce Reporting</span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {/* <Title>Employee List</Title> */}
        <div className="flex items-center gap-x-8">
          <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
            <span className="">
              <IoSearchOutline />
            </span>
            <input
              name="search"
              type="text"
              className="w-full rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
          </div>
          <DateRange />
          <select className="app-shadow rounded-md bg-white p-2 text-[#797979]">
            {["Type", "Sales", "Technician"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <AddNewEmployee />
      </div>
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Employee ID</th>
              <th className="border-b px-4 py-2 text-center">Name </th>
              <th className="border-b px-4 py-2 text-center">Email</th>
              <th className="border-b px-4 py-2 text-center">Phone</th>
              <th className="border-b px-4 py-2 text-center">Joined</th>
              <th className="border-b px-4 py-2 text-center">Type</th>
              <th className="border-b px-4 py-2 text-center">Edit</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={index}
                className={cn(
                  "cursor-pointer rounded-md",
                  index % 2 === 0 ? "bg-white" : "bg-blue-100",
                  // currentProductId === product.id &&
                  // "border-2 border-[#6571FF]",
                )}
              >
                <td className="border-b px-4 py-2 text-center">
                  <Link
                    className="text-blue-500"
                    href={`/employee/${employee.id}`}
                  >
                    {employee.id}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {employee.name}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {employee.email}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {employee.phone}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {employee.joined}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {employee.type}
                </td>
                <td className="border-b border-l bg-white px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <EditEmployee />

                    <button className="text-xl text-red-400">
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
