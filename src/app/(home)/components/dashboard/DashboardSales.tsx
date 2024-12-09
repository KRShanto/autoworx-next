"use client";
import Title from "@/components/Title";
import { Task as TaskType, User } from "@prisma/client";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import Appointments from "./Appointments";
import ChartData from "./ChartData";
import RecentMessages from "./RecentMessages";
import Tasks from "./Tasks";

const Dashboard = ({
  tasks = [],
  companyUsers = [],
  appointments = [],
}: {
  tasks: TaskType[];
  companyUsers: User[];
  appointments: any;
}) => {
  return (
    <div className="flex h-full flex-col gap-x-2 lg:flex-row lg:items-start xl:gap-x-8">
      {/* col 1 */}
      <div className="#order-1 #lg:order-3 space-y-4 lg:w-[25%]">
        {/* task list */}
        <Tasks fullHeight tasks={tasks} companyUsers={companyUsers} />
      </div>

      {/* col 2 */}
      <div className="#order-2 space-y-4 lg:w-[25%]">
        {/* appointments */}
        <Appointments fullHeight appointments={appointments} fu />
      </div>
      {/* col 3 */}
      <div className="#order-3 h-full space-y-4 lg:order-none order-first lg:w-[20%]">
        {/* Performance */}
        <div className="h-full rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Performance</span>{" "}
            <Link href="/reporting/workforce">
              <FaExternalLinkAlt />
            </Link>
          </div>
          <div className="flex h-[80%] flex-col justify-around space-y-3">
            <ChartData
              heading="Leads coming in"
              subHeading="/month"
              number={567}
            />
            <ChartData heading="Leads Converted" number={767} />
            <ChartData heading="Win/Loss Rate" number={435} />
            <ChartData heading="Employee Pay" number={435} dollarSign />
          </div>
        </div>
      </div>
      {/* col 4 */}
      <div className="#order-4 space-y-4 lg:w-[25%]">
        {/* recent messages */}
        <RecentMessages />
      </div>
    </div>
  );
};

export default Dashboard;
