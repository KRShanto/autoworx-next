"use client";

import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
// import { usePopupStore } from "@/stores/popup";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import type { CalendarAppointment, CalendarTask } from "@/types/db";
import type { Task, User } from "@prisma/client";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useDrop } from "react-dnd";
import { addTask } from "../../add";
import { TaskDetails } from "./TaskDetails";
import { assignAppointmentDate } from "./assignAppointmentDate";
import { dragTask } from "./dragTask";
import UpdateTask from "../CalendarSidebar/UpdateTask";

function useMonth() {
  const searchParams = useSearchParams();
  const month = moment(searchParams.get("month"), moment.HTML5_FMT.MONTH);
  return (month.isValid() ? month : moment()).toDate();
}

export default function Month({
  tasks,
  companyUsers,
  tasksWithoutTime,
  appointments,
}: {
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  appointments: CalendarAppointment[];
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

  // Initialize an array to hold the dates
  const dates: [Date, CalendarTask[], CalendarAppointment[]][] = [];
  // Define the total number of dates to be displayed
  const totalDates = 35;
  // Get the current date
  const month = useMonth();
  const today = new Date();

  // Get the index of today's date
  const todayIndex = month.getDate() - month.getDay() + 1;

  // Generate the dates before today
  for (let index = 0; index < todayIndex; index++) {
    // Calculate the date number
    const dateNumber = month.getDate() - index - 1;
    // Create a new date object
    const date = new Date(month.getFullYear(), month.getMonth(), dateNumber);
    const tasks = getTasks(date);
    const appointments = getAppointments(date);
    // Add the date to the dates array
    dates.push([date, tasks, appointments]);
  }

  // Reverse the dates array to get the dates in ascending order
  dates.reverse();

  // Add today's date to the dates array
  dates.push([month, getTasks(month), getAppointments(month)]);

  // Calculate the number of dates to be generated after today
  const rest = totalDates - todayIndex - 1;

  // Generate the dates after today
  for (let index = 0; index < rest; index++) {
    // Calculate the date number
    const dateNumber = month.getDate() + index + 1;
    // Create a new date object
    const date = new Date(month.getFullYear(), month.getMonth(), dateNumber);
    // Add the date to the dates array
    dates.push([date, getTasks(date), getAppointments(date)]);
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

      await addTask({ tag, date, startTime, endTime });
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
          date,
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
            className="flex w-full items-center justify-center border-b border-r border-neutral-200 p-2  text-[17px] font-bold text-[#797979] max-[1300px]:text-[15px] max-[1150px]:text-[12px]"
          >
            {cell.toLocaleString()}
          </div>
        ))}
      </div>

      <TooltipProvider delayDuration={150}>
        <div className="grid h-[93%] grid-cols-7 grid-rows-5">
          {/* cells 7-41 */}
          {cells.slice(7).map((cell: any, i) => (
            <Tooltip key={i}>
              <TooltipTrigger
                type="button"
                className={cn(
                  "relative flex h-full flex-col items-end gap-2 border-b border-r border-neutral-200 p-2 text-[23px] font-bold max-[1300px]:text-[17px]",
                  today.getFullYear() === cell[0].getFullYear() &&
                    today.getMonth() === cell[0].getMonth() &&
                    today.getDate() === cell[0].getDate()
                    ? "text-[#6571FF]"
                    : "text-[#797979]",
                )}
                onClick={(event) => {
                  if (
                    event.target instanceof Node &&
                    event.currentTarget.contains(event.target)
                  )
                    router.push(
                      `/task/day?date=${moment(cell[0]).format("YYYY-MM-DD")}`,
                    );
                }}
                onDrop={(event) =>
                  handleDrop(event, moment(cell[0]).format("YYYY-MM-DD"))
                }
                onDragOver={(event) => event.preventDefault()}
              >
                {cell[0].getDate()}

                <div className="absolute bottom-2 left-2 right-2 flex max-h-[calc(100%-3rem)] flex-col gap-1">
                  <TooltipProvider delayDuration={150}>
                    {cell[2]
                      .slice(0, 1)
                      .map((appointment: CalendarAppointment, i: number) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div className="h-10 max-h-10 rounded border text-sm text-slate-500">
                              {appointment.title}
                            </div>
                          </TooltipTrigger>

                          <TooltipPortal>
                            <TooltipContent>
                              <div className="w-[300px] rounded-lg bg-white p-3">
                                <h3 className="font-semibold">
                                  {appointment.title}
                                </h3>

                                <p>
                                  Client: {appointment.customer?.firstName}{" "}
                                  {appointment.customer?.lastName}
                                </p>

                                <p>
                                  Assigned To:{" "}
                                  {appointment.assignedUsers
                                    .slice(0, 1)
                                    .map((user: User) => user.name)}
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
                      ))}
                  </TooltipProvider>
                  <TooltipProvider delayDuration={150}>
                    {cell[1]
                      ?.slice(0, 3)
                      .map((task: CalendarTask, i: number) => (
                        <Tooltip key={i}>
                          <TooltipTrigger
                            className="h-2 max-h-[33.33%] rounded"
                            style={{
                              backgroundColor: TASK_COLOR[task.priority],
                            }}
                          />
                          <TooltipPortal>
                            <TooltipContent>
                              <div className="w-[300px] rounded-lg bg-white p-3">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">
                                    {task.title}
                                  </h3>
                                  <UpdateTask
                                    task={task}
                                    companyUsers={companyUsers}
                                  />
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
                  </TooltipProvider>
                </div>
              </TooltipTrigger>

              <TooltipPortal>
                {/* check if either tasks or appointments are present */}
                {(cell[1]?.length || cell[2]?.length) && (
                  <TooltipContent>
                    <div className="w-[350px]">
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
      </TooltipProvider>
    </div>
  );
}
