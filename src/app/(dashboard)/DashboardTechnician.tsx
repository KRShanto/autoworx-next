"use client";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

import Appointments from "./Appointments";
import ChartData from "./ChartData";
import CurrentProjects from "./CurrentProjects";
import RecentMessages from "./RecentMessages";
import Tasks from "./Tasks";

const DashboardTechnician = ({
  tasks = [],
  companyUsers = [],
  appointments = [],
}: {
  tasks: TaskType[];
  companyUsers: User[];
  appointments: any;
}) => {
  const { open } = usePopupStore();

  return (
    <div className="p-8">
      <Title>Dashboard</Title>
      <div className="flex items-start gap-x-4">
        {/* col 1 */}
        <div className="w-[30%] space-y-12">
          {/* Current Projects */}
          <CurrentProjects />
        </div>

        {/* col 2 */}
        <div className="w-[25%] space-y-12">
          {/* task list */}
          <Tasks tasks={tasks} companyUsers={companyUsers} />
          {/* appointments */}
          <Appointments appointments={appointments} />
        </div>
        {/* col 3 */}
        <div className="w-[45%] space-y-12">
          {/* attendance buttons */}
          <div className="flex justify-between gap-x-2 rounded-md p-4 shadow-lg xl:p-8">
            <div>
              <button className="h-full rounded bg-[#6571FF] px-4 py-4 text-white xl:px-10">
                <span className="font-semibold xl:text-xl">Clock-in</span>
                <br />
                <span className="text-xs">10:00 AM</span>
              </button>
            </div>
            <div>
              <button className="h-full rounded bg-[#6571FF] px-4 py-4 text-xl font-semibold text-white xl:px-10">
                <span className="font-semibold xl:text-xl">Checkout</span>
                <br />
                <span className="text-xs">10:00 AM</span>
              </button>
            </div>
            <div>
              <button className="h-full rounded bg-[#6571FF] px-4 py-4 font-semibold text-white xl:px-10 xl:text-xl">
                Break
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2">
            {/* <!--col 1 --> */}
            <div>
              {/* Performance */}
              <div className="rounded-md p-4 shadow-lg xl:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-2xl font-bold">Performance</span>{" "}
                  <span>
                    <FaExternalLinkAlt />
                  </span>
                </div>
                <div className="#px-4">
                  <ChartData heading="Total Jobs" number={567} />
                  <ChartData heading="On-time Completion Rate" number={767} />
                  <ChartData heading="Job Return Rate" number={435} />
                </div>
              </div>
              <div className="rounded-md p-4 shadow-lg xl:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-2xl font-bold">Monthly Payout</span>{" "}
                  <span>
                    <FaExternalLinkAlt />
                  </span>
                </div>
                <div className="#px-4">
                  <ChartData heading="Current Payout" number={567} />
                  <ChartData heading="Projected Payout" number={767} />
                </div>
              </div>
            </div>
            {/* col 2 */}
            <div>
              {" "}
              {/* recent messages */}
              <RecentMessages />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTechnician;
