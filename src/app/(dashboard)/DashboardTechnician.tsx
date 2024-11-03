"use client";
import { usePopupStore } from "@/stores/popup";
import { ClockBreak, ClockInOut, Task as TaskType, User } from "@prisma/client";
import { FaExternalLinkAlt } from "react-icons/fa";

import { stopBreak, takeBreak } from "@/actions/dashboard/break";
import { clockIn } from "@/actions/dashboard/clockIn";
import { clockOut } from "@/actions/dashboard/clockOut";
import { successToast } from "@/lib/toast";
import Appointments from "./Appointments";
import ChartData from "./ChartData";
import CurrentProjects from "./CurrentProjects";
import RecentMessages from "./RecentMessages";
import Tasks from "./Tasks";
function formatDateToCustomString(date: Date) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString("en-US", options);
}

const DashboardTechnician = ({
  tasks = [],
  companyUsers = [],
  appointments = [],
  lastClockInOut,
}: {
  tasks: TaskType[];
  companyUsers: User[];
  appointments: any;
  lastClockInOut: ClockInOut & { ClockBreak: ClockBreak[] };
}) => {
  console.log("🚀 ~ lastClockInOut:", lastClockInOut);
  const { open } = usePopupStore();

  return (
    <div className="flex items-start gap-x-4">
      {/* col 1 */}
      <div className="w-[30%] space-y-4">
        {/* Current Projects */}
        <CurrentProjects />
      </div>

      {/* col 2 */}
      <div className="w-[25%] space-y-4">
        {/* task list */}
        <Tasks tasks={tasks} companyUsers={companyUsers} />
        {/* appointments */}
        <Appointments appointments={appointments} />
      </div>
      {/* col 3 */}
      <div className="w-[45%] space-y-4">
        {/* attendance buttons */}
        <div className="flex justify-between gap-x-2 rounded-md p-4 shadow-lg xl:p-8">
          <div>
            <button
              onClick={async () => {
                if (!lastClockInOut || lastClockInOut?.clockOut) {
                  const res = await clockIn({ clockInTime: new Date() });
                  if (res.success) {
                    successToast("Clocked In Successfully");
                  }
                }
              }}
              className={`h-full rounded ${!lastClockInOut?.clockOut && lastClockInOut?.clockIn ? "bg-[#03A7A2]" : "bg-[#6571FF]"} px-4 py-4 text-white xl:px-10`}
            >
              <span className="font-semibold xl:text-xl">
                {!lastClockInOut?.clockOut && lastClockInOut?.clockIn
                  ? "Clocked-In"
                  : "Clock-In"}
              </span>
              <br />
              {lastClockInOut?.clockIn && !lastClockInOut?.clockOut && (
                <span className="text-xs">
                  {formatDateToCustomString(new Date(lastClockInOut?.clockIn))}
                </span>
              )}
            </button>
          </div>
          <div>
            <button
              onClick={async () => {
                if (lastClockInOut && !lastClockInOut?.clockOut) {
                  const res = await clockOut({
                    clockInOutId: lastClockInOut.id,
                    clockOutTime: new Date(),
                  });
                  if (res.success) {
                    successToast("Clocked Out Successfully");
                  }
                }
              }}
              className="h-full rounded bg-[#6571FF] px-4 py-4 text-xl font-semibold text-white xl:px-10"
            >
              <span className="font-semibold xl:text-xl">Clock-Out</span>
              <br />
              {/* <span className="text-xs">10:00 AM</span> */}
            </button>
          </div>
          <div>
            {lastClockInOut?.ClockBreak[lastClockInOut.ClockBreak.length - 1]
              ?.breakEnd === null || !lastClockInOut ? (
              <button
                onClick={async () => {
                  if (
                    lastClockInOut &&
                    lastClockInOut.ClockBreak?.length > 0 &&
                    lastClockInOut.ClockBreak[
                      lastClockInOut.ClockBreak.length - 1
                    ] &&
                    lastClockInOut?.ClockBreak[
                      lastClockInOut?.ClockBreak?.length - 1
                    ].id
                  ) {
                    const res = await stopBreak({
                      clockBreakId:
                        lastClockInOut.ClockBreak[
                          lastClockInOut.ClockBreak.length - 1
                        ].id,
                      breakEnd: new Date(),
                    });
                    if (res.success) {
                      successToast("Break Started");
                    }
                  }
                }}
                className="h-full rounded bg-[#6571FF] px-4 py-4 font-semibold text-white xl:px-10 xl:text-xl"
              >
                End Break
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!lastClockInOut?.clockOut) {
                    const res = await takeBreak({
                      clockInOutId: lastClockInOut.id,
                      breakStart: new Date(),
                    });
                    if (res?.success) {
                      successToast("Break Started");
                    }
                  }
                }}
                className="h-full rounded bg-[#6571FF] px-4 py-4 font-semibold text-white xl:px-10 xl:text-xl"
              >
                <span>Break</span> <br />
                <span>{lastClockInOut?.ClockBreak?.length} Break</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2">
          {/* <!--col 1 --> */}
          <div>
            {/* Performance */}
            <div className="rounded-md p-4 shadow-lg 2xl:px-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xl font-bold">Performance</span>{" "}
                <span>
                  <FaExternalLinkAlt />
                </span>
              </div>
              <div className="space-y-3">
                <ChartData heading="Total Jobs" number={567} />
                <ChartData heading="On-time Completion Rate" number={767} />
                <ChartData heading="Job Return Rate" number={435} />
              </div>
            </div>
            <div className="rounded-md p-4 shadow-lg xl:p-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xl font-bold">Monthly Payout</span>{" "}
                <span>
                  <FaExternalLinkAlt />
                </span>
              </div>
              <div className="space-y-3">
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
  );
};

export default DashboardTechnician;
