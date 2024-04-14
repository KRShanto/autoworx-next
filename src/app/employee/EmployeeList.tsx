import { db } from "@/lib/db";
import { auth } from "../auth";
import { AuthSession } from "@/types/auth";
import EmployeeListOptions from "./EmployeeListOptions";

export default async function EmployeeList() {
  const session = (await auth()) as AuthSession;
  const employees = await db.user.findMany({
    where: {
      role: "employee",
      companyId: session.user.companyId,
    },
  });

  return (
    <table className="mt-10 w-full table-auto text-left">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Mobile</th>
          <th className="px-4 py-2">Department</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Current Assign</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody className="bg-gray-200">
        {employees.map((employee, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-300" : ""}>
            <td className="px-4 py-2">{employee.name}</td>
            <td className="px-4 py-2">{employee.email}</td>
            <td className="px-4 py-2">{employee.phone}</td>
            <td className="px-4 py-2">{employee.employeeDepartment}</td>
            <td className="px-4 py-2">{employee.employeeType}</td>
            <td className="px-4 py-2">{""}</td>
            <td className="px-4 py-2">
              <EmployeeListOptions employee={employee} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
