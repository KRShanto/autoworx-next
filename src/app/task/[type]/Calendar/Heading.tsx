import { CalendarType } from "@/types/calendar";
import type { EmailTemplate } from "@prisma/client";
import { CalendarSettings, Client, User, Vehicle } from "@prisma/client";
import { sentenceCase } from "change-case";
import moment, { Moment } from "moment";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { NewAppointment } from "../components/appointment/NewAppointment";
import Settings from "../components/appointment/Settings";

const ALLOWED_ROLES_FOR_NEW_APPOINTMENT = ["Admin", "Manager", "Sales"];

function DisplayDate({ type }: { type: CalendarType }) {
  const searchParams = useSearchParams();
  const date = moment(searchParams.get(type === "day" ? "date" : type));
  return (date.isValid() ? date : moment()).format(
    /* If day is selected, then : Day, Month year */
    /* else: Month year */
    type === "day" ? "dddd, D MMMM YYYY" : "MMMM YYYY",
  );
}

function getNextValidDate(
  date: Moment,
  direction: number,
  weekend1: string,
  weekend2: string,
): Moment {
  let nextDate = moment(date);
  while (
    nextDate.format("dddd") === weekend1 ||
    nextDate.format("dddd") === weekend2
  ) {
    nextDate.add(direction, "days");
  }
  return nextDate;
}

export default function Heading({
  type,
  customers,
  vehicles,
  settings,
  employees,
  templates,
  user,
}: {
  type: CalendarType;
  customers: Client[];
  vehicles: Vehicle[];
  settings: CalendarSettings;
  employees: User[];
  templates: EmailTemplate[];
  user: User;
}) {
  const router = useRouter();
  const q = type === "day" ? "date" : type;
  const weekend1 = settings ? settings.weekend1 : null;
  const weekend2 = settings ? settings.weekend2 : null;

  return (
    <div className="flex items-center justify-between">
      {/* Month name */}
      <h2 className="ml-2 text-[26px] font-bold text-[#797979] max-[1300px]:text-[20px]">
        <Suspense>
          <DisplayDate type={type} />
        </Suspense>
      </h2>

      {/* Calendar options */}
      <div className="flex items-center gap-3">
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
            const validDate = getNextValidDate(
              date.subtract(1, `${type}s`),
              -1,
              weekend1 ? weekend1 : "",
              weekend2 ? weekend2 : "",
            );
            router.push(
              `/task/${type}?${q}=${(date.isValid() ? validDate : moment()).format(moment.HTML5_FMT[q.toUpperCase() as Uppercase<typeof q>])}`,
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
            const validDate = getNextValidDate(
              date.add(1, `${type}s`),
              1,
              weekend1 ? weekend1 : "",
              weekend2 ? weekend2 : "",
            );
            router.push(
              `/task/${type}?${q}=${(date.isValid() ? validDate : moment()).format(moment.HTML5_FMT[q.toUpperCase() as Uppercase<typeof q>])}`,
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
        {ALLOWED_ROLES_FOR_NEW_APPOINTMENT.includes(user.employeeType) && (
          <NewAppointment
            settings={settings}
            employees={employees}
            templates={templates}
          />
        )}

        <Settings settings={settings} />
      </div>
    </div>
  );
}
