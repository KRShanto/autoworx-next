"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/Tooltip";
import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "@/stores/popup";
import type {
  AppointmentFull,
  CalendarAppointment,
  CalendarTask,
} from "@/types/db";
import type {
  CalendarSettings,
  Client,
  EmailTemplate,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useDrop } from "react-dnd";
import { FaPen } from "react-icons/fa6";
import { assignAppointmentDate } from "../../../../actions/appointment/assignAppointmentDate";
import { dragTask } from "../../../../actions/task/dragTask";

function useMonth() {
  const searchParams = useSearchParams();
  const month = moment(searchParams.get("month"), moment.HTML5_FMT.MONTH);
  return (month.isValid() ? month : moment().startOf("month")).toDate();
}

export default function Month({
  tasks,
  companyUsers,
  tasksWithoutTime,
  appointments,
  appointmentsFull,
  customers,
  vehicles,
  settings,
  templates,
}: {
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  appointments: CalendarAppointment[];
  appointmentsFull: AppointmentFull[];
  customers: Client[];
  vehicles: Vehicle[];
  settings: CalendarSettings;
  templates: EmailTemplate[];
}) {
  const router = useRouter();
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ["task", "tag", "appointment"],
    drop: (item, monitor) => {
      // Update your state here
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }) as [{ canDrop: boolean; isOver: boolean }, any];
  const { open } = usePopupStore();

  const month = useMonth();
  const today = new Date();

  // Get the start of the current month
  const startOfMonth = moment(month).startOf("month").toDate();
  // Get the end of the current month
  const endOfMonth = moment(month).endOf("month").toDate();

  // Initialize an array to hold the dates
  const dates: [Date | null, CalendarTask[], CalendarAppointment[]][] = [];

  // Generate the dates to display
  let currentDate = startOfMonth;
  while (currentDate.getDay() !== 0) {
    dates.push([null, [], []]); // Filling initial empty days
    currentDate = moment(currentDate).subtract(1, "days").toDate();
  }
  currentDate = startOfMonth; // Reset to the start of the month

  while (currentDate <= endOfMonth) {
    const tasks = getTasks(currentDate);
    const appointments = getAppointments(currentDate);
    dates.push([currentDate, tasks, appointments]);
    currentDate = moment(currentDate).add(1, "days").toDate();
  }

  while (dates.length % 7 !== 0) {
    dates.push([null, [], []]); // Filling remaining empty days
  }

  while (dates.length < 35) {
    dates.push([null, [], []]); // Ensure 5 rows of 7 days means 35 days
  }
  function getTasks(date: Date) {
    return tasks.filter(
      (task) =>
        new Date(task.date).getFullYear() === date.getFullYear() &&
        new Date(task.date).getMonth() === date.getMonth() &&
        new Date(task.date).getDate() === date.getDate(),
    );
  }

  function getAppointments(date: Date) {
    return appointments.filter(
      (appointment) =>
        new Date(appointment.date!).getFullYear() === date.getFullYear() &&
        new Date(appointment.date!).getMonth() === date.getMonth() &&
        new Date(appointment.date!).getDate() === date.getDate(),
    );
  }

  const cells = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    ...dates,
  ];

  async function handleDrop(event: React.DragEvent, date: string) {
    // 10 am
    const startTime = "10:00";
    // 6 pm
    const endTime = "18:00";

    // Get the task type
    const type = event.dataTransfer.getData("text/plain").split("|")[0];

    if (type === "tag") {
      const tag = event.dataTransfer.getData("text/plain").split("|")[1];

      // TODO: Add tag to the task
    } else if (type === "task") {
      // Get the id of the task from the dataTransfer object
      const taskId = parseInt(
        event.dataTransfer.getData("text/plain").split("|")[1],
      );

      // Find the task in your state
      const task = tasksWithoutTime.find((task) => task.id === taskId);

      if (task) {
        // Add task to database
        await dragTask({
          id: task.id,
          date: new Date(date),
          startTime,
          endTime,
        });
      }
    } else {
      // Get the id of the appointment from the dataTransfer object
      const appointmentId = parseInt(
        event.dataTransfer.getData("text/plain").split("|")[1],
      );

      // Find the appointment in your state
      const appointment = appointments.find(
        (appointment) => appointment.id == appointmentId,
      );

      if (appointment) {
        // Add appointment to database
        await assignAppointmentDate({
          id: appointment.id,
          date,
          startTime,
          endTime,
        });
      }
    }
  }

  return (
    <div
      className="mt-3 h-[90.8%] border-l border-t border-neutral-200"
      ref={dropRef}
    >
      <div className="flex w-full">
        {/* cells 0-6 */}
        {cells.slice(0, 7).map((cell, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-center border-b border-r border-neutral-200 p-2 text-[17px] font-bold text-[#797979] max-[1300px]:text-[15px] max-[1150px]:text-[12px]"
          >
            {cell.toLocaleString()}
          </div>
        ))}
      </div>

      <div className="grid h-[93%] grid-cols-7 grid-rows-5">
        {/* cells 7-41 */}
        {cells.slice(7).map((cell: any, i) => (
          <Tooltip key={i}>
            <TooltipTrigger
              type="button"
              className={cn(
                "relative flex h-full flex-col items-end gap-2 border-b border-r border-neutral-200 p-2 text-[23px] font-bold max-[1300px]:text-[17px]",
                today.getFullYear() === cell[0]?.getFullYear() &&
                  today.getMonth() === cell[0]?.getMonth() &&
                  today.getDate() === cell[0]?.getDate()
                  ? "text-[#6571FF]"
                  : "text-[#797979]",
              )}
              onClick={(event) => {
                if (
                  cell[0] &&
                  event.target instanceof Node &&
                  event.currentTarget.contains(event.target)
                )
                  router.push(
                    `/task/day?date=${moment(cell[0]).format("YYYY-MM-DD")}`,
                  );
              }}
              onDrop={(event) =>
                handleDrop(
                  event,
                  cell[0] ? moment(cell[0]).format("YYYY-MM-DD") : "",
                )
              }
              onDragOver={(event) => event.preventDefault()}
            >
              {cell[0]?.getDate() || ""}

              {cell[0] && (
                <div className="absolute left-2 right-8 top-2 flex max-h-[calc(100%-3rem)] flex-col gap-1">
                  {cell[2]
                    .slice(0, 1)
                    .map((appointment: CalendarAppointment, i: number) => {
                      const moreLeft = cell[2].length - 1;

                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div className="h-10 max-h-10 rounded border-2 border-gray-300 text-sm text-slate-500">
                              {appointment.title}
                            </div>
                          </TooltipTrigger>

                          {moreLeft > 0 && (
                            <button
                              className="text-left text-xs font-normal text-slate-500"
                              onClick={(event) => {
                                if (
                                  event.target instanceof Node &&
                                  event.currentTarget.contains(event.target)
                                )
                                  router.push(
                                    `/task/day?date=${moment(cell[0]).format(
                                      "YYYY-MM-DD",
                                    )}`,
                                  );
                              }}
                            >
                              +{moreLeft} more...
                            </button>
                          )}

                          <TooltipPortal>
                            <TooltipContent>
                              <div className="w-[300px] rounded-lg bg-white p-3">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">
                                    {appointment.title}
                                  </h3>

                                  <button
                                    type="button"
                                    className="text- rounded-full bg-[#6571FF] p-2 text-white"
                                    onClick={() =>
                                      open("UPDATE_APPOINTMENT", {
                                        appointment: appointmentsFull.find(
                                          (appointment) =>
                                            appointment.id === appointment.id,
                                        ),
                                        employees: companyUsers,
                                        customers,
                                        vehicles,
                                        templates,
                                        settings,
                                      })
                                    }
                                  >
                                    <FaPen className="mx-auto text-[10px]" />
                                  </button>
                                </div>

                                <p>
                                  Client: {appointment.client?.firstName}{" "}
                                  {appointment.client?.lastName}
                                </p>

                                <p>
                                  Assigned To:{" "}
                                  {appointment.assignedUsers
                                    .slice(0, 1)
                                    .map(
                                      (user: User) =>
                                        `${user.firstName} ${user.lastName}`,
                                    )}
                                </p>

                                <p>
                                  {moment(
                                    appointment.startTime,
                                    "HH:mm",
                                  ).format("hh:mm A")}{" "}
                                  To{" "}
                                  {moment(appointment.endTime, "HH:mm").format(
                                    "hh:mm A",
                                  )}
                                </p>
                              </div>
                            </TooltipContent>
                          </TooltipPortal>
                        </Tooltip>
                      );
                    })}
                  {cell[1]?.slice(0, 3).map((task: CalendarTask, i: number) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div
                          className="h-2 max-h-[33.33%] rounded"
                          style={{
                            backgroundColor: TASK_COLOR[task.priority],
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipPortal>
                        <TooltipContent>
                          <div className="w-[300px] rounded-lg bg-white p-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{task.title}</h3>

                              <button
                                type="button"
                                className="text- rounded-full bg-[#6571FF] p-2 text-white"
                                onClick={() =>
                                  open("UPDATE_TASK", {
                                    task,
                                    companyUsers,
                                  })
                                }
                              >
                                <FaPen className="mx-auto text-[10px]" />
                              </button>
                            </div>

                            <p className="mt-3">{task.description}</p>

                            <p className="mt-3">
                              Task Priority: {task.priority}
                            </p>
                          </div>
                        </TooltipContent>
                      </TooltipPortal>
                    </Tooltip>
                  ))}

                  {cell[1]?.length > 3 && (
                    <button
                      className="absolute -bottom-6 text-left text-xs font-normal text-slate-500"
                      onClick={(event) => {
                        if (
                          event.target instanceof Node &&
                          event.currentTarget.contains(event.target)
                        )
                          router.push(
                            `/task/day?date=${moment(cell[0]).format(
                              "YYYY-MM-DD",
                            )}`,
                          );
                      }}
                    >
                      +{cell[1].length - 3} more...
                    </button>
                  )}
                </div>
              )}
            </TooltipTrigger>

            <TooltipPortal>
              {/* check if either tasks or appointments are present */}
              {(cell[1]?.length || cell[2]?.length) && (
                <TooltipContent>
                  <div className="max-h-[350px] w-[350px] overflow-y-scroll">
                    <h3 className="text-lg font-bold">Tasks</h3>
                    <div className="flex flex-col gap-1">
                      {cell[1]?.map((task: CalendarTask, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded p-2 text-white"
                          style={{
                            backgroundColor: TASK_COLOR[task.priority],
                          }}
                        >
                          <p>{task.title}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="mt-3 text-lg font-bold">Appointments</h3>
                    <div className="flex flex-col gap-1">
                      {cell[2]?.map(
                        (appointment: CalendarAppointment, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded bg-gray-600 p-2 text-white"
                          >
                            <p>{appointment.title}</p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </TooltipContent>
              )}
            </TooltipPortal>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
