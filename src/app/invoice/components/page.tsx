import moment from "moment";
import Link from "next/link";
import { auth } from "../../auth";
import { AuthSession } from "@/types/auth";
import { db } from "@/lib/db";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page() {
  const sessoin = (await auth()) as AuthSession;
  const companyId = sessoin.user.companyId;

  // Get all the invoices for the company
  const invoices = await db.invoice.findMany({
    where: {
      companyId,
    },
    select: {
      invoiceId: true,
      customerId: true,
      vehicleId: true,
      grandTotal: true,
      issueDate: true,
      status: true,
    },
  });

  // Get the customer and vehicle details for each invoice
  const data = await Promise.all(
    invoices.map(async (invoice) => {
      const customer = await db.customer.findFirst({
        where: {
          id: invoice.customerId,
        },
        select: {
          name: true,
          email: true,
        },
      });

      const vehicle = await db.vehicle.findFirst({
        where: {
          id: invoice.vehicleId,
        },
        select: {
          model: true,
        },
      });

      return {
        invoiceId: invoice.invoiceId,
        customerId: invoice.customerId,
        customerName: customer!.name,
        customerEmail: customer!.email,
        vehicleModel: vehicle!.model,
        grandTotal: invoice.grandTotal,
        issueDate: invoice.issueDate,
        status: invoice.status,
      };
    }),
  );

  return (
    <div className="app-shadow mb-10 mt-5 w-full">
      <table className="w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Invoice ID
            </th>
            <th className="w-[100px] px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Client ID
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Client
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Vehicle
            </th>
            <th className="w-[250px] px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="w-[100px] px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Price
            </th>
            <th className="w-[150px] px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>

            <th className="w-[50px] px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Edit
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((invoice) => (
            <tr
              key={invoice.invoiceId}
              className="max-[1600px]:text-sm max-[1500px]:text-xs"
            >
              <td className="px-2 py-4 text-[#6571FF]">
                <Link href={`/invoice/view/${invoice.invoiceId}`}>
                  {invoice.invoiceId}
                </Link>
              </td>
              <td className="px-2 py-4">{invoice.customerId}</td>
              <td className="px-2 py-4">{invoice.customerName}</td>
              <td className="px-2 py-4">{invoice.vehicleModel}</td>
              <td className="px-2 py-4">{invoice.customerEmail}</td>
              <td className="px-2 py-4">
                $ {invoice.grandTotal.toLocaleString()}
              </td>
              <td className="px-2 py-4">
                {moment(invoice.issueDate).format("DD.MM.YYYY")}
              </td>
              <td className="px-2 py-4">{invoice.status}</td>
              <td className="px-2 py-4">
                <Link
                  href={`/invoice/edit/${invoice.invoiceId}`}
                  className="text-blue-500"
                >
                  <Image
                    src="/icons/Edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                    className="max-[1600px]:h-4 max-[1500px]:h-3"
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
