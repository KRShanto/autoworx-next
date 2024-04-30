"use client";

import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "@/stores/popup";
import type { CalendarTask } from "@/types/db";
import type { Task, User } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { HiCalendar, HiClock } from "react-icons/hi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { useMediaQuery } from "react-responsive";
import { addTask } from "../../add";
import { deleteTask } from "../../delete";

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
  return date.isValid()? date : moment();
}

export default function Day({
  tasks,
  companyUsers,
  tasksWithoutTime,
}: {
  // tasks with assigned users
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
}) {
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const date = useDate();

  const { open } = usePopupStore();
  const is1300 = useMediaQuery({ query: "(max-width: 1300px)" });

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ["tag", "task"],
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

  const dayTasks = useMemo<
    (CalendarTask & {
      rowStartIndex: number;
      rowEndIndex: number;
    })[]
  >(
    () =>
      tasks
        .filter((task) => {
          // return today's tasks
          // also filter by month and year
          const taskDate = moment(task.date);
          return (
            taskDate.date() === date.date() &&
            taskDate.month() === date.month() &&
            taskDate.year() === date.year()
          );
        })
        .map((task) => {
          const taskStartTime = moment(task.startTime, "HH:mm").format("h A");
          const taskEndTime = moment(task.endTime, "HH:mm").format("h A");

          // Find the rowStartIndex and rowEndIndex by looping through the rows array
          const rowStartIndex = rows.findIndex((row) => row === taskStartTime);
          const rowEndIndex = rows.findIndex((row) => row === taskEndTime);

          // Return the task with the rowStartIndex and rowEndIndex
          return { ...task, rowStartIndex, rowEndIndex };
        }),
    [tasks, date],
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
    } else {
      // Get the id of the task from the dataTransfer object
      const taskId = parseInt(
        event.dataTransfer.getData("text/plain").split("|")[1],
      );

      // Find the task in your state
      const task = tasksWithoutTime.find((task) => task.id == taskId);

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
        ref={dropRef}
        style={{ backgroundColor: isOver ? "lightgreen" : "white" }}
        className="relative mt-3 h-[90%] overflow-auto border border-[#797979]"
      >
        {rows.map((row, i) => (
          <button
            key={i}
            onDrop={(event) => handleDrop(event, i)}
            onDragOver={(event) => event.preventDefault()}
            className={cn(
              "block h-[45px] w-full border-[#797979]",
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
                "flex h-full w-[100px] items-center justify-center border-r border-[#797979] text-[19px] text-[#797979]",
                i === 0 && "font-bold",
              )}
            >
              {row}
            </div>
          </button>
        ))}

        {/* Tasks */}
        {dayTasks.map((task, index) => {
          const left = "130px";
          let top = `${task.rowStartIndex * 45}px`;
          // if the previous task starts at the same time as this task
          // then move this task down
          if (
            index > 0 &&
            task.rowStartIndex === dayTasks[index - 1].rowStartIndex
          ) {
            top = `${task.rowStartIndex * 45 + 20}px`;
          }
          const height = `${
            (task.rowEndIndex - task.rowStartIndex + 1) * 45
          }px`;
          const width = is1300 ? "300px" : "500px";
          const backgroundColor = TASK_COLOR[task.type];

          // Define a function to truncate the task title based on the height
          const truncateTitle = (title: string, maxLength: number) => {
            return title.length > maxLength
              ? title.slice(0, maxLength) + "..."
              : title;
          };

          // Define the maximum title length based on the height
          const maxTitleLength =
            height === "45px"
              ? 60
              : height === "90px"
                ? 120
                : task.title.length;

          return (
            <div
              key={task.id}
              className="absolute top-0 z-10 rounded-lg border px-2 py-1 text-[17px] text-white"
              style={{
                left,
                top,
                height,
                backgroundColor,
                maxWidth: width,
                minWidth: width,
              }}
              onMouseEnter={() => setHoveredTask(index)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              {truncateTitle(task.title, maxTitleLength)}
            </div>
          );
        })}
      </div>

      {dayTasks.map((task, index) => {
        const rowIndex = task.rowStartIndex;
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
                    : 25;
        const height = 300;
        const left = "130px";
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
