import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";
import { useServerGet } from "@/hooks/useServerGet";
import moment from "moment";
import { getLeads } from "@/actions/pipelines/getLeads";

type Props = {
  type: string;
};

const Leads = ({ type }: Props) => {
  const { data: leads } = useServerGet(getLeads);

  return (
    <div className="space-y-8">
      {/* TODO */}
      {/* <Filter pipelineType={type} /> */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-left">Lead#</th>
              <th className="border-b px-4 py-2 text-left">Client </th>
              <th className="border-b px-4 py-2 text-left">Vehicle Info</th>
              <th className="border-b px-4 py-2 text-left">Services</th>
              <th className="border-b px-4 py-2 text-left">Assigned To</th>
              <th className="border-b px-4 py-2 text-left">Lead Source</th>
              <th className="border-b px-4 py-2 text-left">Comments</th>
              <th className="border-b px-4 py-2 text-left">Time Created</th>
            </tr>
          </thead>

          <tbody>
            {leads &&
              leads.map((lead, index) => {
                const timeCreated = moment(lead.createdAt).format("MM/DD/YYYY");

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
                        href="#"
                        className="block h-full w-full text-[#6571FF]"
                      >
                        {lead.id}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {lead.clientName}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {lead.vehicleInfo}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {lead.services}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {/* Assigned to */}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {lead.source}
                      </Link>
                    </td>

                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {lead.comments}
                      </Link>
                    </td>
                    <td className="border-b px-4 py-2 text-left">
                      <Link href="#" className="block h-full w-full">
                        {timeCreated}
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

export default Leads;
