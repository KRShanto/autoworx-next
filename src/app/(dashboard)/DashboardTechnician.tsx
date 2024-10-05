"use client";
import { deleteTask } from "@/actions/task/deleteTask";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

import NewTask from "../task/[type]/components/task/NewTask";
import AppointmentDetails from "./AppointmentDetails";
import ChartData from "./ChartData";
import Message from "./Message";
import Task from "./Task";

const DashboardTechnician = ({
  tasks,
  companyUsers,
  appointments,
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
          <div className="rounded-md p-4 shadow-lg xl:p-8">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold xl:text-3xl">
                Current Projects
              </span>{" "}
              <Link href="/task/day">
                <FaExternalLinkAlt />
              </Link>
            </div>
            <div className="space-y-4">
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
        </div>

        {/* col 2 */}
        <div className="w-[25%] space-y-12">
          {/* task list */}
          <div className="rounded-md p-4 shadow-lg xl:p-8">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold xl:text-3xl">Task List</span>{" "}
              <Link href="/task/day">
                <FaExternalLinkAlt />
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <Task key={idx} task={task} companyUsers={companyUsers} />
              ))}
              <div className="mt-4 w-20 rounded-full">
                <NewTask companyUsers={companyUsers} />
              </div>
            </div>
          </div>
          {/* appointments */}
          <div className="rounded-md p-4 shadow-lg xl:p-8">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold xl:text-3xl">
                Appointments
              </span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="space-y-4">
              {appointments.map((appointment: any, idx: any) => (
                <AppointmentDetails appointment={appointment} key={idx} />
              ))}
            </div>
          </div>
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
                  <span className="text-2xl font-bold xl:text-3xl">
                    Performance
                  </span>{" "}
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
                  <span className="text-2xl font-bold xl:text-3xl">
                    Monthly Payout
                  </span>{" "}
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
              <div className="rounded-md p-4 shadow-lg xl:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-2xl font-bold xl:text-3xl">
                    Recent Messages
                  </span>{" "}
                  <span>
                    <FaExternalLinkAlt />
                  </span>
                </div>
                <div className="text-sm">
                  <input
                    className="mb-4 w-full rounded border border-[#03A7A2] px-4 py-2"
                    type="text"
                    placeholder="Search messages"
                  />
                  <div className="space-y-4">
                    {new Array(10).fill(0).map((_, idx) => (
                      <Message key={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default DashboardTechnician;
