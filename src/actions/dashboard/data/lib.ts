import moment from "moment";

// Define date ranges for the current and previous months
export const currentMonthStart = moment().startOf("month").toDate();
export const currentMonthEnd = moment().endOf("month").toDate();
export const previousMonthStart = moment()
  .subtract(1, "months")
  .startOf("month")
  .toDate();
export const previousMonthEnd = moment()
  .subtract(1, "months")
  .endOf("month")
  .toDate();

export function growthRate(current: number, previous: number) {
  let rate;
  if (previous === 0) {
    rate = current > 0 ? 100 : 0;
  } else {
    rate = Math.round(((current - previous) / previous) * 100);
  }

  const isPositive = rate >= 0;

  return {
    rate,
    isPositive,
  };
}
