import { db } from "@/lib/db";
import { auth } from "../../auth";
import { AuthSession } from "@/types/auth";
import ServiceListOptions from "./ServiceListOptions";

export default async function ServiceList() {
  const session = (await auth()) as AuthSession;
  const services = await db.service.findMany({
    where: {
      companyId: session.user.companyId,
    },
  });

  return (
    <table className="mt-10 w-full table-auto text-left">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Quantity</th>
          <th className="px-4 py-2">Discount</th>
          <th className="px-4 py-2">Total</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody className="bg-gray-200">
        {services.map((service, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-300" : ""}>
            <td className="px-4 py-2">{service.name}</td>
            <td className="px-4 py-2">{service.description}</td>
            <td className="px-4 py-2">
              {
                // convert to string
                service.price.toLocaleString()
              }
            </td>
            <td className="px-4 py-2">{service.quantity}</td>
            <td className="px-4 py-2">{service.discount.toLocaleString()}</td>
            <td className="px-4 py-2">{service.total.toLocaleString()}</td>
            <td className="px-4 py-2">
              <ServiceListOptions service={service} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
