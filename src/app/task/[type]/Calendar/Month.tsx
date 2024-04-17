"use client";

import { cn } from "@/lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "../../../../stores/popup";
import moment from "moment";
import { Task } from "@prisma/client";

export default function Month({ tasks }: { tasks: Task[] }) {
  const { open } = usePopupStore();

  // Initialize an array to hold the dates
  const dates: [Date, Task[] | undefined][] = [];
  // Define the total number of dates to be displayed
  const totalDates = 35;
  // Get the current date
  const today = new Date();

  // Get the index of today's date
  const todayIndex = today.getDate() - today.getDay() + 1;

  // Generate the dates before today
  for (let index = 0; index < todayIndex; index++) {
    // Calculate the date number
    const dateNumber = today.getDate() - index - 1;
    // Create a new date object
    const date = new Date(today.getFullYear(), today.getMonth(), dateNumber);
    const tasks = getTasks(date);
    // Add the date to the dates array
    dates.push([date, tasks]);
  }

  // Reverse the dates array to get the dates in ascending order
  dates.reverse();

  // Add today's date to the dates array
  dates.push([today, getTasks(today)]);

  // Calculate the number of dates to be generated after today
  const rest = totalDates - todayIndex - 1;

  // Generate the dates after today
  for (let index = 0; index < rest; index++) {
    // Calculate the date number
    const dateNumber = today.getDate() + index + 1;
    // Create a new date object
    const date = new Date(today.getFullYear(), today.getMonth(), dateNumber);
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

  return (
    <div className="mt-3 h-[90.8%] border-l border-t border-[#797979]">
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
              key={i}
              className={cn(
                "relative flex h-[100%] flex-col items-end gap-2 border-b border-r border-[#797979] p-2 text-[23px] font-bold max-[1300px]:text-[17px]",
                // check if the cell is today
                today === cell[0] ? "text-[#6571FF]" : "text-[#797979]",
              )}
              onClick={() => {
                open("ADD_TASK", {
                  date: moment(cell[0]).format("YYYY-MM-DD"),
                });
              }}
            >
              {cell[0].getDate()}

              <div className="absolute bottom-2 flex flex-wrap justify-end gap-4">
                {cell[1]?.map((task: Task, i: number) => (
                  <div
                    key={i}
                    className="h-[15px] w-[15px] rounded-full max-[1472px]:h-[12px] max-[1472px]:w-[12px]"
                    style={{
                      backgroundColor: TASK_COLOR[task.type],
                    }}
                  ></div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
