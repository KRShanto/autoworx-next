import { CalendarType } from "@/types/calendar";
import {
  CalendarSettings,
  Customer,
  Order,
  User,
  Vehicle,
} from "@prisma/client";
import { sentenceCase } from "change-case";
import moment from "moment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { NewAppointment } from "./NewAppointment";
import Settings from "./Settings";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function DisplayDate({ type }: { type: CalendarType }) {
  const searchParams = useSearchParams();
  const date = moment(searchParams.get(type === "day" ? "date" : type));
  return (date.isValid() ? date : moment()).format(
    /* If day is selected, then : Day, Month year */
    /* else: Month year */
    type === "day" ? "dddd, D MMMM YYYY" : "MMMM YYYY",
  );
}

export default function Heading({
  type,
  customers,
  vehicles,
  orders,
  settings,
  employees,
}: {
  type: CalendarType;
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
  settings: CalendarSettings;
  employees: User[];
}) {
  const router = useRouter();
  const q = type === "day" ? "date" : type;

  return (
    <div className="flex items-center justify-between">
      {/* Month name */}
      <h2 className="ml-2 text-[26px] font-bold text-[#797979] max-[1300px]:text-[20px]">
        <Suspense>
          <DisplayDate type={type} />
        </Suspense>
      </h2>

      {/* Calender options */}
      <div className="flex items-center gap-3 ">
        {/* Highlight day's date in Month section */}
        <Link
          className="app-shadow rounded-md p-2 text-[#797979]"
          href="/task/month"
        >
          Today
        </Link>

        {/* Left Arrow */}
        <button
          type="button"
          className="app-shadow rounded-md p-2 text-[#797979]"
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search);
            const date = moment(searchParams.get(q));
            router.push(
              `/task/${type}?${q}=${(date.isValid() ? date : moment()).subtract(1, `${type}s`).format(moment.HTML5_FMT[q.toUpperCase() as Uppercase<typeof q>])}`,
            );
          }}
        >
          <IoIosArrowBack />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          className="app-shadow rounded-md p-2 text-[#797979]"
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search);
            const date = moment(searchParams.get(q));
            router.push(
              `/task/${type}?${q}=${(date.isValid() ? date : moment()).add(1, `${type}s`).format(moment.HTML5_FMT[q.toUpperCase() as Uppercase<typeof q>])}`,
            );
          }}
        >
          <IoIosArrowForward />
        </button>

        {/* Type selector */}
        <select
          className="app-shadow rounded-md bg-white p-2 text-[#797979]"
          value={type}
          onChange={(event) => router.push(event.currentTarget.value)}
        >
          {["day", "week", "month"].map((x) => (
            <option key={x} value={x}>
              {sentenceCase(x)}
            </option>
          ))}
        </select>

        {/* New Appointment button */}
        <NewAppointment
          customers={customers}
          vehicles={vehicles}
          orders={orders}
          settings={settings}
          employees={employees}
        />

        <Settings settings={settings} />
      </div>
    </div>
  );
}
