"use client";
import { cn } from "@/lib/cn";
import { Company } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import ChartData from "../(home)/components/dashboard/ChartData";
import { ComapnyStat, ICompany } from "./page";

type Props = {
  companies: ComapnyStat[];
};

const AWXDashboard = ({ companies }: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<ComapnyStat | null>(
    null,
  );
  return (
    <div className="h-full p-4 text-xs 2xl:p-8 2xl:text-base">
      <div className="flex h-full items-start gap-x-8">
        <div className="#2xl:w-1/2 h-full w-[45%]">
          <h3 className="my-4 text-lg font-bold">Company List</h3>
          <div className="custom-scrollbar h-full space-y-8 rounded-md p-4 shadow-md 2xl:p-8">
            {companies.length == 0 && (
              <p className="text-center text-sm">No companies found</p>
            )}
            {companies.map((company, index) => (
              <div
                key={index}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded border-2 px-3 py-4 2xl:px-8",
                  {
                    "border-[#6571ff]": company.id === selectedCompany?.id,
                    "border-gray-200": company.id !== selectedCompany?.id,
                  },
                )}
                onClick={() => setSelectedCompany(company)}
              >
                {/* company info */}
                <div className="flex items-center gap-x-4">
                  <Image
                    src="/icons/business.png"
                    alt={"sdfds"}
                    width={40}
                    height={40}
                  />
                  <div className="space-y-1">
                    <p className="font-semibold">{company.name}</p>
                    <p>Users : {company.stats.users}</p>
                    <p>Clients : {company.stats.clients}</p>
                    <p>Employee : {company.stats.employees}</p>
                  </div>
                </div>
                <div className="w-[1px] self-stretch rounded bg-gray-300"></div>
                {/* payment info */}
                <div className="space-y-1 px-2 2xl:px-6">
                  <p>
                    Subscribed to{" "}
                    <b>
                      <i>Autoworx Basic Plan</i>
                    </b>
                  </p>
                  <p className="italic">
                    Activated On :{" "}
                    <i>
                      <b>8 August, 2024</b>
                    </i>
                  </p>
                  <p className="italic">
                    Expires On :{" "}
                    <i>
                      <b>8 August, 2024</b>
                    </i>
                  </p>
                  <p className="font-semibold">Payment Status : PAID</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* company details */}
        <div className="#2xl:w-1/2 h-full w-[55%]">
          <h3 className="my-4 text-lg font-bold">Company Details</h3>
          {!selectedCompany && (
            <div className="flex h-full w-full items-center justify-center text-xl text-gray-600">
              Select Company to View Details
            </div>
          )}
          {selectedCompany && (
            <div className="flex h-full items-start space-x-4 space-y-4 rounded-md">
              <div className="h-full w-[50%]">
                {/* company info */}
                <div className="space-y-4 p-4 shadow-lg 2xl:p-8">
                  <Image
                    src="/icons/business.png"
                    alt={"sdfds"}
                    width={60}
                    height={60}
                  />
                  <div className="space-y-1">
                    <p className="font-semibold 2xl:text-xl">
                      {selectedCompany.name}
                    </p>
                    <p>Users : {selectedCompany.stats.users}</p>
                    <p>Clients : {selectedCompany.stats.clients}</p>
                    <p>Employees : {selectedCompany.stats.employees}</p>
                    <ul className="ml-4 mt-2 list-disc space-y-1 pl-4">
                      <li>Technicians : {selectedCompany.stats.technicians}</li>
                      <li>Sales : {selectedCompany.stats.sales}</li>
                      <li>Managers : {selectedCompany.stats.managers}</li>
                    </ul>
                  </div>
                </div>

                {/* Employee Payout */}
                <div className="rounded-md p-4 shadow-lg xl:p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-2xl font-bold">Statistics</span>{" "}
                    <span>
                      <FaExternalLinkAlt />
                    </span>
                  </div>
                  <div className="#px-4">
                    <ChartData
                      heading="Total Revenue"
                      number={567}
                      dollarSign
                    />
                    <ChartData
                      heading="Total Contracts"
                      number={767}
                      dollarSign
                    />
                    <ChartData
                      heading="Client Growth"
                      number={435}
                      dollarSign
                    />
                  </div>
                </div>
              </div>
              <div className="h-full w-[50%] space-y-4">
                {/* payment info */}
                <div className="space-y-2 rounded-lg bg-[#D3D7FF] px-6 py-6 shadow-lg">
                  <p>
                    Subscribed to{" "}
                    <b>
                      <i>Autoworx Basic Plan</i>
                    </b>
                  </p>
                  <p className="italic">
                    Activated On :{" "}
                    <i>
                      <b>8 August, 2024</b>
                    </i>
                  </p>
                  <p className="italic">
                    Expires On :{" "}
                    <i>
                      <b>8 August, 2024</b>
                    </i>
                  </p>
                  <p className="font-semibold">Payment Status : PAID</p>
                  <p className="mt-4 flex items-center gap-x-4">
                    <button className="rounded bg-[#6571ff] px-2 py-1 text-white">
                      Upgrade
                    </button>
                    <button className="rounded bg-[#6571ff] px-2 py-1 text-white">
                      Cancel
                    </button>
                  </p>
                </div>
                {/* reports */}
                <div className="h-[73%] overflow-hidden p-4 text-sm shadow-lg 2xl:p-8">
                  <h1 className="mb-4 text-xl font-semibold">Reports</h1>
                  <div className="custom-scrollbar h-full space-y-2 pb-8">
                    {[1, 1, 1, 1, 1, 1, 1].map((_, idx) => (
                      <div
                        className="flex flex-col gap-y-2 rounded-md border border-gray-300 py-3 pl-4 pr-3 xl:flex-row xl:items-center"
                        key={idx}
                      >
                        <div className="w-full space-y-2">
                          <p className="font-semibold">Invoice Lost</p>
                          <p className="font-semibold">November 23, 2024</p>
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Doloremque ullam commodi, ipsa eligendi,
                            repellat.
                          </p>
                        </div>
                        <div className="w-[35%]">
                          <button className="rounded bg-[#6571ff] px-2 py-1 text-white">
                            Resolve
                          </button>
                        </div>
                        <div className="ml-2 w-[3px] self-stretch rounded bg-[#6571ff]"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AWXDashboard;
