import Input from "@/components/Input";
import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FaTimes } from "react-icons/fa";
import { IoPieChartOutline, IoSearchOutline } from "react-icons/io5";

import AddNewClient from "./AddNewClient";
import EditClient from "./EditClient";
const evenColor = "bg-white";
const oddColor = "bg-slate-100";
const clients = [
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
  {
    id: 1234567890,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  },
];
export default function Page({ params }: { params: { clientId: string } }) {
  return (
    <div className="h-full w-full space-y-8">
      <Title>Client List</Title>

      <div className="flex items-center justify-between">
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
        </div>
        <AddNewClient />
      </div>
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Client ID</th>
              <th className="border-b px-4 py-2 text-center">Client </th>
              <th className="border-b px-4 py-2 text-center">Email</th>
              <th className="border-b px-4 py-2 text-center">Phone</th>
              <th className="border-b px-4 py-2 text-center">Edit</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => (
              <tr
                key={index}
                className={cn(
                  "cursor-pointer rounded-md py-3",
                  index % 2 === 0 ? "bg-white" : "bg-blue-100",

                )}

              >
                <td className="border-b px-4 py-2 text-center">
                  <Link className="text-blue-500" href={`/client/${client.id}`}>
                    {client.id}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.name}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.email}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.phone}
                </td>
                <td className="border-b border-l bg-white px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <EditClient />

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
