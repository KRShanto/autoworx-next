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
    <div className="flex h-full items-start gap-x-2 xl:gap-x-8">
      {/* col 1 */}
      <div className="w-[25%] space-y-4">
        {/* task list */}
        <Tasks fullHeight tasks={tasks} companyUsers={companyUsers} />
      </div>

      {/* col 2 */}
      <div className="w-[25%] space-y-4">
        {/* appointments */}
        <Appointments fullHeight appointments={appointments} fu />
      </div>
      {/* col 3 */}
      <div className="h-full w-[20%] space-y-4">
        {/* Performance */}
        <div className="h-full rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Performance</span>{" "}
            <span>
              <FaExternalLinkAlt />
            </span>
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
      <div className="w-[25%] space-y-4">
        {/* recent messages */}
        <RecentMessages />
      </div>
    </div>
  );
};

export default Dashboard;
