"use client";
import Title from "@/components/Title";

import { usePopupStore } from "@/stores/popup";
import { ClockBreak, ClockInOut, Task as TaskType, User } from "@prisma/client";
import { FaExternalLinkAlt } from "react-icons/fa";
import Appointments from "./Appointments";
import RecentMessages from "./RecentMessages";
import { default as Tasks } from "./Tasks";

import { stopBreak, takeBreak } from "@/actions/dashboard/break";
import { clockIn } from "@/actions/dashboard/clockIn";
import { clockOut } from "@/actions/dashboard/clockOut";
import { getTechnicianInfo } from "@/actions/dashboard/data/getTechnicianInfo";
import { fetchRecentMessages } from "@/actions/dashboard/technician/recentMessages";
import { useServerGet, useServerGetInterval } from "@/hooks/useServerGet";
import { successToast } from "@/lib/toast";
import Link from "next/link";
import { useCallback } from "react";
import ChartData from "./ChartData";
import CurrentProjects from "./CurrentProjects";

function formatDateToCustomString(date: Date) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  //@ts-ignore
  return date.toLocaleString("en-US", options);
}
function formatToTimeString(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  // Format minutes with leading zero if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours.toString().padStart(2, "0")}:${formattedMinutes} ${amPm}`;
}

const DashboardOther = ({
  tasks = [],
  companyUsers = [],
  appointments = [],
  lastClockInOut,
}: {
  tasks: TaskType[];
  companyUsers: User[];
  appointments: any;
  lastClockInOut: (ClockInOut & { ClockBreak: ClockBreak[] }) | null;
}) => {
  const { open } = usePopupStore();
  const validBreak = useCallback(
    function (lastClockInOut: ClockInOut & { ClockBreak: ClockBreak[] }) {
      return (
        lastClockInOut &&
        lastClockInOut.ClockBreak?.length > 0 &&
        lastClockInOut.ClockBreak[lastClockInOut.ClockBreak.length - 1] &&
        lastClockInOut?.ClockBreak[lastClockInOut?.ClockBreak?.length - 1].id
      );
    },
    [lastClockInOut],
  );

  return (
    <div className="flex h-full flex-col gap-x-4 gap-y-8 lg:flex-row lg:items-start">
      {/* col 1 */}
      <div className="flex h-full flex-col justify-around space-y-4 lg:w-[30%]">
        {/* recent messages */}
        <RecentMessages />
      </div>

      {/* col 2 */}
      <div className="flex h-full flex-col justify-around space-y-4 lg:w-[30%]">
        {/* appointments */}
        <Appointments appointments={appointments} />
        {/* task list */}
        <Tasks tasks={tasks} companyUsers={companyUsers} />
      </div>
      {/* col 3 */}
      <div className="#justify-around order-first flex h-full flex-col space-y-4 lg:order-none lg:w-[40%]">
        {/* attendance buttons */}
        <div className="#h-[20%] flex justify-between gap-x-2 rounded-md p-4 shadow-lg xl:p-8">
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
              className={`h-full rounded ${!lastClockInOut?.clockOut && lastClockInOut?.clockIn ? "bg-[#03A7A2]" : "bg-[#6571FF]"} ${!lastClockInOut || lastClockInOut?.clockOut ? "cursor-pointer" : "cursor-default"} px-4 py-4 text-white xl:px-10`}
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
              className={`h-full rounded bg-[#6571FF] px-4 py-4 text-xl font-semibold text-white xl:px-10 ${lastClockInOut && lastClockInOut?.clockIn && !lastClockInOut?.clockOut ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="font-semibold xl:text-xl">Clock-Out</span>
              <br />
              {/* <span className="text-xs">10:00 AM</span> */}
            </button>
          </div>
          <div>
            {lastClockInOut &&
            lastClockInOut?.ClockBreak[lastClockInOut?.ClockBreak?.length - 1]
              ?.breakEnd === null ? (
              <button
                onClick={async () => {
                  if (lastClockInOut && validBreak(lastClockInOut)) {
                    const res = await stopBreak({
                      clockBreakId:
                        lastClockInOut.ClockBreak[
                          lastClockInOut.ClockBreak.length - 1
                        ].id,
                      breakEnd: new Date(),
                    });
                    if (res.success) {
                      successToast("Break Ended");
                    }
                  }
                }}
                className={`h-full rounded bg-[#03A7A2] px-4 py-4 font-semibold text-white xl:px-10 xl:text-xl`}
              >
                End Break
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (lastClockInOut && !lastClockInOut?.clockOut) {
                    const res = await takeBreak({
                      clockInOutId: lastClockInOut.id,
                      breakStart: new Date(),
                    });
                    if (res?.success) {
                      successToast("Break Started");
                    }
                  }
                }}
                className={`h-full rounded bg-[#6571FF] px-4 py-4 font-semibold text-white xl:px-10 xl:text-xl ${lastClockInOut && !lastClockInOut?.clockOut ? "cursor-pointer" : "cursor-default"}`}
              >
                <span>Break</span> <br />
                <div className="mt-1 flex flex-col">
                  {!lastClockInOut?.clockOut &&
                    lastClockInOut?.ClockBreak.slice(-3).map((Break, ind) => {
                      return (
                        <span
                          key={ind}
                          className="text-[10px] font-light leading-[1.3]"
                        >
                          {formatToTimeString(Break.breakStart)} -{" "}
                          {Break?.breakEnd &&
                            formatToTimeString(Break?.breakEnd)}
                        </span>
                      );
                    })}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOther;
