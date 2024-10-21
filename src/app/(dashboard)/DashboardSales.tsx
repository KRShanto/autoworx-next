"use client";
import Title from "@/components/Title";
import { Task as TaskType, User } from "@prisma/client";
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
    <div className="p-8">
      <Title>Dashboard</Title>
      <div className="flex items-start gap-x-2 xl:gap-x-8">
        {/* col 1 */}
        <div className="w-[25%] space-y-12">
          {/* task list */}
          <Tasks fullHeight tasks={tasks} companyUsers={companyUsers} />
        </div>

        {/* col 2 */}
        <div className="w-[25%] space-y-12">
          {/* appointments */}
          <Appointments fullHeight appointments={appointments} fu />
        </div>
        {/* col 3 */}
        <div className="w-[20%] space-y-12">
          {/* Performance */}
          <div className="rounded-md p-4 shadow-lg xl:p-8">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold">Performance</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
              <ChartData
                heading="Leads coming in"
                subHeading="/month"
                number={567}
                columnView
                largeChart
              />
              <ChartData
                heading="Leads Converted"
                number={767}
                columnView
                largeChart
              />
              <ChartData
                heading="Win/Loss Rate"
                number={435}
                columnView
                largeChart
              />
              <ChartData
                heading="Employee Pay"
                number={435}
                dollarSign
                columnView
                largeChart
              />
            </div>
          </div>
        </div>
        {/* col 4 */}
        <div className="w-[25%] space-y-12">
          {/* recent messages */}
          <RecentMessages />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
