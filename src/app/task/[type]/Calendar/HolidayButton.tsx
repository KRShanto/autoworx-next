import { createHoliday } from "@/actions/task/createHoliday";
import getHoliday from "@/actions/task/getHoliday";
import { AuthSession } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import DatePicker, { DateObject, DatePickerRef } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import moment from "moment";
import getWeekendsOfMonth from "@/utils/getWeekendsOfMonth";
import { getCalenderSettings } from "@/actions/task/getCalendarSettings";
import { CalendarSettings } from "@prisma/client";

export default function HolidayButton() {
  const { data: session } = useSession();
  const datePickerRef = useRef<DatePickerRef>(null);
  const [values, setValues] = useState<DateObject[]>([]);

  const [weekends, setWeekends] = useState<DateObject[]>([]);

  const [loading, setLoading] = useState(false);

  const [pending, startTransition] = useTransition();

  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("MMMM"),
  );

  const [selectedYear, setSelectedYear] = useState<number>(moment().year());

  const authUser = session as AuthSession;

  const handleClose = () => {
    datePickerRef.current?.closeCalendar();
  };

  const companyId = authUser?.user?.companyId;

  // use  effect for find weekends this month
  // useEffect(() => {}, []);

  // date fetch for get all holidays by month and year
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      const holidays = await getHoliday(companyId, selectedMonth, selectedYear);

      setLoading(false);
      const dateObjectHoliday = holidays.map(
        (holiday) => new DateObject(holiday.date),
      );
      setValues(dateObjectHoliday);
    };
    fetchHolidays();
  }, [selectedMonth, selectedYear]);

  // data fetch for calender settings
  useEffect(() => {
    const fetchCalenderSettings = async () => {
      const calendarSettings = await getCalenderSettings(companyId);
      const weekendOne =
        calendarSettings &&
        getWeekendsOfMonth(
          calendarSettings?.weekend1,
          selectedMonth,
          selectedYear,
        );
      const weekendTwo =
        calendarSettings &&
        getWeekendsOfMonth(
          calendarSettings?.weekend2,
          selectedMonth,
          selectedYear,
        );

      const totalWeekends =
        weekendOne && weekendTwo && weekendOne.concat(weekendTwo);

      const dateObjectWeekends = totalWeekends
        ? totalWeekends.map((date) => new DateObject(date) as DateObject)
        : [];
      setValues((prevValues) => [...prevValues, ...dateObjectWeekends]);
      setWeekends(dateObjectWeekends);
    };
    fetchCalenderSettings();
  }, [selectedMonth, selectedYear]);

  //   const handleOpen = () => {
  //     datePickerRef.current?.openCalendar();
  //   };

  const handleAddHoliday = async () => {
    try {
      if (values.length > 0) {
        // Add holiday logic here
        const totalHolidays = values
          .filter((date) => {
            return !weekends.find(
              (weekend) =>
                weekend.format("YYYY-MM-DD") === date.format("YYYY-MM-DD"),
            );
          })
          .map((date) => {
            return {
              year: date.year,
              month: date.month.name,
              companyId: authUser.user.companyId,
              date: new Date(date.format("YYYY-MM-DD") as string).toISOString(),
            };
          });
        const response = await createHoliday(
          totalHolidays,
          selectedMonth,
          selectedYear,
        );
        if (response.status === 200) {
          handleClose();
          toast.success("Holiday set successfully");
          console.log(totalHolidays);
        }
      } else {
        toast.error("Please select at least one holiday date.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to set holiday. Please try again.");
    }
  };
  return (
    <div>
      <DatePicker
        ref={datePickerRef}
        multiple
        plugins={[<DatePanel className="!min-w-40 px-2" key={1} />]}
        format="MMMM DD YYYY"
        value={values}
        onChange={(dates) => setValues(dates)}
        onMonthChange={(date) => {
          setSelectedMonth(date.month.name);
          setSelectedYear(date.year);
        }}
        onClose={() => {
          setSelectedMonth("");
          setSelectedYear(moment().year());
        }}
        onOpen={() => {
          setSelectedMonth(moment().format("MMMM"));
          setSelectedYear(moment().year());
        }}
        render={
          <button className="app-shadow rounded-md bg-[#006D77] px-3 py-2 font-semibold text-white">
            Set Holiday
          </button>
        }
      >
        <div className="flex w-full items-center gap-x-3 border-t p-5">
          <button
            disabled={pending || loading}
            onClick={() => startTransition(handleAddHoliday)}
            className="rounded-md border px-3 py-1.5 disabled:bg-gray-300"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setValues([]);
            }}
          >
            Clear All
          </button>
          <button
            onClick={handleClose}
            className="rounded-md border bg-red-500 px-3 py-1.5 text-white"
          >
            Close
          </button>
        </div>
      </DatePicker>
    </div>
  );
}
