import { createHoliday } from "@/actions/task/createHoliday";
import getHoliday from "@/actions/task/getHoliday";
import { AuthSession } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import DatePicker, { DateObject, DatePickerRef } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import moment from "moment";

export default function HolidayButton() {
  const { data: session } = useSession();
  const datePickerRef = useRef<DatePickerRef>(null);
  const [values, setValues] = useState<DateObject[]>([]);

  const [loading, setLoading] = useState(false);

  const [pending, startTransition] = useTransition();

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [selectedYear, setSelectedYear] = useState<number>(0);

  const authUser = session as AuthSession;

  const handleClose = () => {
    datePickerRef.current?.closeCalendar();
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      const companyId = authUser?.user?.companyId;
      const holidays = await getHoliday(companyId, selectedMonth, selectedYear);
      setLoading(false);
      setValues(holidays.map((holiday) => new DateObject(holiday.date)));
    };
    fetchHolidays();
  }, [selectedMonth, selectedYear]);

  //   const handleOpen = () => {
  //     datePickerRef.current?.openCalendar();
  //   };

  const handleAddHoliday = async (fromMonthChange: boolean = false) => {
    try {
      const totalHolidays = values.map((date) => {
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
        // handleClose();
        !fromMonthChange && toast.success("Holiday set successfully");
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
          console.log("month change");
          handleAddHoliday(true);
          setSelectedMonth(date.month.name);
          setSelectedYear(date.year);
        }}
        onClose={() => {
          setSelectedMonth("");
          setSelectedYear(0);
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
            className="rounded-md border bg-green-100 px-3 py-1.5 disabled:bg-gray-300"
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
            className="rounded-md border bg-red-400 px-3 py-1.5 text-white"
          >
            Close
          </button>
        </div>
      </DatePicker>
    </div>
  );
}
