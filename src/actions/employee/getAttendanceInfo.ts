"use server";

import { db } from "@/lib/db";
import moment, { Moment } from "moment";
import { getCompany } from "../settings/getCompany";

interface AttendanceRecord {
  date: Date;
  clockedIn: string;
  clockedOut: string;
  hours: string;
  extraHours: string;
}

interface GrowthRate {
  rate: string;
  isPositive: boolean | null;
}

interface AttendanceInfo {
  attInfo: AttendanceRecord[];
  absentDays: number;
  totalExtraHours: string;
  totalHoursWorked: string;
  totalDaysWorked: number;
  previousAbsentDays: number;
  previousTotalExtraHours: string;
  previousTotalHoursWorked: string;
  previousTotalDaysWorked: number;
  growthRateAbsentDays: GrowthRate;
  growthRateTotalExtraHours: GrowthRate;
  growthRateTotalHoursWorked: GrowthRate;
  growthRateTotalDaysWorked: GrowthRate;
  totalTardiness: string;
  previousTotalTardiness: string;
  growthRateTotalTardiness: GrowthRate;
  noShowRate: string; // Add this field
  previousNoShowRate: string; // Add this field
  growthRateNoShowRate: GrowthRate; // Add this field
}

/**
 * Get attendance information for a user.
 *
 * @param id - The ID of the user.
 * @returns An object containing various attendance metrics.
 */
export async function getAttendanceInfo(id: number): Promise<AttendanceInfo> {
  // Fetch company information
  const company = await getCompany();

  // Fetch user information along with related data
  const user = await db.user.findUnique({
    where: { id },
    include: {
      Technician: {
        include: {
          invoice: {
            include: {
              client: true,
              vehicle: true,
            },
          },
        },
      },
      ClockInOut: {
        include: {
          ClockBreak: true,
        },
      },
      LeaveRequest: true,
    },
  });

  // Fetch calendar settings for the company
  const calendarSettings = await db.calendarSettings.findFirst({
    where: {
      companyId: company?.id,
    },
  });

  // Throw an error if user or calendar settings are not found
  if (!user || !calendarSettings) {
    throw new Error("User or calendar settings not found");
  }

  const now = moment(); // Current date and time
  const standardWorkingHours = 8; // Standard working hours per day

  /**
   * Helper function to get attendance info for a given date range
   *
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns An array of attendance records for the given date range.
   */
  const getAttendanceInfoForRange = async (
    startDate: Moment,
    endDate: Moment,
  ): Promise<AttendanceRecord[]> => {
    const attInfo: AttendanceRecord[] = [];
    for (
      let date = startDate;
      date.isSameOrBefore(endDate, "day");
      date.add(1, "day")
    ) {
      const currentDate = moment(date);
      const dayOfWeek = currentDate.format("dddd").toLowerCase();
      const weekend1 = calendarSettings.weekend1.toLowerCase();
      const weekend2 = calendarSettings.weekend2.toLowerCase();

      // Fetch holiday for the current date
      const holiday = await db.holiday.findFirst({
        where: {
          date: {
            equals: new Date(currentDate.format("YYYY-MM-DD")),
          },
          companyId: company?.id,
        },
      });

      // Check if the current day is a weekend
      if (dayOfWeek === weekend1 || dayOfWeek === weekend2) {
        attInfo.push(createAttendanceRecord(currentDate, "WEEKEND"));
        continue;
      }

      // Check if the current day is a holiday
      if (holiday) {
        attInfo.push(createAttendanceRecord(currentDate, "HOLIDAY"));
        continue;
      }

      // Display "-" if the day hasn't come yet
      if (currentDate.isAfter(now, "day")) {
        attInfo.push(createAttendanceRecord(currentDate, "-"));
        continue;
      }

      // Check if the user hasn't joined yet
      if (user.joinDate && currentDate.isBefore(moment(user.joinDate), "day")) {
        attInfo.push(createAttendanceRecord(currentDate, "ABSENT"));
        continue;
      }

      // Check if the user is on leave
      const leaveRequest = user.LeaveRequest.find(
        (leave) =>
          moment(leave.startDate).isSameOrBefore(currentDate, "day") &&
          moment(leave.endDate).isSameOrAfter(currentDate, "day") &&
          leave.status === "Approved",
      );

      if (leaveRequest) {
        attInfo.push(createAttendanceRecord(currentDate, "LEAVE"));
        continue;
      }

      // Check if the user has clocked in and out on the current date
      const clockInOut = user.ClockInOut.find((clock) =>
        moment(clock.clockIn).isSame(currentDate, "day"),
      );

      if (clockInOut) {
        const clockedIn = moment(clockInOut.clockIn).format("hh:mm A");
        const clockedOut = clockInOut.clockOut
          ? moment(clockInOut.clockOut).format("hh:mm A")
          : "N/A";
        const totalHours = clockInOut.clockOut
          ? moment
              .duration(
                moment(clockInOut.clockOut).diff(moment(clockInOut.clockIn)),
              )
              .asHours()
              .toFixed(2)
          : "N/A";
        const extraHours =
          totalHours !== "N/A" && parseFloat(totalHours) > standardWorkingHours
            ? (parseFloat(totalHours) - standardWorkingHours).toFixed(2)
            : "0";

        attInfo.push({
          date: currentDate.toDate(),
          clockedIn,
          clockedOut,
          hours: totalHours,
          extraHours,
        });
      } else {
        attInfo.push(createAttendanceRecord(currentDate, "ABSENT"));
      }
    }
    return attInfo;
  };

  /**
   * Helper function to create an attendance record
   *
   * @param date - The date of the attendance record.
   * @param status - The status of the attendance record.
   * @returns An attendance record object.
   */
  const createAttendanceRecord = (
    date: Moment,
    status: string,
  ): AttendanceRecord => ({
    date: date.toDate(),
    clockedIn: status,
    clockedOut: status,
    hours: status,
    extraHours: status,
  });

  // Get weekly attendance information
  const startOfWeek = moment().startOf("week");
  const endOfWeek = moment().endOf("week");
  const attInfo = await getAttendanceInfoForRange(startOfWeek, endOfWeek);

  // Get current monthly attendance information
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().endOf("month");
  const attInfoMonth = await getAttendanceInfoForRange(
    startOfMonth,
    endOfMonth,
  );

  // Get previous monthly attendance information
  const startOfPrevMonth = moment().subtract(1, "month").startOf("month");
  const endOfPrevMonth = moment().subtract(1, "month").endOf("month");
  const attInfoPrevMonth = await getAttendanceInfoForRange(
    startOfPrevMonth,
    endOfPrevMonth,
  );

  // Calculate the number of days absent
  const absentDays = attInfoMonth.filter(
    (day) => day.clockedIn === "ABSENT",
  ).length;
  const previousAbsentDays = attInfoPrevMonth.filter(
    (day) => day.clockedIn === "ABSENT",
  ).length;

  // Calculate the total extra hours for the month
  const totalExtraHours = attInfoMonth
    .filter(
      (day) =>
        day.extraHours !== "ABSENT" &&
        day.extraHours !== "WEEKEND" &&
        day.extraHours !== "LEAVE" &&
        day.extraHours !== "-",
    )
    .reduce((total, day) => total + parseFloat(day.extraHours), 0)
    .toFixed(2);
  const previousTotalExtraHours = attInfoPrevMonth
    .filter(
      (day) =>
        day.extraHours !== "ABSENT" &&
        day.extraHours !== "WEEKEND" &&
        day.extraHours !== "LEAVE" &&
        day.extraHours !== "-",
    )
    .reduce((total, day) => total + parseFloat(day.extraHours), 0)
    .toFixed(2);

  // Calculate the total hours worked for the month
  const totalHoursWorked = attInfoMonth
    .filter(
      (day) =>
        day.hours !== "ABSENT" &&
        day.hours !== "WEEKEND" &&
        day.hours !== "LEAVE" &&
        day.hours !== "-",
    )
    .reduce((total, day) => total + parseFloat(day.hours), 0)
    .toFixed(2);
  const previousTotalHoursWorked = attInfoPrevMonth
    .filter(
      (day) =>
        day.hours !== "ABSENT" &&
        day.hours !== "WEEKEND" &&
        day.hours !== "LEAVE" &&
        day.hours !== "-",
    )
    .reduce((total, day) => total + parseFloat(day.hours), 0)
    .toFixed(2);

  // Calculate the total days worked for the month
  const totalDaysWorked = attInfoMonth.filter(
    (day) =>
      day.hours !== "ABSENT" &&
      day.hours !== "WEEKEND" &&
      day.hours !== "LEAVE" &&
      day.hours !== "-",
  ).length;
  const previousTotalDaysWorked = attInfoPrevMonth.filter(
    (day) =>
      day.hours !== "ABSENT" &&
      day.hours !== "WEEKEND" &&
      day.hours !== "LEAVE" &&
      day.hours !== "-",
  ).length;

  /**
   * Helper function to calculate growth rates
   *
   * @param current - The current value.
   * @param previous - The previous value.
   * @returns An object containing the growth rate and whether it is positive.
   */
  const calculateGrowthRate = (
    current: number,
    previous: number,
  ): GrowthRate => {
    if (previous === 0) return { rate: "N/A", isPositive: null };
    const growth = ((current - previous) / previous) * 100;
    return {
      rate: growth.toFixed(2) + "%",
      isPositive: growth >= 0,
    };
  };

  // Update the growth rate calculations
  const growthRateAbsentDays = calculateGrowthRate(
    absentDays,
    previousAbsentDays,
  );
  const growthRateTotalExtraHours = calculateGrowthRate(
    parseFloat(totalExtraHours),
    parseFloat(previousTotalExtraHours),
  );
  const growthRateTotalHoursWorked = calculateGrowthRate(
    parseFloat(totalHoursWorked),
    parseFloat(previousTotalHoursWorked),
  );
  const growthRateTotalDaysWorked = calculateGrowthRate(
    totalDaysWorked,
    previousTotalDaysWorked,
  );

  // Calculate total tardiness for the current month
  const totalTardiness = (
    user.Technician.reduce((total, technician) => {
      if (technician.dateClosed && technician.due) {
        const dateClosed = moment(technician.dateClosed);
        const due = moment(technician.due);
        if (
          dateClosed.isSameOrAfter(startOfMonth) &&
          dateClosed.isSameOrBefore(endOfMonth)
        ) {
          const tardiness = dateClosed.diff(due, "minutes");
          return total + tardiness;
        }
      }
      return total;
    }, 0) / 60
  ).toFixed(2);

  // Calculate total tardiness for the previous month
  const previousTotalTardiness = (
    user.Technician.reduce((total, technician) => {
      if (technician.dateClosed && technician.due) {
        const dateClosed = moment(technician.dateClosed);
        const due = moment(technician.due);
        if (
          dateClosed.isSameOrAfter(startOfPrevMonth) &&
          dateClosed.isSameOrBefore(endOfPrevMonth)
        ) {
          const tardiness = dateClosed.diff(due, "minutes");
          return total + tardiness;
        }
      }
      return total;
    }, 0) / 60
  ).toFixed(2);

  // Calculate growth rate for tardiness
  const growthRateTotalTardiness = calculateGrowthRate(
    parseFloat(totalTardiness),
    parseFloat(previousTotalTardiness),
  );

  // Calculate total hours absent for the current month
  const totalHoursAbsent = attInfoMonth
    .filter((day) => day.clockedIn === "ABSENT")
    .reduce((total, day) => total + standardWorkingHours, 0);

  // Calculate total hours absent for the previous month
  const previousTotalHoursAbsent = attInfoPrevMonth
    .filter((day) => day.clockedIn === "ABSENT")
    .reduce((total, day) => total + standardWorkingHours, 0);

  // Calculate "No Show" rate for the current month
  const noShowRate =
    parseFloat(totalHoursWorked) > 0
      ? ((totalHoursAbsent / parseFloat(totalHoursWorked)) * 100).toFixed(2)
      : "0.00";

  // Calculate "No Show" rate for the previous month
  const previousNoShowRate =
    parseFloat(previousTotalHoursWorked) > 0
      ? (
          (previousTotalHoursAbsent / parseFloat(previousTotalHoursWorked)) *
          100
        ).toFixed(2)
      : "0.00";

  // Calculate growth rate for "No Show" rate
  const growthRateNoShowRate = calculateGrowthRate(
    parseFloat(noShowRate),
    parseFloat(previousNoShowRate),
  );

  console.log("Growths: ", {
    growthRateAbsentDays,
    growthRateTotalExtraHours,
    growthRateTotalHoursWorked,
    growthRateTotalDaysWorked,
    growthRateTotalTardiness,
    growthRateNoShowRate,
  });

  return {
    attInfo,
    absentDays,
    totalExtraHours,
    totalHoursWorked,
    totalDaysWorked,
    previousAbsentDays,
    previousTotalExtraHours,
    previousTotalHoursWorked,
    previousTotalDaysWorked,
    growthRateAbsentDays,
    growthRateTotalExtraHours,
    growthRateTotalHoursWorked,
    growthRateTotalDaysWorked,
    totalTardiness,
    previousTotalTardiness,
    growthRateTotalTardiness,
    noShowRate, // Include this in the return object
    previousNoShowRate, // Include this in the return object
    growthRateNoShowRate, // Include this in the return object
  };
}
