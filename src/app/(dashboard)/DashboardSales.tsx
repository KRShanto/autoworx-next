"use client";
import { deleteTask } from "@/actions/task/deleteTask";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { FaExternalLinkAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import NewTask from "../task/[type]/components/task/NewTask";
import AppointmentDetails from "./AppointmentDetails";
import ChartData from "./ChartData";
import Message from "./Message";
import Task from "./Task";

const Dashboard = ({
  tasks,
  companyUsers,
  appointments,
}: {
  tasks: TaskType[];
  companyUsers: User[];
  appointments: any;
}) => {
  return (
    <div className="p-8">
      <Title>Dashboard</Title>
      <div className="grid grid-cols-4 gap-x-4 xl:gap-x-8">
        {/* col 1 */}
        <div className="col-span-1 space-y-12">
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
        </div>

        {/* col 2 */}
        <div className="col-span-1 space-y-12">
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
        <div className="col-span-1 space-y-12">
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
        <div className="col-span-1 space-y-12">
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
  );
};

export default Dashboard;
