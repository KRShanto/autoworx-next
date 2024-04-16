import { db } from "@/lib/db";
import { auth } from "../auth";
import { AuthSession } from "@/types/auth";
import moment from "moment";
import CustomerListOptions from "./CustomerListOptions";

export default async function CustomerList() {
  const session = (await auth()) as AuthSession;
  const customers = await db.customer.findMany({
    where: {
      companyId: session.user.companyId,
    },
  });

  return (
    <table className="mt-10 w-full table-auto text-left">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Join Date</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody className="bg-gray-200">
        {customers.map((customer, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-300" : ""}>
            <td className="px-4 py-2">{customer.name}</td>
            <td className="px-4 py-2">{customer.email}</td>
            <td className="px-4 py-2">
              {moment(customer.createdAt).format("DD/MM/YYYY")}
            </td>
            <td className="px-4 py-2">
              <CustomerListOptions customer={customer} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
