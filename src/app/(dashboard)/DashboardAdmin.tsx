"use client";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { LeaveRequest, Task as TaskType, User } from "@prisma/client";
import { FaExternalLinkAlt } from "react-icons/fa";
import Appointments from "./Appointments";
import ChartData from "./ChartData";
import EmployeeLeaveRequests from "./EmployeeLeaveRequests";
import Tasks from "./Tasks";

const Dashboard = ({
  tasks = [],
  companyUsers = [],
  appointments = [],
  pendingLeaveRequests,
}: {
  tasks: TaskType[];
  companyUsers: User[];
  appointments: any;
  pendingLeaveRequests: (LeaveRequest & { user: User })[];
}) => {
  const { open } = usePopupStore();

  return (
    <div className="flex items-start gap-x-2 xl:gap-x-8">
      {/* col 1 */}
      <div className="w-[23%] space-y-4">
        {/* sales pipeline */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Sales Pipeline</span>{" "}
            <span>
              <FaExternalLinkAlt />
            </span>
          </div>
          <div className="space-y-3">
            <ChartData
              heading="Leads coming in"
              subHeading="/month"
              number={567}
            />
            <ChartData heading="Leads Converted" number={767} />
            <ChartData
              heading="Conversion Rate"
              subHeading="Leads Converted/Total Leads"
              number={435}
            />
          </div>
        </div>
        {/* Shop pipeline */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Shop Pipeline</span>{" "}
            <span>
              <FaExternalLinkAlt />
            </span>
          </div>
          <div className="space-y-3">
            <ChartData heading="Total Jobs" number={567} />
            <ChartData heading="Ongoing Jobs" number={435} />
            <ChartData heading="Completed Jobs" number={767} />
          </div>
        </div>
      </div>
      {/* col 2 */}
      <div className="w-[23%] space-y-4">
        {/* Revenue */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Revenue</span>{" "}
            <span>
              <FaExternalLinkAlt />
            </span>
          </div>
          <div className="#px-4">
            <ChartData heading="Current Value" number={567} dollarSign={true} />
            <ChartData
              heading="Current Monthly Total"
              number={767}
              dollarSign={true}
            />
          </div>
        </div>
        {/* Inventory */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Inventory</span>{" "}
            <span>
              <FaExternalLinkAlt />
            </span>
          </div>
          <div className="#px-4">
            <ChartData heading="Current Value" number={567} dollarSign={true} />
            <ChartData
              heading="Current Monthly Total"
              number={767}
              dollarSign={true}
            />
          </div>
        </div>
        {/* Employee Payout */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Employee Payout</span>{" "}
            <span>
              <FaExternalLinkAlt />
            </span>
          </div>
          <div className="#px-4">
            <ChartData
              heading="Previous Month Payout"
              number={567}
              dollarSign
            />
            <ChartData heading="Current Month Payout" number={767} dollarSign />
            <ChartData heading="YTD Payout" number={435} dollarSign />
          </div>
        </div>
      </div>

      {/* col 3 */}
      <div className="w-[23%] space-y-4">
        {/* appointments */}
        <Appointments appointments={appointments} fullHeight />
      </div>
      {/* col 4*/}
      <div className="w-[30%] space-y-4">
        {/* task list */}
        <Tasks tasks={tasks} companyUsers={companyUsers} />
        {/* employee leave request */}
        <EmployeeLeaveRequests pendingLeaveRequests={pendingLeaveRequests} />
      </div>
    </div>
  );
};

export default Dashboard;
