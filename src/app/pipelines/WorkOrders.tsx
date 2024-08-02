import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import DateRange from "../employee/information/components/DateRange";
import FilterBySelection from "../reporting/components/filter/FilterBySelection";
import Filter from "./Filter";

type Props = {};
const workOrders = [
  {
    id: 12345,
    client: "John Doe",
    vehicleInfo: {
      year: 2022,
      make: "Toyota",
      model: "Camry",
    },
    services: ["Service 1", "Service 2", "Service 3"],
    timeCreated: "2023-01-01",
    dueDate: "2023-01-01",
    status: "Pending",
  },
  {
    id: 12345,
    client: "John Doe",
    vehicleInfo: {
      year: 2022,
      make: "Toyota",
      model: "Camry",
    },
    services: ["Service 1", "Service 2", "Service 3"],
    timeCreated: "2023-01-01",
    dueDate: "2023-01-01",
    status: "Pending",
  },
  {
    id: 12345,
    client: "John Doe",
    vehicleInfo: {
      year: 2022,
      make: "Toyota",
      model: "Camry",
    },
    services: ["Service 1", "Service 2", "Service 3"],
    timeCreated: "2023-01-01",
    dueDate: "2023-01-01",
    status: "Pending",
  },
  {
    id: 12345,
    client: "John Doe",
    vehicleInfo: {
      year: 2022,
      make: "Toyota",
      model: "Camry",
    },
    services: ["Service 1", "Service 2", "Service 3"],
    timeCreated: "2023-01-01",
    dueDate: "2023-01-01",
    status: "Pending",
  },
  {
    id: 12345,
    client: "John Doe",
    vehicleInfo: {
      year: 2022,
      make: "Toyota",
      model: "Camry",
    },
    services: ["Service 1", "Service 2", "Service 3"],
    timeCreated: "2023-01-01",
    dueDate: "2023-01-01",
    status: "Pending",
  },
  {
    id: 12345,
    client: "John Doe",
    vehicleInfo: {
      year: 2022,
      make: "Toyota",
      model: "Camry",
    },
    services: ["Service 1", "Service 2", "Service 3"],
    timeCreated: "2023-01-01",
    dueDate: "2023-01-01",
    status: "Pending",
  },
];
const WorkOrders = (props: Props) => {
  return (
    <div className="space-y-8">
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
          <Filter />
        </div>
      </div>
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Work Order#</th>
              <th className="border-b px-4 py-2 text-center">Client </th>
              <th className="border-b px-4 py-2 text-center">Vehicle Info</th>
              <th className="border-b px-4 py-2 text-center">Services</th>
              <th className="border-b px-4 py-2 text-center">Time Created</th>
              <th className="border-b px-4 py-2 text-center">Due Date</th>
              <th className="border-b px-4 py-2 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {workOrders.map(
              (
                {
                  id,
                  client,
                  vehicleInfo,
                  services,
                  timeCreated,
                  dueDate,
                  status,
                },
                index,
              ) => (
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
                    <span className="text-[#6571FF]">{id}</span>
                  </td>
                  <td className="border-b px-4 py-2 text-center">{client}</td>
                  <td className="border-b px-4 py-2 text-center">
                    {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {services.join(", ")}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {timeCreated}
                  </td>
                  <td className="border-b px-4 py-2 text-center">{dueDate}</td>
                  <td className="border-b px-4 py-2 text-center">{status}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkOrders;
