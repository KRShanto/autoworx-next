"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "@/stores/popup";
import type { CalendarAppointment, CalendarTask } from "@/types/db";
import type { Task, User } from "@prisma/client";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { FaPen } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";
import { addTask } from "../../add";
import { assignAppointmentDate } from "./assignAppointmentDate";
import { dragTask } from "./dragTask";

const rows = [
  "All Day",
  // 1am to 12pm
  ...Array.from(
    { length: 24 },
    (_, i) => `${i + 1 > 12 ? i + 1 - 12 : i + 1} ${i + 1 >= 12 ? "PM" : "AM"}`,
  ),
];

function useDate() {
  const searchParams = useSearchParams();
  const date = moment(searchParams.get("date"), moment.HTML5_FMT.DATE);
  return date.isValid() ? date : moment();
}

export default function Day({
  tasks,
  companyUsers,
  tasksWithoutTime,
  appointments,
}: {
  // tasks with assigned users
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  appointments: CalendarAppointment[];
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const date = useDate();

  const { open } = usePopupStore();
  const is1300 = useMediaQuery({ query: "(max-width: 1300px)" });

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ["tag", "task", "appointment"],
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
      setScrollPosition(dropRef.current.scrollTop);
    };

    dropRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      dropRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [dropRef]);

  const events = useMemo<
    ((
      | (CalendarTask & { type: "task" })
      | (CalendarAppointment & { type: "appointment" })
    ) & {
      rowStartIndex: number;
      rowEndIndex: number;
    })[]
  >(
    () =>
      [
        ...tasks.map((task) => ({ ...task, type: "task" as const })),
        ...appointments.map((appointment) => ({
          ...appointment,
          type: "appointment" as const,
        })),
      ]
        // include type before mapping
        .filter((event: CalendarTask | CalendarAppointment) => {
          // return today's tasks
          // also filter by month and year
          const taskDate = moment(event.date);
          return (
            taskDate.date() === date.date() &&
            taskDate.month() === date.month() &&
            taskDate.year() === date.year()
          );
        })
        .map((event) => {
          const taskStartTime = moment(event.startTime, "HH:mm").format("h A");
          const taskEndTime = moment(event.endTime, "HH:mm").format("h A");

          // Find the rowStartIndex and rowEndIndex by looping through the rows array
          const rowStartIndex = rows.findIndex((row) => row === taskStartTime);
          const rowEndIndex = rows.findIndex((row) => row === taskEndTime);

          // Return the task with the rowStartIndex and rowEndIndex
          return { ...event, rowStartIndex, rowEndIndex };
        }),
    [tasks, appointments, date],
  );

  function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
  }

  function formatTime(row: string) {
    const [hour, period] = row.split(" ");
    const time = `${hour.padStart(2, "0")}:00 ${period}`;
    return moment(time, "hh:mm A").format("HH:mm");
  }

  async function handleDrop(event: React.DragEvent, rowIndex: number) {
    const startTime = formatTime(rows[rowIndex]);
    const endTime = formatTime(rows[rowIndex + 1]);
    const date = new Date().toISOString();

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
      const task = tasksWithoutTime.find((task) => task.id == taskId);

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
      const appointmentId = Number.parseInt(
        event.dataTransfer.getData("text/plain").split("|")[1],
      );

      // Find the appointment in your state
      const appointment = appointments.find(
        (appointment) => appointment.id === appointmentId,
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
      ref={dropRef}
      style={{ backgroundColor: isOver ? "lightgreen" : "white" }}
      className="relative mt-3 h-[90%] overflow-auto border border-neutral-200"
    >
      {rows.map((row, i) => (
        <button
          type="button"
          key={row}
          onDrop={(event) => handleDrop(event, i)}
          onDragOver={(event) => event.preventDefault()}
          className={cn(
            "block h-[45px] w-full border-neutral-200",
            i !== rows.length - 1 && "border-b",
            i !== 0 && "cursor-pointer",
          )}
          onClick={() => {
            const date = formatDate(new Date());
            const startTime = formatTime(row);
            open("ADD_TASK", { date, startTime, companyUsers });
          }}
          disabled={i === 0}
        >
          {/* Row heading */}
          <div
            className={cn(
              "flex h-full w-[100px] items-center justify-center border-r border-neutral-200 text-[19px] text-[#797979]",
              i === 0 && "font-bold",
            )}
          >
            {row}
          </div>
        </button>
      ))}

      {/* Tasks */}
      {events.map((event, index) => {
        // TODO: fix overlapping tasks
        const top = `${event.rowStartIndex * 45}px`;
        let left = "130px";
        const height = `${
          (event.rowEndIndex - event.rowStartIndex + 1) * 45
        }px`;
        const widthNumber = is1300 ? 300 : 500;
        const width = `${widthNumber}px`;
        // @ts-ignore
        const backgroundColor = event.priority
          ? // @ts-ignore
            TASK_COLOR[event.priority]
          : "rgb(100, 116, 139)";
        // if the previous task ends at the same time as this task
        // then move this task right
        if (
          index > 0 &&
          event.rowStartIndex === events[index - 1].rowStartIndex
        ) {
          left = `${widthNumber + 130}px`;
        }
        // Define a function to truncate the task title based on the height
        const truncateTitle = (title: string, maxLength: number) => {
          return title.length > maxLength
            ? `${title.slice(0, maxLength)}...`
            : title;
        };

        // Define the maximum title length based on the height
        const maxTitleLength =
          height === "45px" ? 60 : height === "90px" ? 120 : event.title.length;

        return (
          <Tooltip key={event.id}>
            <TooltipTrigger
              className="absolute top-0 z-10 rounded-lg border px-2 py-1 text-[17px] text-white"
              style={{
                left,
                top,
                height,
                backgroundColor,
                maxWidth: width,
                minWidth: width,
              }}
            >
              {truncateTitle(event.title, maxTitleLength)}
            </TooltipTrigger>
            <TooltipContent className="h-48 w-72 rounded-md border border-slate-400 bg-white p-3">
              {event.type === "appointment" ? (
                <div>
                  <h3 className="font-semibold">{event.title}</h3>

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
  );
}
