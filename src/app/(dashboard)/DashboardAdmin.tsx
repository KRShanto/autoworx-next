"use client";
import { deleteTask } from "@/actions/task/deleteTask";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { Task, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { PiLinkFill } from "react-icons/pi";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import NewTask from "../task/[type]/components/task/NewTask";
import ChartData from "./ChartData";

const Dashboard = ({
  tasks,
  companyUsers,
  appointments,
}: {
  tasks: Task[];
  companyUsers: User[];
  appointments: any;
}) => {
  const { open } = usePopupStore();

  return (
    <div className="p-8">
      <Title>Dashboard</Title>
      <div className="grid grid-cols-9 gap-x-8">
        {/* col 1 */}
        <div className="col-span-2 space-y-12">
          {/* sales pipeline */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Sales Pipeline</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
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
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Shop Pipeline</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
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
        </div>
        {/* col 2 */}
        <div className="col-span-2 space-y-12">
          {/* Revenue */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Revenue</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
              <ChartData
                heading="Current Value"
                number={567}
                dollarSign={true}
              />
              <ChartData
                heading="Current Monthly Total"
                number={767}
                dollarSign={true}
              />
            </div>
          </div>
          {/* Inventory */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Inventory</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
              <ChartData
                heading="Current Value"
                number={567}
                dollarSign={true}
              />
              <ChartData
                heading="Current Monthly Total"
                number={767}
                dollarSign={true}
              />
            </div>
          </div>
          {/* Employee Payout */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Employee Payout</span>{" "}
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
              <ChartData
                heading="Current Month Payout"
                number={767}
                dollarSign
              />
              <ChartData heading="YTD Payout" number={435} dollarSign />
            </div>
          </div>
        </div>

        {/* col 3 */}
        <div className="col-span-2 space-y-12">
          {/* appointments */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Appointments</span>{" "}
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
        {/* col 4*/}
        <div className="col-span-3 space-y-12">
          {/* task list */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Task List</span>{" "}
              <Link href="/task/day">
                <FaExternalLinkAlt />
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-x-4 rounded-md bg-[#6571FF] px-3 py-2 text-lg text-white"
                >
                  <span>
                    {task.title.length > 20
                      ? task.title.slice(0, 20) + "..."
                      : task.title}
                  </span>
                  <span className="flex items-center gap-x-2">
                    <MdOutlineEdit
                      className="cursor-pointer"
                      onClick={() => {
                        open("UPDATE_TASK", {
                          task,
                          companyUsers,
                        });
                      }}
                    />

                    <FaRegCheckCircle
                      className="cursor-pointer"
                      onClick={async () => {
                        await deleteTask(task.id);
                      }}
                    />
                  </span>
                </div>
              ))}
              <div className="mt-4 w-20 rounded-full">
                <NewTask companyUsers={companyUsers} />
              </div>
            </div>
          </div>
          {/* employee leave request */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Employee Leave Request</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="space-y-4">
              <EmployeeLeaveRequest />
              <EmployeeLeaveRequest />
              <EmployeeLeaveRequest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeLeaveRequest = () => {
  return (
    <div className="flex items-start justify-between rounded-md border border-gray-400 px-4 py-4 text-xs">
      <div className="w-[35%]">
        <p className="font-semibold">Leave Reason</p>
        <p>Employee : John Doe</p>
        <p className="mt-4 font-semibold">Start : 23rd July 2023</p>
        <p className="font-semibold">End : 25th July 2023</p>
      </div>
      <div className="w-[45%]">
        <p className="font-semibold">Details :</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
          blanditiis rem unde pariatur harum neque ducimus molestiae aliquam
          sequi temporibus, suscipit nostrum, impedit placeat velit!
        </p>
      </div>
      <div className="flex w-[15%] flex-col gap-y-3 text-xs">
        <button className="w-full rounded bg-[#6571FF] py-1 text-white">
          Accept
        </button>
        <button className="w-full rounded bg-red-500 py-1 text-white">
          Reject
        </button>
      </div>
    </div>
  );
};
const AppointmentDetails = ({ appointment }: any) => {
  const start = moment(appointment.startTime, "HH:mm");
  const end = moment(appointment.endTime, "HH:mm");
  const date = moment(appointment?.date)?.format("Do MMMM YYYY");

  return (
    <div className="flex rounded-md border border-gray-400 py-4 pl-4 pr-2 text-sm">
      <div className="w-[98%]">
        <h1 className="font-semibold">{appointment.title}</h1>
        {appointment.client && (
          <p className="mt-4">
            Client : {appointment.client.firstName}{" "}
            {appointment.client.lastName}
          </p>
        )}
        {appointment.assignedUsers.length > 0 && (
          <p>
            Assigned to :{" "}
            {appointment.assignedUsers.map((assigned: any, idx: any) => (
              <span key={idx}>
                {assigned.firstName} {assigned.lastName}{" "}
                {idx !== appointment.assignedUsers.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}
        {appointment.startTime && (
          <p className="mt-4">
            {`${start.format("h:mm A")} - ${end.format("h:mm A")}`}
          </p>
        )}
        {appointment?.date && <p className="font-semibold">{date}</p>}
      </div>
      <div className="w-[1%] rounded-full bg-[#6571FF]"></div>
    </div>
  );
};

export default Dashboard;
