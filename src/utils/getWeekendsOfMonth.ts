import moment from "moment";

const getDayNumber = (weekdayName: string) => {
  return moment().day(weekdayName).day();
};
export default function getWeekendsOfMonth(
  dayName: string,
  monthName: string | number,
  year: number,
) {
  const weekends = [];
  const currentMonth = moment()
    .month(monthName || "")
    .year(year);
  console.log(year, currentMonth.format("YYYY-MM-DD"));
  const date = moment(currentMonth).startOf("month");
  while (date.month() === currentMonth.month()) {
    if (date.day() === getDayNumber(dayName)) {
      weekends.push(date.format("YYYY-MM-DD"));
    }
    date.add(1, "day");
  }
  return weekends;
}
