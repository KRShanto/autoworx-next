import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import Filter from "./Filter";
import { useServerGet } from "@/hooks/useServerGet";
import { getWorkOrders } from "@/actions/pipelines/getWorkOrders";
import { useEstimateFilterStore } from "@/stores/estimate-filter";
import { usePipelineFilterStore } from "@/stores/PipelineFilterStore";
import moment from "moment";

type Props = {
  type: string;
};

const WorkOrders = ({ type }: Props) => {
  const { data: invoices } = useServerGet(getWorkOrders);
  const { search } = useEstimateFilterStore();
  const { dateRange, status, service } = usePipelineFilterStore();

  const filteredInvoices = invoices?.filter((invoice) => {
    const mathcedType = invoice.type === "Invoice";
    const matchesSearch =
      invoice.client?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.client?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.vehicle?.make?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.vehicle?.model?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceItems.some((item) =>
        item.service?.name.toLowerCase().includes(search.toLowerCase()),
      );

    const matchesStatus = status ? invoice.column?.title === status : true;

    const matchesDateRange =
      dateRange[0] && dateRange[1]
        ? (() => {
            const invoiceDate = invoice.dueDate
              ? new Date(invoice.dueDate)
              : null;
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(dateRange[1]);
            endDate.setHours(23, 59, 59, 999); // Include the entire end day

            // return invoiceDate >= startDate && invoiceDate <= endDate;
            return invoiceDate
              ? invoiceDate >= startDate && invoiceDate <= endDate
              : false;
          })()
        : true;

    const matchesService = service
      ? invoice.invoiceItems.some((item) => item.service?.name === service)
      : true;

    return (
      mathcedType &&
      matchesSearch &&
      matchesStatus &&
      matchesDateRange &&
      matchesService
    );
  });

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
                // const timeCreated = invoice.createdAt.toDateString();
                // const dueDate = invoice.dueDate;
                const timeCreated = moment(invoice.createdAt).format(
                  "MM/DD/YYYY",
                );
                const dueDate = invoice.dueDate
                  ? moment(invoice.dueDate).format("MM/DD/YYYY")
                  : null;

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
                      >
                        {dueDate}
                      </Link>
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
