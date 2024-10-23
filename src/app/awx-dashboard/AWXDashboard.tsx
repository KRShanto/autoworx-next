"use client";
import { cn } from "@/lib/cn";
import { Company } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import ChartData from "./ChartData";
import { ComapnyStat, ICompany } from "./page";

type Props = {
  companies: ComapnyStat[];
};

const AWXDashboard = ({ companies }: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<ComapnyStat | null>(
    null,
  );
  return (
    <div className="h-full p-8">
      <div className="flex h-full items-start gap-x-8">
        <div className="h-full w-1/2">
          <h3 className="my-4 text-lg font-bold">Company List</h3>
          <div className="custom-scrollbar h-full space-y-8 rounded-md p-8 shadow-md">
            {companies.length == 0 && (
              <p className="text-center text-sm">No companies found</p>
            )}
            {companies.map((company, index) => (
              <div
                key={index}
                className={cn("flex items-center rounded border-2 px-8 py-4", {
                  "border-[#6571ff]": company.id === selectedCompany?.id,
                  "border-gray-200": company.id !== selectedCompany?.id,
                })}
                onClick={() => setSelectedCompany(company)}
              >
                {/* company info */}
                <div className="flex w-[40%] items-center gap-x-4">
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
                {/* payment info */}
                <div className="w-[60%] space-y-1">
                  <p>Subscribed to Autoworx Basic Plan</p>
                  <p>Activated On : 8 August, 2024</p>
                  <p>Expires On : 8 August, 2024</p>
                  <p>Payment Status : Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* company details */}
        <div className="h-full w-1/2">
          <h3 className="my-4 text-lg font-bold">Company Details</h3>

          {selectedCompany && (
            <div className="flex h-full items-start space-x-4 space-y-4 rounded-md">
              <div className="h-full w-[50%]">
                {/* company info */}
                <div className="space-y-4 p-8 shadow-lg">
                  <Image
                    src="/icons/business.png"
                    alt={"sdfds"}
                    width={60}
                    height={60}
                  />
                  <div className="space-y-1">
                    <p className="text-xl font-semibold">
                      {selectedCompany.name}
                    </p>
                    <p>Users : {selectedCompany.stats.users}</p>
                    <p>Clients : {selectedCompany.stats.clients}</p>
                    <p>Employees : {selectedCompany.stats.employees}</p>
                    <ul className="ml-4 mt-2 list-disc space-y-1 pl-4 text-sm">
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
                <div className="h-[25%] space-y-1 bg-[#D3D7FF] p-4 shadow-lg">
                  <p>Subscribed to Autoworx Basic Plan</p>
                  <p>Activated On : 8 August, 2024</p>
                  <p>Expires On : 8 August, 2024</p>
                  <p>Payment Status : Paid</p>
                </div>
                {/* reports */}
                <div className="h-[75%] p-8 text-sm shadow-lg">
                  <h1 className="mb-4 text-xl font-semibold">Reports</h1>
                  <div className="custom-scrollbar h-full space-y-2 pb-8">
                    {[1, 1, 1, 1, 1, 1, 1].map((_, idx) => (
                      <div
                        className="flex items-center rounded-md border border-gray-300 px-4 py-2"
                        key={idx}
                      >
                        <div className="w-[70%]">
                          <p>Invoice Lost</p>
                          <p>November 23, 2024</p>
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Doloremque ullam commodi, ipsa eligendi,
                            repellat.
                          </p>
                        </div>
                        <div className="w-[28%]">
                          <button className="rounded bg-[#6571ff] px-2 py-1 text-white">
                            Resolve
                          </button>
                        </div>
                        <div className="w-[5px] flex-1 self-stretch rounded bg-[#6571ff]"></div>
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
