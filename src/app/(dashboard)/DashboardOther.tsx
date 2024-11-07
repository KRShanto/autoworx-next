"use client";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";

import Appointments from "./Appointments";
import RecentMessages from "./RecentMessages";
import { default as Tasks } from "./Tasks";

const DashboardOther = ({
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
    <div className="flex items-start gap-x-4">
      {/* col 1 */}
      <div className="w-[30%] space-y-4">
        {/* recent messages */}
        <RecentMessages />
      </div>

      {/* col 2 */}
      <div className="w-[30%] space-y-4">
        {/* appointments */}
        <Appointments appointments={appointments} />
        {/* task list */}
        <Tasks tasks={tasks} companyUsers={companyUsers} />
      </div>
      {/* col 3 */}
      <div className="w-[40%] space-y-4">
        {/* attendance buttons */}
        <div className="flex justify-between gap-x-2 rounded-md p-6 shadow-lg">
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

        <div className=""></div>
      </div>
    </div>
  );
};

export default DashboardOther;
