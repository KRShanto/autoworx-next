"use client";
import type {
  AppointmentFull,
  CalendarAppointment,
  CalendarTask,
} from "@/types/db";
import { formatTime, updateTimeSpace } from "@/utils/taskAndActivity";
import type {
  CalendarSettings,
  Client,
  EmailTemplate,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import mergeRefs from "merge-refs";
import moment, { Moment } from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { assignAppointmentDate } from "../../../../actions/appointment/assignAppointmentDate";
import { updateTask } from "../../../../actions/task/dragTask";
import DayRow from "../components/day/DayRow";
import DayTask from "../components/day/DayTask";

export function useDate() {
  const searchParams = useSearchParams();
  const date = moment.utc(searchParams.get("date"), moment.HTML5_FMT.DATE);
  return date.isValid() ? date : moment();
}

function doesTaskOrAppointmentEndNextDay(startTime: Moment, endTime: Moment) {
  // Parse the start and end times as moment objects with specific time format
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  // If the end time is before the start time, it means the appointment ends the next day
  return end.isBefore(start);
}

export default function Day({
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
  // tasks with assigned users
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
  const rows: string[] = [];

  rows.push(
    ...Array.from({ length: 24 }, (_, i) => {
      if (i === 0) {
        return "12 AM";
      } else if (i < 12) {
        return `${i} AM`; // 1 AM to 11 AM
      } else if (i === 12) {
        return "12 PM"; // Noon
      } else if (i < 24) {
        return `${i - 12} PM`; // 1 PM to 11 PM
      } else {
        return "12 AM"; // Midnight of the next day
      }
    }),
  );
  const date = useDate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [isRefAvailable, setIsRefAvailable] = useState<boolean>(false);
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ["tag", "task", "appointment"],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }) as [{ canDrop: boolean; isOver: boolean }, any];

  useEffect(() => {
    // This effect checks if the ref is available and updates isRefAvailable accordingly.
    const checkRefAvailability = () => {
      setIsRefAvailable(!!parentRef.current);
    };

    checkRefAvailability();
    // Optionally, listen to resize events or other events that might affect the ref's availability
    window.addEventListener("resize", checkRefAvailability);
    return () => window.removeEventListener("resize", checkRefAvailability);
  }, []);

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
        .filter((event: CalendarTask | CalendarAppointment) => {
          // return today's tasks
          // also filter by month and year
          const taskDate = moment.utc(event.date);

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

  // drop event handler
  async function handleDrop(event: React.DragEvent, rowIndex: number) {
    const startTime = formatTime(rows[rowIndex]);
    const endTime = formatTime(rows[rowIndex + 1]);

    // Get the task type
    const attributeData = event.dataTransfer.getData("text/plain").split("|");
    const type = attributeData[0];
    if (rows[rowIndex] === "All Day") return;

    if (type === "task") {
      // Get the id of the task from the dataTransfer object
      const taskId = parseInt(attributeData[1]);
      // Find the task in your state
      const taskFoundWithoutTime = tasksWithoutTime.find(
        (task) => task.id == taskId,
      );
      const oldTask = tasks.find((task) => task.id === taskId);
      if (taskFoundWithoutTime) {
        // Add task to database
        await updateTask({
          id: taskFoundWithoutTime.id,
          date: taskFoundWithoutTime?.date
            ? taskFoundWithoutTime.date
            : date.toDate(),
          startTime: oldTask?.startTime || startTime,
          endTime: oldTask?.endTime || endTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } else {
        const { newStartTime, newEndTime } = updateTimeSpace(
          oldTask?.startTime as string,
          oldTask?.endTime as string,
          rows[rowIndex],
        );
        if (oldTask) {
          await updateTask({
            id: oldTask.id,
            date: new Date(oldTask.date),
            startTime: newStartTime,
            endTime: newEndTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }
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
        rows[rowIndex],
      );
      if (oldAppointment) {
        await assignAppointmentDate({
          id: oldAppointment.id,
          date: oldAppointment.date as Date | string,
          startTime: newStartTime,
          endTime: newEndTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    }
  }

  //scrolling till settings.dayStart
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const scrollToStartTime = () => {
      if (containerRef.current) {
        const startTimeIndex = rows.findIndex((row) => {
          const rowTime = formatTime(row);
          return rowTime === settings?.dayStart;
        });

        if (startTimeIndex !== -1) {
          const scrollPosition = startTimeIndex * 75;
          containerRef.current.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    };

    scrollToStartTime();
  }, [rows, settings?.dayStart]);

  /**
   * Calculates the left CSS position for a task in a row.
   *
   * This function dynamically calculates and returns the CSS `calc()` value for the `left` property
   * of a task based on its index within a row and the total number of tasks in that row. It ensures
   * tasks are evenly distributed across the parent container, with an additional shift to the right.
   * If the parent container's width cannot be determined, it returns "0%" as a fallback.
   *
   * @param taskIndex - Index of the task in the row.
   * @param tasksInRowLength - Total number of tasks in the row.
   * @returns CSS `calc()` string for the left position or "0%" if parent width is unknown.
   */
  function calculateLeftPosition(taskIndex: number, tasksInRowLength: number) {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      const distributionPercentage = (90 / tasksInRowLength) * taskIndex;
      const shiftPercentage = (110 / parentWidth) * 100;
      return `calc(${distributionPercentage}% + ${shiftPercentage}%)`;
    }
    return "0%"; // Default fallback
  }

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
    <div
      ref={mergeRefs(dropRef, parentRef, containerRef)}
      className="relative mt-3 h-[90%] overflow-auto"
    >
      {rows.map((row, i) => (
        <DayRow
          key={i}
          row={row}
          rows={rows}
          companyUsers={companyUsers}
          index={i}
          settings={settings}
          onDrop={handleDrop}
        />
      ))}

      {/* Tasks */}
      {sortedEvents.map((event, index) => {
        const eventStartTime = moment(event.startTime, "HH:mm");
        const eventEndTime = moment(event.endTime, "HH:mm");

        const isEventEndNextDay = doesTaskOrAppointmentEndNextDay(
          eventStartTime,
          eventEndTime,
        );

        const dayEnd = moment("23:59", "HH:mm");

        const tasksInRow = sortedEvents.filter((task) => {
          const taskStartTime = moment(task.startTime, "HH:mm");
          const taskEndTime = moment(task.endTime, "HH:mm");
          const isTaskEndNextDay = doesTaskOrAppointmentEndNextDay(
            taskStartTime,
            taskEndTime,
          );
          if (
            event.rowStartIndex === task.rowStartIndex ||
            (eventStartTime.isBefore(taskEndTime) &&
              eventEndTime.isAfter(taskStartTime)) ||
            (isEventEndNextDay &&
              eventStartTime.isBefore(taskEndTime) &&
              dayEnd.isAfter(taskStartTime)) ||
            (isTaskEndNextDay &&
              eventStartTime.isBefore(dayEnd) &&
              eventEndTime.isAfter(taskStartTime))
          ) {
            return true;
          }
        });

        const taskIndex = tasksInRow.findIndex((task) => {
          if (task.id === event.id && task.type === event.type) {
            return true;
          }
        });

        return (
          <DayTask
            key={index}
            rowsLength={rows.length}
            totalTaskInRow={tasksInRow.length}
            calculateLeftPosition={calculateLeftPosition(
              taskIndex,
              tasksInRow.length,
            )}
            event={event}
            appointmentsFull={appointmentsFull}
            companyUsers={companyUsers}
            isRefAvailable={isRefAvailable}
            customers={customers}
            settings={settings}
            vehicles={vehicles}
            templates={templates}
          />
        );
      })}
    </div>
  );
}
