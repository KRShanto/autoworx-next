import { CurrentProject } from "@/actions/dashboard/data/getTechnicianInfo";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

type Props = {};

const CurrentProjects = ({ projects = [] }: { projects: CurrentProject[] }) => {
  return (
    <div className="flex h-[82vh] flex-col rounded-md p-6 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xl font-bold">Current Projects</span>{" "}
        <Link href="/pipeline/shop">
          <FaExternalLinkAlt />
        </Link>
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col space-y-4">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="flex items-stretch justify-between rounded border border-gray-400 px-4 py-6 text-sm"
          >
            <div>
              <p className="font-semibold">{project.yearMakeModel}</p>
              <div>
                {project.services.map((service, index) => (
                  <p key={index}>{service.name}</p>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="#mb-auto">
                <button className="rounded bg-[#6571FF] px-4 py-1 text-white">
                  View Work Order
                </button>
              </div>
              <div className="#mt-auto">
                {project.totalPayout && (
                  <p className="font-semibold">
                    Total Payout : ${project.totalPayout}
                  </p>
                )}
                <p className="font-semibold">Due : 12 Feb 2023</p>
              </div>
            </div>
          </div>
        ))}
        {projects?.length === 0 && (
          <div className="my-auto text-center">No current projects</div>
        )}
      </div>
    </div>
  );
};

export default CurrentProjects;
