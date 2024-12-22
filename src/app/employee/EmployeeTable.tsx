"use client";
import { cn } from "@/lib/cn";
import { useEmployeeFilterStore } from "@/stores/employeeFilter";
import { User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteEmployee from "./DeleteEmployee";
import EditEmployee from "./EditEmployee";

export default function EmployeeTable({ employees }: { employees: User[] }) {
  const { dateRange, search, type } = useEmployeeFilterStore();
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>(employees);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const isWithinDateRange =
        dateRange[0] && dateRange[1]
          ? moment.utc(employee.joinDate).isSameOrAfter(dateRange[0], "day") &&
            moment.utc(employee.joinDate).isSameOrBefore(dateRange[1], "day")
          : true;

      const isTypeMatch =
        type !== "All" ? employee.employeeType === type : true;

      const isSearchMatch = search
        ? employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
          employee.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          employee.email.toLowerCase().includes(search.toLowerCase()) ||
          employee.phone?.toLowerCase().includes(search.toLowerCase())
        : true;

      return isWithinDateRange && isTypeMatch && isSearchMatch;
    });

    setFilteredEmployees(filtered);
  }, [dateRange, search, type, employees]);

  return (
    <div className="app-shadow overflow-x-auto rounded-lg bg-white p-2">
      <table className="w-full">
        <thead>
          <tr className="h-10 border-b">
            <th className="border-b px-4 py-2 text-left">Employee ID</th>
            <th className="border-b px-4 py-2 text-left">Name </th>
            <th className="border-b px-4 py-2 text-left">Email</th>
            <th className="border-b px-4 py-2 text-left">Phone</th>
            <th className="border-b px-4 py-2 text-left">Joined</th>
            <th className="border-b px-4 py-2 text-center">Type</th>
            <th className="border-b px-4 py-2 text-center">Edit</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr
              key={index}
              className={cn(index % 2 === 0 ? "bg-white" : "bg-blue-100")}
            >
              <td className="border-b px-4 py-2 text-left">
                <Link
                  className="block h-full w-full text-blue-500"
                  href={`/employee/${employee.id}`}
                >
                  {employee.id}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-left">
                <Link
                  className="block h-full w-full"
                  href={`/employee/${employee.id}`}
                >
                  {employee.firstName} {employee.lastName}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-left">
                <Link
                  className="block h-full w-full"
                  href={`/employee/${employee.id}`}
                >
                  {employee.email}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-left">
                <Link
                  className="block h-full w-full"
                  href={`/employee/${employee.id}`}
                >
                  {employee.phone}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-left">
                <Link
                  className="block h-full w-full"
                  href={`/employee/${employee.id}`}
                >
                  {moment
                    .utc(employee.joinDate || employee.createdAt)
                    .format("MM/DD/YYYY")}
                </Link>
              </td>
              <td className="border-b px-4 py-2 text-center">
                <Link
                  className="block h-full w-full"
                  href={`/employee/${employee.id}`}
                >
                  {employee.employeeType}
                </Link>
              </td>
              <td className="border-b border-l bg-white px-4 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <EditEmployee employee={employee} />
                  <DeleteEmployee employee={employee} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
