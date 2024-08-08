import moment from "moment";

export type History = {
  dateClosed: string | null | Date;
  amount: string | null | number;
};

export function calculatePreviousMonthEarnings(histories: History[]) {
  // Get the start and end of the previous month
  const startOfPreviousMonth = moment().subtract(1, "months").startOf("month");
  const endOfPreviousMonth = moment().subtract(1, "months").endOf("month");

  // Filter the technicians who closed tasks in the previous month
  const previousMonthEarnings = histories.reduce((total, history) => {
    if (history.dateClosed) {
      const dateClosed = moment(history.dateClosed);
      if (
        dateClosed.isBetween(
          startOfPreviousMonth,
          endOfPreviousMonth,
          null,
          "[]",
        )
      ) {
        return total + Number(history.amount || 0);
      }
    }
    return total;
  }, 0);

  return previousMonthEarnings;
}

export function calculateCurrentMonthEarnings(histories: History[]) {
  // Get the start and end of the current month
  const startOfCurrentMonth = moment().startOf("month");
  const endOfCurrentMonth = moment().endOf("month");

  // Filter the technicians who closed tasks in the current month
  const currentMonthEarnings = histories.reduce((total, history) => {
    if (history.dateClosed) {
      const dateClosed = moment(history.dateClosed);
      if (
        dateClosed.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, "[]")
      ) {
        return total + Number(history.amount || 0);
      }
    }
    return total;
  }, 0);

  return currentMonthEarnings;
}

export function calculateTotalEarnings(histories: History[]) {
  // Filter the technicians who have closed tasks
  const totalEarnings = histories.reduce((total, history) => {
    if (history.dateClosed) {
      return total + Number(history.amount || 0);
    }
    return total;
  }, 0);

  return totalEarnings;
}
