import React from "react";
import PayoutCard from "./PayoutCard";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";
import moment from "moment";

function calculatePreviousMonthEarnings(technicians: EmployeeWorkInfo) {
  // Get the start and end of the previous month
  const startOfPreviousMonth = moment().subtract(1, "months").startOf("month");
  const endOfPreviousMonth = moment().subtract(1, "months").endOf("month");

  // Filter the technicians who closed tasks in the previous month
  const previousMonthEarnings = technicians.reduce((total, technician) => {
    if (technician.dateClosed) {
      const dateClosed = moment(technician.dateClosed);
      if (
        dateClosed.isBetween(
          startOfPreviousMonth,
          endOfPreviousMonth,
          null,
          "[]",
        )
      ) {
        return total + Number(technician.amount || 0);
      }
    }
    return total;
  }, 0);

  return previousMonthEarnings;
}

function calculateCurrentMonthEarnings(technicians: EmployeeWorkInfo) {
  // Get the start and end of the current month
  const startOfCurrentMonth = moment().startOf("month");
  const endOfCurrentMonth = moment().endOf("month");

  // Filter the technicians who closed tasks in the current month
  const currentMonthEarnings = technicians.reduce((total, technician) => {
    if (technician.dateClosed) {
      const dateClosed = moment(technician.dateClosed);
      if (
        dateClosed.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, "[]")
      ) {
        return total + Number(technician.amount || 0);
      }
    }
    return total;
  }, 0);

  return currentMonthEarnings;
}

function calculateTotalEarnings(technicians: EmployeeWorkInfo) {
  // Filter the technicians who have closed tasks
  const totalEarnings = technicians.reduce((total, technician) => {
    if (technician.dateClosed) {
      return total + Number(technician.amount || 0);
    }
    return total;
  }, 0);

  return totalEarnings;
}

export default function Payout({ info }: { info: EmployeeWorkInfo }) {
  // get how much money the employee has made last month
  const previousMonthEarnings = calculatePreviousMonthEarnings(info);
  const currentMonthEarnings = calculateCurrentMonthEarnings(info);
  const totalEarnings = calculateTotalEarnings(info);

  return (
    <div className="flex space-x-6">
      <PayoutCard
        title="Previous Month Payout"
        amount={previousMonthEarnings}
        percentage="100%"
      />
      <PayoutCard
        title="Current Month Payout"
        amount={currentMonthEarnings}
        percentage="90%"
      />
      <PayoutCard title="YTD Payout" amount={totalEarnings} percentage="85%" />
    </div>
  );
}
