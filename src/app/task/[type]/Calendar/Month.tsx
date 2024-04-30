"use client";

import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
// import { usePopupStore } from "@/stores/popup";
import type { CalendarTask } from "@/types/db";
import type { Task } from "@prisma/client";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useDrop } from "react-dnd";
import { addTask } from "../../add";
import { useRouter } from "next/navigation";

function useMonth() {
  const searchParams = useSearchParams();
  const month = moment(searchParams.get("month"), moment.HTML5_FMT.MONTH);
  return (month.isValid() ? month : moment()).toDate();
}

export default function Month({
  tasks,
  tasksWithoutTime,
}: {
  tasks: CalendarTask[];
  tasksWithoutTime: Task[];
}) {
  const router = useRouter();

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

  // Initialize an array to hold the dates
  const dates: [Date, CalendarTask[] | undefined][] = [];
  // Define the total number of dates to be displayed
  const totalDates = 35;
  // Get the current date
  const month = useMonth();
  const today = moment().toDate();

  // Get the index of today's date
  const todayIndex = month.getDate() - month.getDay() + 1;

  // Generate the dates before today
  for (let index = 0; index < todayIndex; index++) {
    // Calculate the date number
    const dateNumber = month.getDate() - index - 1;
    // Create a new date object
    const date = new Date(month.getFullYear(), month.getMonth(), dateNumber);
    const tasks = getTasks(date);
    // Add the date to the dates array
    dates.push([date, tasks]);
  }

  // Reverse the dates array to get the dates in ascending order
  dates.reverse();

  // Add today's date to the dates array
  dates.push([month, getTasks(month)]);

  // Calculate the number of dates to be generated after today
  const rest = totalDates - todayIndex - 1;

  // Generate the dates after today
  for (let index = 0; index < rest; index++) {
    // Calculate the date number
    const dateNumber = month.getDate() + index + 1;
    // Create a new date object
    const date = new Date(month.getFullYear(), month.getMonth(), dateNumber);
    // Add the date to the dates array
    dates.push([date, getTasks(date)]);
  }

  function getTasks(date: Date) {
    return tasks.filter((task) => {
      // return new Date(task.date).getDate() === date.getDate();
      return (
        new Date(task.date).getFullYear() === date.getFullYear() &&
        new Date(task.date).getMonth() === date.getMonth() &&
        new Date(task.date).getDate() === date.getDate()
      );
    });
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
    <div
      className="mt-3 h-[90.8%] border-l border-t border-[#797979]"
      ref={dropRef}
    >
      <div className="grid h-full grid-cols-7">
        {cells.map((cell: any, i) => {
          if (i < 7)
            return (
              <div
                key={i}
                className="flex items-center justify-center border-b border-r border-[#797979] p-2  text-[17px] font-bold text-[#797979] max-[1300px]:text-[15px] max-[1150px]:text-[12px]"
              >
                {cell}
              </div>
            );

          return (
            <button
              type="button"
              key={i}
              className={cn(
                "relative flex h-[100%] flex-col items-end gap-2 border-b border-r border-[#797979] p-2 text-[23px] font-bold max-[1300px]:text-[17px]",
                // highlight today's date
                today == cell[0].getDate()
                  ? "text-[#6571FF]"
                  : "text-[#797979]",
              )}
              onClick={() => {
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
                {cell[1]?.slice(0, 3).map((task: CalendarTask, i: number) => (
                  <div
                    key={i}
                    className="h-4 max-h-[33.33%] rounded"
                    style={{
                      backgroundColor: TASK_COLOR[task.type],
                    }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
