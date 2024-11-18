"use client";
import { getAdminInfo } from "@/actions/dashboard/data/getAdminInfo";
import { useServerGetInterval } from "@/hooks/useServerGet";
import { usePopupStore } from "@/stores/popup";
import { LeaveRequest, Task as TaskType, User } from "@prisma/client";
import Link from "next/link";
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
  const { data } = useServerGetInterval(getAdminInfo, 5000);

  return (
    <div className="flex h-full items-start gap-x-2 xl:gap-x-8">
      {/* col 1 */}
      <div className="flex h-full w-[23%] flex-col justify-around space-y-4">
        {/* sales pipeline */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Sales Pipeline</span>{" "}
            <Link href="/pipeline/sales?view=pipelines">
              <FaExternalLinkAlt />
            </Link>
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
              isNumberPercent
            />
          </div>
        </div>
        {/* Shop pipeline */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Shop Pipeline</span>{" "}
            <Link href="/pipeline/shop?view=pipelines">
              <FaExternalLinkAlt />
            </Link>
          </div>
          <div className="space-y-3">
            <ChartData
              heading="Total Jobs"
              number={data?.totalJobs?.jobs}
              isPositive={data?.totalJobs?.growth?.isPositive}
              rate={data?.totalJobs?.growth?.rate}
            />
            <ChartData
              heading="Ongoing Jobs"
              number={data?.ongoingJobs?.ongoingJobs}
              noRate
            />
            <ChartData
              heading="Completed Jobs"
              number={data?.completedJobs?.completedJobs}
              isPositive={data?.completedJobs?.growth?.isPositive}
              rate={data?.completedJobs?.growth?.rate}
            />
          </div>
        </div>
      </div>
      {/* col 2 */}
      <div className="flex h-full w-[23%] flex-col justify-around space-y-4">
        {/* Revenue */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Revenue</span>{" "}
            <Link href="/reporting/revenue">
              <FaExternalLinkAlt />
            </Link>
          </div>
          <div className="#px-4">
            <ChartData
              heading="Current Revenue"
              dollarSign={true}
              number={data?.revenue?.revenue}
              isPositive={data?.revenue?.growth?.isPositive}
              rate={data?.revenue?.growth?.rate}
            />
            <ChartData
              heading="Expected Revenue"
              dollarSign={true}
              number={data?.expectedRevenue?.revenue}
              isPositive={data?.expectedRevenue?.growth?.isPositive}
              rate={data?.expectedRevenue?.growth?.rate}
            />
          </div>
        </div>
        {/* Inventory */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Inventory</span>{" "}
            <Link href="/reporting/inventory">
              <FaExternalLinkAlt />
            </Link>
          </div>
          <div className="#px-4">
            <ChartData
              heading="Total Value"
              dollarSign={true}
              number={data?.inventory?.totalValue}
              noRate
            />
            <ChartData
              heading="Current Monthly Total"
              number={data?.inventory?.currentMonthTotal}
              dollarSign={true}
              isPositive={data?.inventory?.growth?.isPositive}
              rate={data?.inventory?.growth?.rate}
            />
          </div>
        </div>
        {/* Employee Payout */}
        <div className="rounded-md p-4 shadow-lg 2xl:px-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl font-bold">Employee Payout</span>{" "}
            <Link href="/reporting/workforce">
              <FaExternalLinkAlt />
            </Link>
          </div>
          <div className="#px-4">
            <ChartData
              heading="Current Month Payout"
              number={data?.employeePayout?.currentMonthTotal}
              dollarSign
              isPositive={data?.employeePayout?.growth?.isPositive}
              rate={data?.employeePayout?.growth?.rate}
            />
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
