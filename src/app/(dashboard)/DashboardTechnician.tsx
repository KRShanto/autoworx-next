"use client";
import { deleteTask } from "@/actions/task/deleteTask";
import Title from "@/components/Title";
import { usePopupStore } from "@/stores/popup";
import { Task, User } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

import NewTask from "../task/[type]/components/task/NewTask";
import ChartData from "./ChartData";

const DashboardTechnician = ({
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
      <div className="grid grid-cols-11 gap-x-8">
        {/* col 1 */}
        <div className="col-span-3 space-y-12">
          {/* Current Projects */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Current Projects</span>{" "}
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
        {/* col 3 */}
        <div className="col-span-5 space-y-12">
          {/* attendance buttons */}
          <div className="flex justify-between rounded-md p-8 shadow-lg">
            <div>
              <button className="rounded bg-[#6571FF] px-10 py-4 text-white">
                <span className="text-xl font-semibold">Clock-in</span>
                <br />
                <span className="text-xs">10:00 AM</span>
              </button>
            </div>
            <div>
              <button className="rounded bg-[#6571FF] px-10 py-4 text-xl font-semibold text-white">
                <span className="text-xl font-semibold">Checkout</span>
                <br />
                <span className="text-xs">10:00 AM</span>
              </button>
            </div>
            <div>
              <button className="h-full rounded bg-[#6571FF] px-10 py-4 text-xl font-semibold text-white">
                Break
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2">
            {/* <!--col 1 --> */}
            <div>
              {/* Performance */}
              <div className="rounded-md p-8 shadow-lg">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-3xl font-bold">Performance</span>{" "}
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
                  <ChartData heading="Win/Loss Rate" number={435} />
                  <ChartData heading="Employee Pay" number={435} dollarSign />
                </div>
              </div>
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
            </div>
            {/* col 2 */}
            <div>
              {" "}
              {/* recent messages */}
              <div className="rounded-md p-8 shadow-lg">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-3xl font-bold">Recent Messages</span>{" "}
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

const Message = () => {
  return (
    <div className="flex items-start gap-x-4 rounded border p-2">
      <Image width={60} height={60} src="/images/default.png" alt="" />
      <div>
        <p className="font-semibold">John Doe</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          libero suscipit modi ex officia. Blanditiis.
        </p>
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

export default DashboardTechnician;
