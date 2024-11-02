import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

type Props = {};

const CurrentProjects = (props: Props) => {
  return (
    <div className="flex h-[82vh] flex-col rounded-md p-6 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xl font-bold">Current Projects</span>{" "}
        <Link href="/task/day">
          <FaExternalLinkAlt />
        </Link>
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col space-y-4">
        {new Array(10).fill(0).map((_, idx) => (
          <div
            key={idx}
            className="flex items-stretch justify-between rounded border border-gray-400 px-4 py-6 text-sm"
          >
            <div>
              <p className="font-semibold">Year Make Model</p>
              <div>
                <p>Service 1</p>
                <p>Service 2</p>
                <p>Service 3</p>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="#mb-auto">
                <button className="rounded bg-[#6571FF] px-4 py-1 text-white">
                  View Work Order
                </button>
              </div>
              <div className="#mt-auto">
                <p className="font-semibold">Due : 12 Feb 2023</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentProjects;
