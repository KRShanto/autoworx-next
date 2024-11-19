"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "@/stores/popup";
import type {
  AppointmentFull,
  CalendarAppointment,
  CalendarTask,
} from "@/types/db";
import {
  formatDate,
  formatTime,
  updateTimeSpace,
} from "@/utils/taskAndActivity";
import type {
  CalendarSettings,
  Client,
  EmailTemplate,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import mergeRefs from "merge-refs";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { FaPen } from "react-icons/fa6";
import { assignAppointmentDate } from "../../../../actions/appointment/assignAppointmentDate";
import { updateTask } from "../../../../actions/task/dragTask";
import DraggableTaskTooltip from "../components/day/draggable/DraggableTaskTooltip";

function useWeek() {
  const searchParams = useSearchParams();
  const week = moment(searchParams.get("week"), moment.HTML5_FMT.WEEK);
  return week.isValid() ? week : moment();
}

// Generate the hourly rows
const hourlyRows = Array.from({ length: 24 }, (_, i) => {
  const emptyCells = Array.from({ length: 7 }, () => "");
  if (i === 0) {
    return ["12 AM", ...emptyCells];
  } else if (i < 12) {
    return [`${i} AM`, ...emptyCells]; // 1 AM to 11 AM
  } else if (i === 12) {
    return ["12 PM", ...emptyCells]; // Noon
  } else if (i < 24) {
    return [`${i - 12} PM`, ...emptyCells]; // 1 PM to 11 PM
  } else {
    return ["12 AM", ...emptyCells]; // Midnight of the next day
  }
});

function getNext7Days(startDayName: string, today: Date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDate = new Date(today);
  const currentDayIndex = currentDate.getDay(); // Day index of today
  const targetDayIndex = daysOfWeek.findIndex(
    (day) => day.toLowerCase() === startDayName.toLowerCase(),
  );

  if (targetDayIndex === -1) {
    throw new Error("Invalid day name!");
  }

  // Find the starting date for the given day name
  const daysUntilTarget = (targetDayIndex - currentDayIndex) % 7; // Distance to the next target day
  const startDate = new Date(today);
  startDate.setDate(currentDate.getDate() + daysUntilTarget); // Adjust to the start day

  // Generate next 7 days with names and dates
  const weekWithDates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i); // Increment by `i` days
    weekWithDates.push({
      dayName: daysOfWeek[day.getDay()],
      date: day.toDateString(),
    });
  }

  return weekWithDates;
}

export default function Week({
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [draggedOverRow, setDraggedOverRow] = useState<{
    r: number;
    c: number;
  } | null>(null);

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

  const weekStart = settings?.weekStart || "Sunday";
  const parentRef = useRef<HTMLDivElement>(null);
  const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get the days of the week based on the weekStart
  const days = useMemo(() => {
    let sevenDaysWeek = getNext7Days(weekStart, today);
    const weekStartDate = sevenDaysWeek[0].date;
    const weekEndDate = sevenDaysWeek[6].date;
    if (!week.isBetween(weekStartDate, weekEndDate, "day", "[]")) {
      const back7Days = week.clone().subtract(7, "days").toDate();
      sevenDaysWeek = getNext7Days(weekStart, back7Days);
    }
    return sevenDaysWeek;
  }, [weekStart, today]);

  // Generate the all-day row
  const allDayRow = [
    "",
    // Generate the days of the week with the date
    ...days.map((day) => {
      const date = new Date(day.date);
      return (
        <div
          key={day.dayName}
          className="flex flex-col items-center justify-center text-sm"
        >
          <span className="text-[17px] font-semibold">{day.dayName}</span>
          <div className="space-x-1 text-sm font-normal">
            <span>{date.getDate()}</span>
            <span>
              {date.toLocaleString("en-US", {
                timeZone: clientTimezone,
                month: "short",
              })}
            </span>
          </div>
        </div>
      );
    }),
  ];

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
    const startOfWeek = moment(days[0].date);
    const endOfWeek = moment(days[days.length - 1].date);

    return [
      ...tasks.map((task) => ({ ...task, type: "task" as any })),
      ...appointments.map((appointment) => ({
        ...appointment,
        type: "appointment" as any,
      })),
    ]
      .filter((task) => {
        const taskDate = moment(task.date as any);
        return taskDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
      })
      .map((event) => {
        const taskDate = moment(event.date as any);
        const taskDayName = taskDate.format("dddd");
        const weekStartDayName = startOfWeek.format("dddd");
        const findTaskDayIndex = days.findIndex(
          (day) => day.dayName === taskDayName,
        );
        const findWeekStartDayIndex = days.findIndex(
          (day) => day.dayName === weekStartDayName,
        );
        const columnIndex = findTaskDayIndex - findWeekStartDayIndex;

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
  }, [tasks, appointments, week, days]);

  async function handleDrop(
    event: React.DragEvent,
    rowIndex: number,
    columnIndex: number,
    rowTime: string,
  ) {
    if (rowTime === "All Day" || columnIndex === 0) return;
    const startTime = formatTime(hourlyRows[rowIndex - 1]?.[0]);
    const endTime = formatTime(hourlyRows[rowIndex][0]);

    const findDate = days.find((day, index) => index === columnIndex - 1);
    const date = formatDate(new Date(findDate?.date!));
    // Get the task type
    const attributeData = event.dataTransfer.getData("text/plain").split("|");
    const type = attributeData[0];

    if (type === "tag") {
      const tag = event.dataTransfer.getData("text/plain").split("|")[1];

      // TODO: add tag to the task
    } else if (type === "task") {
      // Get the id of the task from the dataTransfer object
      const taskId = parseInt(attributeData[1]);
      // Find the task in your state
      const taskFoundWithoutTime = tasksWithoutTime.find(
        (task) => task.id == taskId,
      );
      const oldTask = tasks.find((task) => task.id === taskId);
      if (taskFoundWithoutTime) {
        // TODO: Add task to database
        await updateTask({
          id: taskFoundWithoutTime.id,
          date: date ? new Date(date) : new Date(),
          startTime: oldTask?.startTime || startTime,
          endTime: oldTask?.endTime || endTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } else {
        const { newStartTime, newEndTime } = updateTimeSpace(
          oldTask?.startTime as string,
          oldTask?.endTime as string,
          rowTime,
        );
        // TODO:
        await updateTask({
          id: oldTask?.id!,
          date: new Date(date),
          startTime: newStartTime,
          endTime: newEndTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    } else if (type === "appointment") {
      // Get the id of the appointment from the dataTransfer object
      const appointmentId = parseInt(attributeData[1]);
      // Find the appointment in your state
      const oldAppointment = appointments.find(
        (appointment) => appointment.id === appointmentId,
      );
      const { newStartTime, newEndTime } = updateTimeSpace(
        oldAppointment?.startTime as string,
        oldAppointment?.endTime as string,
        rowTime,
      );
      if (oldAppointment) {
        await assignAppointmentDate({
          id: oldAppointment.id,
          date,
          startTime: newStartTime,
          endTime: newEndTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    }
  }
  // event sorted by type
  const sortedEvents = events.slice().sort((a, b) => {
    const aRowStartIndex = a.rowStartIndex;
    const aRowEndIndex = a.rowEndIndex;
    const aBigIndex = aRowEndIndex - aRowStartIndex;
    const bRowStartIndex = b.rowStartIndex;
    const bRowEndIndex = b.rowEndIndex;
    const bBigIndex = bRowEndIndex - bRowStartIndex;
    if (a.type === "appointment" && b.type !== "appointment") {
      return -1;
    }
    if (a.type !== "appointment" && b.type === "appointment") {
      return 1;
    }
    if (a.type === "appointment" && b.type === "appointment") {
      return bBigIndex - aBigIndex;
    }

    return aBigIndex - bBigIndex;
  });
  return (
    <>
      <div
        className="relative mt-3 h-[90%] overflow-auto border-neutral-200"
        // style={{
        //   backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
        // }}
        ref={mergeRefs(dropRef, parentRef)}
      >
        {rows.map((row: any, rowIndex: number) => (
          <div
            className={cn(
              "relative flex h-[71px] justify-end border-neutral-200",
              rowIndex !== rows.length - 1 && "",
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
                "border-r border-neutral-200 h-full text-[#797979] flex justify-center items-center border-b ",
                cellWidth,
                fontSize,
                columnIndex === 0 &&
                  "border-0 absolute left-0 p-2 text-end -top-[35.5px] justify-end pr-3",
                columnIndex === 1 && "border-l",
                rowIndex === 0 && "border-t",
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
                  onDrop={(event: React.DragEvent) => {
                    handleDrop(event, rowIndex, columnIndex, row[0]);
                    setDraggedOverRow(null);
                  }}
                  onDragOver={(event: React.DragEvent) => {
                    event.preventDefault();
                    setDraggedOverRow({ r: rowIndex, c: columnIndex });
                  }}
                  onDragLeave={() => setDraggedOverRow(null)}
                  style={{
                    backgroundColor:
                      draggedOverRow?.r === rowIndex &&
                      draggedOverRow?.c === columnIndex
                        ? "rgba(0, 0, 0, 0.1)"
                        : "transparent",
                  }}
                >
                  {column}
                </button>
              );
            })}
          </div>
        ))}

        {events.map((event, index) => {
          // left according to the cell width
          let left = `calc(10% + 12.9% * ${event.columnIndex})`;
          let top = `${71 * event.rowStartIndex + 71}px`;
          // if the previous task starts at the same time as this task
          // then move this task down
          // if (
          //   index > 0 &&
          //   event.rowStartIndex === events[index - 1].rowStartIndex
          // ) {
          //   top = `${71 * event.rowStartIndex + 71}px`;
          // }
          // const height = `${
          //   71 * (event.rowEndIndex - event.rowStartIndex + 1)
          // }px`;
          // width according to the cell width
          let width = "22px"; // prev = 12.9%
          // @ts-ignore
          const backgroundColor = event.priority
            ? // @ts-ignore
              TASK_COLOR[event.priority]
            : "#FAF9F6";
          // Calculate how many tasks are in the same row
          //TODO:
          const eventStartTime = moment(event.startTime, "HH:mm");
          const eventEndTime = moment(event.endTime, "HH:mm");
          // sort by big indexes
          const tasksInRow = sortedEvents.filter((task) => {
            if (event.columnIndex === task.columnIndex) {
              const taskStartTime = moment(task.startTime, "HH:mm");
              const taskEndTime = moment(task.endTime, "HH:mm");
              if (
                event.rowStartIndex === task.rowStartIndex ||
                (eventStartTime.isBefore(taskEndTime) &&
                  eventEndTime.isAfter(taskStartTime))
              ) {
                return true;
              }
            }
          });
          const limitOfTasks = 5;
          const taskIndex = tasksInRow.findIndex((task) => {
            if (task.id === event.id && task.type === event.type) {
              return true;
            }
          });
          const diffByMinutes = eventEndTime.diff(eventStartTime, "minutes");
          const height = `${(diffByMinutes / 60) * 71}px`;
          if (taskIndex) {
            left = `calc(10% + 12.9% * ${event.columnIndex} + ${taskIndex * 2}%)`;
          }
          // if (tasksInRow.length > 2) {
          //   width = `${12.9 / tasksInRow.length}%`;
          // }
          // Define a function to truncate the task title based on the height
          const truncateTitle = (title: string, maxLength: number) => {
            return title.length > maxLength
              ? `${title.slice(0, maxLength)}...`
              : title;
          };
          // Define the maximum title length based on the height
          const maxTitleLength =
            height === "45px"
              ? 13
              : height === "90px"
                ? 30
                : event.title.length;
          if (taskIndex < limitOfTasks) {
            return (
              <Tooltip key={event.id}>
                <DraggableTaskTooltip
                  //@ts-ignore
                  className={`absolute top-0 rounded-lg border`}
                  style={{
                    left,
                    top,
                    height,
                    backgroundColor,
                    width,
                  }}
                  task={event}
                  updateTaskData={{ event, companyUsers }}
                  updateAppointmentData={{
                    appointment: appointmentsFull.find(
                      (appointment) => appointment.id === event.id,
                    ),
                    employees: companyUsers,
                    customers,
                    vehicles,
                    templates,
                    settings,
                  }}
                >
                  {
                    <>
                      {event.type === "appointment" && (
                        <div className="flex h-full flex-col items-start rounded-lg border border-gray-400">
                          <div className="absolute inset-y-1 right-0 h-[calc(100%-0.5rem)] w-1.5 rounded-lg border bg-[#6571FF]"></div>
                        </div>
                      )}
                    </>
                  }
                </DraggableTaskTooltip>
                <TooltipContent className="w-72 rounded-md border border-slate-400 bg-white p-3">
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
                        {event.client &&
                          `${event.client.firstName} ${event.client.lastName}`}
                      </p>

                      <p>
                        Assigned To:{" "}
                        {event.assignedUsers
                          .slice(0, 1)
                          .map(
                            (user: User) =>
                              `${user.firstName} ${user.lastName}`,
                          )}
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
          } else {
            const lastIndex = tasksInRow.length - 1;
            if (lastIndex !== taskIndex) return null;
            return (
              <Link
                href={`/task/day?date=${formatDate(new Date(event.date as Date))}`}
                className={cn(
                  `absolute top-0 flex items-center justify-center rounded-lg border`,
                  taskIndex === limitOfTasks && "bg-opacity-25",
                  lastIndex === taskIndex && "z-40",
                )}
                style={{
                  left: `calc(10% + 12.9% * ${event.columnIndex} + 160px)`,
                  top,
                  height,
                  backgroundColor: "rgb(0, 0, 255, 0.2)",
                  width,
                }}
                key={event.id}
              >
                <span className="z-30 text-center text-sm text-white">
                  {tasksInRow?.length - 5}+
                </span>
              </Link>
            );
          }
        })}
      </div>
    </>
  );
}
