"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "@/stores/popup";
import type {
  AppointmentFull,
  CalendarAppointment,
  CalendarTask,
  EmailTemplate,
} from "@/types/db";
import type {
  CalendarSettings,
  Customer,
  Order,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { FaPen } from "react-icons/fa6";
import { addTask } from "../../add";
import { assignAppointmentDate } from "./assignAppointmentDate";
import { dragTask } from "./dragTask";

function useWeek() {
  const searchParams = useSearchParams();
  const week = moment(searchParams.get("week"), moment.HTML5_FMT.WEEK);
  return week.isValid() ? week : moment();
}

// Generate the hourly rows
const hourlyRows = Array.from({ length: 24 }, (_, i) => [
  `${i + 1 > 12 ? i + 1 - 12 : i + 1} ${i + 1 >= 12 ? "PM" : "AM"}`,
  // empty cells
  ...Array.from({ length: 7 }, () => ""),
]);

export default function Week({
  tasks,
  companyUsers,
  tasksWithoutTime,
  appointments,
  appointmentsFull,
  customers,
  vehicles,
  orders,
  settings,
  templates,
}: {
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  appointments: CalendarAppointment[];
  appointmentsFull: AppointmentFull[];
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
  settings: CalendarSettings;
  templates: EmailTemplate[];
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);

  const { open } = usePopupStore();

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(dropRef.current!.scrollTop);
    };

    dropRef.current && dropRef.current.addEventListener("scroll", handleScroll);

    return () => {
      dropRef.current &&
        dropRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const week = useWeek();
  const today = week.toDate();

  // Define the days of the week
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Generate the all-day row
  const allDayRow = [
    "All Day",
    // Generate the days of the week with the date
    ...Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      return `${days[date.getDay()]} ${date.getDate()}`;
    }),
  ];

  // Format the date
  function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
  }

  // Format the time
  function formatTime(row: string) {
    const [hour, period] = row.split(" ");
    const time = `${hour.padStart(2, "0")}:00 ${period}`;
    return moment(time, "hh:mm A").format("HH:mm");
  }

  // Combine the all-day row and the hourly rows into a single array
  const rows = [allDayRow, ...hourlyRows];

  // Filter out the tasks that are within the current week
  const events = useMemo<
    ((
      | (CalendarTask & { type: "task" })
      | (CalendarAppointment & { type: "appointment" })
    ) & {
      rowStartIndex: number;
      rowEndIndex: number;
      columnIndex: number;
      type: "task" | "appointment";
    })[]
  >(() => {
    // Get the start and end of the current week
    const startOfWeek = week.startOf("week").toDate();
    const endOfWeek = week.endOf("week").toDate();

    return [
      ...tasks.map((task) => ({ ...task, type: "task" as any })),
      ...appointments.map((appointment) => ({
        ...appointment,
        type: "appointment" as any,
      })),
    ]
      .filter((task) => {
        const taskDate = new Date(task.date as any);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      })
      .map((event) => {
        const taskDate = new Date(event.date as any);
        const columnIndex = taskDate.getDay() - startOfWeek.getDay();

        // Convert the taskStartTime and taskEndTime to a format like "1 PM" or "11 AM"
        const taskStartTime = moment(event.startTime, "HH:mm").format("h A");
        const taskEndTime = moment(event.endTime, "HH:mm").format("h A");

        // Find the rowStartIndex and rowEndIndex by looping over the hourlyRows
        const rowStartIndex = hourlyRows.findIndex((row) =>
          row.includes(taskStartTime),
        );
        const rowEndIndex = hourlyRows.findIndex((row) =>
          row.includes(taskEndTime),
        );

        return { ...event, columnIndex, rowStartIndex, rowEndIndex };
      });
  }, [tasks, appointments, week]);

  async function handleDrop(
    event: React.DragEvent,
    rowIndex: number,
    columnIndex: number,
  ) {
    const startTime = formatTime(hourlyRows[rowIndex - 1][0]);
    const endTime = formatTime(hourlyRows[rowIndex][0]);
    const date = formatDate(
      new Date(
        today.setDate(today.getDate() - today.getDay() + columnIndex - 1),
      ),
    );

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
    <>
      <div
        className="relative mt-3 h-[90%] overflow-auto border border-b border-l border-t border-neutral-200"
        style={{
          backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
        }}
        ref={dropRef}
      >
        {rows.map((row: any, rowIndex: number) => (
          <div
            className={cn(
              "flex h-[45px] overflow-hidden border-neutral-200",
              rowIndex !== rows.length - 1 && "border-b",
            )}
            key={rowIndex}
          >
            {row.map((column: any, columnIndex: number) => {
              const isHeaderCell = columnIndex === 0 || rowIndex === 0;
              const cellWidth =
                columnIndex === 0
                  ? "min-w-[10%] max-w-[10%]"
                  : "min-w-[12.9%] max-w-[12.9%]";

              const fontSize =
                rowIndex === 0
                  ? "font-bold text-[19px] max-[1600px]:text-[15px]"
                  : "text-[17px] max-[1600px]:text-[13px]";
              const cellClasses = cn(
                "border-r border-neutral-200 h-full text-[#797979] flex justify-center items-center",
                cellWidth,
                fontSize,
              );

              function handleClick() {
                const date = formatDate(
                  new Date(
                    today.setDate(
                      today.getDate() - today.getDay() + columnIndex - 1,
                    ),
                  ),
                );
                const startTime = formatTime(row[0]);
                open("ADD_TASK", { date, startTime, companyUsers });
              }

              return (
                <button
                  key={columnIndex}
                  className={cellClasses}
                  disabled={isHeaderCell}
                  onClick={isHeaderCell ? undefined : handleClick}
                  onDrop={(event) => handleDrop(event, rowIndex, columnIndex)}
                  onDragOver={(event) => event.preventDefault()}
                >
                  {column}
                </button>
              );
            })}
          </div>
        ))}

        {events.map((event, index) => {
          // left according to the cell width
          const left = `calc(10% + 12.9% * ${event.columnIndex})`;
          let top = `${45 * event.rowStartIndex + 45}px`;
          // if the previous task starts at the same time as this task
          // then move this task down
          if (
            index > 0 &&
            event.rowStartIndex === events[index - 1].rowStartIndex
          ) {
            top = `${45 * event.rowStartIndex + 45 + 20}px`;
          }
          const height = `${
            45 * (event.rowEndIndex - event.rowStartIndex + 1)
          }px`;
          // width according to the cell width
          const width = "12.9%";
          // @ts-ignore
          const backgroundColor = event.priority
            ? // @ts-ignore
              TASK_COLOR[event.priority]
            : "rgb(100, 116, 139)";

          // Define a function to truncate the task title based on the height
          const truncateTitle = (title: string, maxLength: number) => {
            return title.length > maxLength
              ? `${title.slice(0, maxLength)}...`
              : title;
          };

          // TODO
          // Define the maximum title length based on the height
          const maxTitleLength =
            height === "45px"
              ? 13
              : height === "90px"
                ? 30
                : event.title.length;

          return (
            <Tooltip key={event.id}>
              <TooltipTrigger
                className="absolute top-0 rounded-lg border"
                style={{
                  left,
                  top,
                  height,
                  backgroundColor,
                  width,
                }}
              >
                <p className="z-30 p-1 text-[17px] text-white max-[1600px]:text-[12px]">
                  {truncateTitle(event.title, maxTitleLength)}
                </p>
              </TooltipTrigger>
              <TooltipContent className="h-48 w-72 rounded-md border border-slate-400 bg-white p-3">
                {event.type === "appointment" ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{event.title}</h3>

                      <button
                        type="button"
                        className="text- rounded-full bg-[#6571FF] p-2 text-white"
                        onClick={() =>
                          open("UPDATE_APPOINTMENT", {
                            appointment: appointmentsFull.find(
                              (appointment) => appointment.id === event.id,
                            ),
                            employees: companyUsers,
                            customers,
                            vehicles,
                            orders,
                            templates,
                            settings,
                          })
                        }
                      >
                        <FaPen className="mx-auto text-[10px]" />
                      </button>
                    </div>

                    <p>
                      Client:
                      {event.customer &&
                        `${event.customer.firstName} ${event.customer.lastName}`}
                    </p>

                    <p>
                      Assigned To:{" "}
                      {event.assignedUsers
                        .slice(0, 1)
                        .map((user: User) => user.name)}
                    </p>

                    <p>
                      {moment(event.startTime, "HH:mm").format("hh:mm A")} To{" "}
                      {moment(event.endTime, "HH:mm").format("hh:mm A")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{event.title}</h3>

                      <button
                        type="button"
                        className="text- rounded-full bg-[#6571FF] p-2 text-white"
                        onClick={() =>
                          open("UPDATE_TASK", {
                            task: event,
                            companyUsers,
                          })
                        }
                      >
                        <FaPen className="mx-auto text-[10px]" />
                      </button>
                    </div>

                    {/* @ts-ignore */}
                    <p className="mt-3">{event.description}</p>

                    {/* @ts-ignore */}
                    <p className="mt-3">Task Priority: {event.priority}</p>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </>
  );
}
