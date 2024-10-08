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

const DashboardOther = ({
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
          {/* recent messages */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold">Recent Messages</span>{" "}
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

        {/* col 2 */}
        <div className="w-[30%] space-y-12">
          {/* appointments */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold">Appointments</span>{" "}
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
          {/* task list */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold">Task List</span>{" "}
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
        </div>
        {/* col 3 */}
        <div className="w-[40%] space-y-12">
          {/* attendance buttons */}
          <div className="flex justify-between gap-x-2 rounded-md p-8 shadow-lg">
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
    </div>
  );
};

export default DashboardOther;
