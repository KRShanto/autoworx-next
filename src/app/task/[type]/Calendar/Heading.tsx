import Link from "next/link";
import { cn } from "../../../../lib/cn";
import moment from "moment";
import { CalendarType } from "@/types/calendar";
import { GoGear } from "react-icons/go";
import {
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowUp,
} from "react-icons/io";
import { NewAppointment } from "./NewAppointment";
import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import {
  Customer,
  Order,
  Vehicle,
  Setting,
  CalendarSettings,
  User,
} from "@prisma/client";
import Settings from "./Settings";

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
  return (
    <div className="flex items-center justify-between">
      {/* Month name */}
      <h2 className="ml-2 text-[26px] font-bold text-[#797979] max-[1300px]:text-[20px]">
        {/* If day is selected, then : Day, Month year */}
        {/* else: Month year */}
        {type === "day"
          ? moment().format("dddd, MMMM YYYY")
          : moment().format("MMMM YYYY")}
      </h2>

      {/* Calender options */}
      <div className="flex items-center gap-3 ">
        {/* Day selector */}
        <button className="app-shadow rounded-md p-2 text-[#797979]">
          Today
        </button>

        {/* Left Arrow */}
        <button className="app-shadow rounded-md p-2 text-[#797979]">
          <IoIosArrowBack />
        </button>

        {/* Right Arrow */}
        <button className="app-shadow rounded-md p-2 text-[#797979]">
          <IoIosArrowForward />
        </button>

        {/* Month selector */}
        <button className="app-shadow flex items-center gap-1 rounded-md p-2 text-[#797979]">
          Month <IoIosArrowDown />
        </button>

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
