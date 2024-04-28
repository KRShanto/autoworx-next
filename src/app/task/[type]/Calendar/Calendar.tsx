import { CalendarType } from "@/types/calendar";
import Body from "./Body";
import Heading from "./Heading";
import {
  CalendarSettings,
  Customer,
  Order,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import { CalendarTask } from "@/types/db";

export default function Calender({
  type,
  tasks,
  companyUsers,
  tasksWithoutTime,
  customers,
  vehicles,
  orders,
  settings,
}: {
  type: CalendarType;
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
  settings: CalendarSettings;
}) {
  console.log("Task from calendar: ", tasks);
  return (
    <div className="app-shadow relative ml-5 mt-4 h-[98%] w-[80%] overflow-hidden rounded-[18px] bg-white p-4">
      <Heading
        type={type as any}
        customers={customers}
        vehicles={vehicles}
        orders={orders}
        settings={settings}
      />
      <Body
        type={type as any}
        tasks={tasks}
        companyUsers={companyUsers}
        tasksWithoutTime={tasksWithoutTime}
      />
    </div>
  );
}
