import moment from "moment";

// Define date ranges for the current and previous months
/**
 * Start date of the current month.
 */
export const currentMonthStart = moment().startOf("month").toDate();

/**
 * End date of the current month.
 */
export const currentMonthEnd = moment().endOf("month").toDate();

/**
 * Start date of the previous month.
 */
export const previousMonthStart = moment()
  .subtract(1, "months")
  .startOf("month")
  .toDate();

/**
 * End date of the previous month.
 */
export const previousMonthEnd = moment()
  .subtract(1, "months")
  .endOf("month")
  .toDate();

/**
 * Calculate the growth rate between the current and previous values.
 *
 * @param current - The current value.
 * @param previous - The previous value.
 * @returns An object containing the growth rate and a boolean indicating if the rate is positive.
 */
export function growthRate(current: number, previous: number) {
  let rate;
  if (previous === 0) {
    // If the previous value is 0, avoid division by zero
    rate = current > 0 ? 100 : 0;
  } else {
    // Calculate the growth rate as a percentage
    rate = Math.round(((current - previous) / previous) * 100);
  }

  // Determine if the growth rate is positive
  const isPositive = rate >= 0;

  return {
    rate,
    isPositive,
  };
}
