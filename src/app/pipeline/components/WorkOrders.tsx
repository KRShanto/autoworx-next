import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import Filter from "./Filter";
import { useServerGet } from "@/hooks/useServerGet";
import { getWorkOrders } from "@/actions/pipelines/getWorkOrders";
import { useEstimateFilterStore } from "@/stores/estimate-filter";

type Props = {
  type: string;
};

const WorkOrders = ({ type }: Props) => {
  const { data: invoices } = useServerGet(getWorkOrders);
  const { search } = useEstimateFilterStore();

  const filteredInvoices = invoices?.filter(
    (invoice) =>
      invoice.client?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.client?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.vehicle?.make?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.vehicle?.model?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceItems.some((item) =>
        item.service?.name.toLowerCase().includes(search.toLowerCase()),
      ),
  );
  return (
    <div className="space-y-8">
      <Filter pipelineType={type} />
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-left">Work Order#</th>
              <th className="border-b px-4 py-2 text-left">Client </th>
              <th className="border-b px-4 py-2 text-left">Vehicle Info</th>
              <th className="border-b px-4 py-2 text-left">Services</th>
              <th className="border-b px-4 py-2 text-left">Time Created</th>
              <th className="border-b px-4 py-2 text-left">Due Date</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices &&
              filteredInvoices.map((invoice, index) => {
                const id = invoice.id;
                const client =
                  invoice.client?.firstName + " " + invoice.client?.lastName;
                const vehicle = `${invoice.vehicle?.year} ${invoice.vehicle?.make} ${invoice.vehicle?.model}`;
                const serviceString = invoice.invoiceItems
                  .map((item) => item.service?.name)
                  .join(", ");
                const timeCreated = invoice.createdAt.toDateString();

                return (
                  <tr
                    key={index}
                    className={cn(
                      "rounded-md",
                      index % 2 === 0 ? "bg-white" : "bg-blue-100",
                    )}
                  >
                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full text-[#6571FF]"
                      >
                        {id}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full"
                      >
                        {client}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full"
                      >
                        {vehicle}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full"
                      >
                        {serviceString}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full"
                      >
                        {timeCreated}
                      </Link>
                    </td>

                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full"
                      ></Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link
                        href={`/estimate/workorder/${id}`}
                        className="block h-full w-full"
                      >
                        {invoice.column?.title}
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkOrders;
