"use client";

import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "../../../../stores/popup";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiCalendar, HiClock } from "react-icons/hi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { Task, User } from "@prisma/client";
import Image from "next/image";
import { deleteTask } from "../../delete";
import { useDrop } from "react-dnd";
import { addTask } from "../../add";
import { CalendarTask } from "@/types/db";

export default function Week({
  tasks,
  companyUsers,
  tasksWithoutTime,
}: {
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
}) {
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);

  const { open } = usePopupStore();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ["task", "tag"],
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

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteTask(id);
    setLoading(false);
  };

  // Get the current date
  const today = new Date();

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

  // Generate the hourly rows
  const hourlyRows = Array.from({ length: 24 }, (_, i) => [
    `${i + 1 > 12 ? i + 1 - 12 : i + 1} ${i + 1 >= 12 ? "PM" : "AM"}`,
    // empty cells
    ...Array.from({ length: 7 }, () => ""),
  ]);

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

  // Get the start and end of the current week
  const startOfWeek = moment().startOf("week").toDate();
  const endOfWeek = moment().endOf("week").toDate();

  // Filter out the tasks that are within the current week
  const [weekTasks, setWeekTasks] = useState<
    (CalendarTask & {
      rowStartIndex: number;
      rowEndIndex: number;
      columnIndex: number;
    })[]
  >([]);

  useEffect(() => {
    setWeekTasks(
      tasks
        .filter((task) => {
          const taskDate = new Date(task.date);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        })
        .map((task) => {
          const taskDate = new Date(task.date);
          const columnIndex = taskDate.getDay() - startOfWeek.getDay();

          // Convert the taskStartTime and taskEndTime to a format like "1 PM" or "11 AM"
          const taskStartTime = moment(task.startTime, "HH:mm").format("h A");
          const taskEndTime = moment(task.endTime, "HH:mm").format("h A");

          // Find the rowStartIndex and rowEndIndex by looping over the hourlyRows
          const rowStartIndex = hourlyRows.findIndex((row) =>
            row.includes(taskStartTime),
          );
          const rowEndIndex = hourlyRows.findIndex((row) =>
            row.includes(taskEndTime),
          );

          return { ...task, columnIndex, rowStartIndex, rowEndIndex };
        }),
    );
  }, [tasks]);

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

    console.log(type);

    if (type === "tag") {
      const tag = event.dataTransfer.getData("text/plain").split("|")[1];

      await addTask({ tag, date, startTime, endTime });
    } else {
      // Get the id of the task from the dataTransfer object
      const taskId = parseInt(
        event.dataTransfer.getData("text/plain").split("|")[1],
      );

      // Find the task in your state
      const task = tasksWithoutTime.find((task) => task.id === taskId);

      if (task) {
        // Add task to database
        await addTask({
          id: task.id,
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
        className="relative mt-3 h-[90%] overflow-auto border border-b border-l border-t border-[#797979]"
        style={{
          backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
        }}
        ref={dropRef}
      >
        {rows.map((row: any, rowIndex: number) => (
          <div
            className={cn(
              "flex h-[45px] overflow-hidden border-[#797979]",
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
                "border-r border-[#797979] h-full text-[#797979] flex justify-center items-center",
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

        {weekTasks.map((task, index) => {
          // left according to the cell width
          const left = `calc(10% + 12.9% * ${task.columnIndex})`;
          let top = `${45 * task.rowStartIndex + 45}px`;
          // if the previous task starts at the same time as this task
          // then move this task down
          if (
            index > 0 &&
            task.rowStartIndex === weekTasks[index - 1].rowStartIndex
          ) {
            top = `${45 * task.rowStartIndex + 45 + 20}px`;
          }
          const height = `${
            45 * (task.rowEndIndex - task.rowStartIndex + 1)
          }px`;
          // width according to the cell width
          const width = "12.9%";
          const backgroundColor = TASK_COLOR[task.type];

          // Define a function to truncate the task title based on the height
          const truncateTitle = (title: string, maxLength: number) => {
            return title.length > maxLength
              ? title.slice(0, maxLength) + "..."
              : title;
          };

          // TODO
          // Define the maximum title length based on the height
          const maxTitleLength =
            height === "45px" ? 13 : height === "90px" ? 30 : task.title.length;

          return (
            <div
              className="absolute top-0 rounded-lg border"
              style={{
                left,
                top,
                height,
                backgroundColor,
                width,
              }}
              key={index}
              onMouseEnter={() => setHoveredTask(index)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <p className="z-30 p-1 text-[17px] text-white max-[1600px]:text-[12px]">
                {truncateTitle(task.title, maxTitleLength)}
              </p>
            </div>
          );
        })}
      </div>

      {weekTasks.map((task, index) => {
        const rowIndex = task.rowStartIndex;
        const columnIndex = task.columnIndex;
        const MOVE_FROM_TOP =
          rowIndex === 0
            ? 260
            : rowIndex === 1
              ? 220
              : rowIndex === 2
                ? 180
                : rowIndex === 3
                  ? 140
                  : rowIndex === 4
                    ? 100
                    : 70;
        const MOVE_FROM_LEFT =
          columnIndex === 6
            ? 270
            : columnIndex === 5
              ? 150
              : columnIndex === 0
                ? 50
                : 120;
        const height = 300;
        // left according to the cell width
        const left = `calc(10% + 12.9% * ${task.columnIndex} - ${MOVE_FROM_LEFT}px)`;
        const top = `${
          45 * task.rowStartIndex + 45 - scrollPosition + MOVE_FROM_TOP - height
        }px`;

        return (
          <div
            className={cn(
              "absolute w-[400px] rounded-md border border-slate-400 bg-white p-3 transition-all duration-300",
            )}
            style={{
              left,
              top,
              height,
              opacity: hoveredTask === index ? 1 : 0,
              zIndex: hoveredTask === index ? 40 : -10,
            }}
            key={index}
            onMouseEnter={() => setHoveredTask(index)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <p className="text-[19px] font-bold text-slate-600">{task.title}</p>
            <hr />

            <div className="mt-2 flex items-center justify-between">
              <p className="flex items-center text-[17px] text-slate-600">
                <HiCalendar />
                {moment(task.date).format("MMM DD, YYYY")}
              </p>

              <p className="flex items-center text-[17px] text-slate-600">
                <HiClock />
                {moment(task.startTime, "HH:mm").format("hh:mm A")}
                <span className="mx-1">-</span>
                <HiClock />
                {moment(task.endTime, "HH:mm").format("hh:mm A")}
              </p>
            </div>

            {/* Options */}
            <div className="flex justify-end text-[14px]">
              <button
                className="mt-2 flex items-center rounded-md bg-[#24a0ff] px-2 py-1 text-white"
                onClick={() => {
                  setHoveredTask(null);
                  open("EDIT_TASK", { ...task, companyUsers });
                }}
              >
                <MdModeEdit />
                Edit
              </button>
              <button
                className="ml-2 mt-2 flex items-center rounded-md bg-[#ff4d4f] px-2 py-1 text-white"
                onClick={() => handleDelete(task.id)}
              >
                {loading ? (
                  <ThreeDots color="#fff" height={10} width={30} />
                ) : (
                  <>
                    <MdDelete />
                    Delete
                  </>
                )}
              </button>
            </div>

            {/* Show users */}
            <div className="mt-3 h-[10rem] overflow-auto">
              {task.assignedUsers.map((user) => {
                return (
                  <div
                    className="mt-2 flex items-center bg-[#F8F9FA] px-1 py-3"
                    key={user.id}
                  >
                    <Image
                      src={user.image}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p className="ml-2 text-[18px] font-bold text-slate-600">
                      {user.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
