"use server";

import { db } from "@/lib/db";
import { getCompany } from "../settings/getCompany";
import moment from "moment";

export async function getAttendanceInfo(id: number) {
  const company = await getCompany();

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

  const calendarSettings = await db.calendarSettings.findFirst({
    where: {
      companyId: company?.id,
    },
  });

  if (!user || !calendarSettings) {
    throw new Error("User or calendar settings not found");
  }

  const now = moment();
  const startOfWeek = moment().startOf("week");

  const attInfo = [];
  const standardWorkingHours = 8;

  for (let i = 0; i < 7; i++) {
    const currentDate = moment(startOfWeek).add(i, "days");

    // Display "-" if the day hasn't come yet
    if (currentDate.isAfter(now, "day")) {
      attInfo.push({
        date: currentDate.toDate(),
        clockedIn: "-",
        clockedOut: "-",
        hours: "-",
        extraHours: "-",
      });
      continue;
    }

    // Check if the user hasn't joined yet
    if (user.joinDate && currentDate.isBefore(moment(user.joinDate), "day")) {
      attInfo.push({
        date: currentDate.toDate(),
        clockedIn: "ABSENT",
        clockedOut: "ABSENT",
        hours: "ABSENT",
        extraHours: "ABSENT",
      });
      continue;
    }

    const dayOfWeek = currentDate.format("dddd").toLowerCase();
    const weekend1 = calendarSettings.weekend1.toLowerCase();
    const weekend2 = calendarSettings.weekend2.toLowerCase();

    // Check for weekend or holiday
    if (dayOfWeek === weekend1 || dayOfWeek === weekend2) {
      attInfo.push({
        date: currentDate.toDate(),
        clockedIn: "WEEKEND",
        clockedOut: "WEEKEND",
        hours: "WEEKEND",
        extraHours: "WEEKEND",
      });
      continue;
    }

    const leaveRequest = user.LeaveRequest.find(
      (leave) =>
        moment(leave.startDate).isSameOrBefore(currentDate, "day") &&
        moment(leave.endDate).isSameOrAfter(currentDate, "day") &&
        leave.status === "Approved",
    );

    if (leaveRequest) {
      attInfo.push({
        date: currentDate.toDate(),
        clockedIn: "LEAVE",
        clockedOut: "LEAVE",
        hours: "LEAVE",
        extraHours: "LEAVE",
      });
      continue;
    }

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
      attInfo.push({
        date: currentDate.toDate(),
        clockedIn: "ABSENT",
        clockedOut: "ABSENT",
        hours: "ABSENT",
        extraHours: "ABSENT",
      });
    }
  }

  // Calculate the no. of days absent
  const absentDays = attInfo.filter((day) => day.clockedIn === "ABSENT").length;

  // Calculate the total extra hours
  const totalExtraHours = attInfo
    .filter(
      (day) =>
        day.extraHours !== "ABSENT" &&
        day.extraHours !== "WEEKEND" &&
        day.extraHours !== "LEAVE" &&
        day.extraHours !== "-",
    )
    .reduce((total, day) => total + parseFloat(day.extraHours), 0)
    .toFixed(2);

  // TODO: @bettercallsundim - The weekend isn't working. Kindly fix it.
  return { attInfo, absentDays, totalExtraHours };
}
