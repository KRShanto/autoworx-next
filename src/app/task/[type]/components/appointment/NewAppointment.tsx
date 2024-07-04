"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { cn } from "@/lib/cn";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { usePopupStore } from "@/stores/popup";
import type {
  CalendarSettings,
  Customer,
  EmailTemplate,
  Order,
  User,
  Vehicle,
} from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { TbBell, TbCalendar } from "react-icons/tb";
import { addAppointment } from "../../actions/addAppointment";
import NewOrder from "./NewOrder";
import { Reminder } from "./Reminder";
import Selector from "./Selector";

enum Tab {
  Schedule = 0,
  Reminder = 1,
}

export function NewAppointment({
  customers,
  vehicles,
  orders,
  settings,
  employees,
  templates,
}: {
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
  settings: CalendarSettings;
  employees: User[];
  templates: EmailTemplate[];
}) {
  const { popup, open, close } = usePopupStore();
  const { showError } = useFormErrorStore();
  const setOpen = useCallback(
    (value: boolean) => {
      value ? open("ADD_TASK") : close();
    },
    [open, close],
  );
  const [tab, setTab] = useState(Tab.Schedule);

  const [date, setDate] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [orderList, setOrderList] = useState(orders);
  const [allDay, setAllDay] = useState(false);

  const [client, setClient] = useState<Customer | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  const [addSalesPersonOpen, setAddSalesPersonOpen] = useState(false);
  const [employeesToDisplay, setEmployeesToDisplay] =
    useState<User[]>(employees);

  const [times, setTimes] = useState<{ time: string; date: string }[]>([]);
  const [confirmationTemplate, setConfirmationTemplate] =
    useState<EmailTemplate | null>(null);
  const [reminderTemplate, setReminderTemplate] =
    useState<EmailTemplate | null>(null);
  const [confirmationTemplateStatus, setConfirmationTemplateStatus] =
    useState(true);
  const [reminderTemplateStatus, setReminderTemplateStatus] = useState(true);

  const handleSearch = (search: string) => {
    setEmployeesToDisplay(
      employees.filter((employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  };

  const handleDate = (operator: "+" | "-") => {
    const d = new Date();
    d.setDate(d.getDate() + (operator === "+" ? 1 : -1));
    setDate(d.toISOString().split("T")[0]);
  };

  // Change start and end time based on settings
  useEffect(() => {
    if (allDay && settings) {
      setStartTime(settings.dayStart);
      setEndTime(settings.dayEnd);
    }
  }, [allDay, settings]);

  useEffect(() => {
    if (templates) {
      useListsStore.setState({ templates });
    }
  }, [templates]);

  const handleSubmit = async (data: FormData) => {
    const title = data.get("title") as string;
    const notes = data.get("notes") as string;

    const res = await addAppointment({
      title,
      date,
      startTime,
      endTime,
      assignedUsers: assignedUsers.map((user) => user.id),
      customerId: client ? client.id : undefined,
      vehicleId: vehicle ? vehicle.id : undefined,
      orderId: order ? order.id : undefined,
      notes,
      confirmationEmailTemplateId: confirmationTemplate?.id,
      reminderEmailTemplateId: reminderTemplate?.id,
      confirmationEmailTemplateStatus: confirmationTemplateStatus,
      reminderEmailTemplateStatus: reminderTemplateStatus,
      times,
    });

    if (res.type === "error") {
      showError({
        field: res.field || "all",
        message: res.message || "",
      });
      return;
    }

    // reset all the fields
    setDate(undefined);
    setStartTime(undefined);
    setEndTime(undefined);
    setClient(null);
    setVehicle(null);
    setOrder(null);
    setAssignedUsers([]);
    setConfirmationTemplate(null);
    setReminderTemplate(null);
    setConfirmationTemplateStatus(true);
    setReminderTemplateStatus(true);
    setTimes([]);

    close();
  };

  return (
    <Dialog open={popup === "ADD_TASK"} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="app-shadow rounded-md bg-[#6571FF] p-2 text-xs text-white sm:text-sm"
        >
          New Appointment
        </button>
      </DialogTrigger>
      <DialogContent
        className="grid max-h-full max-w-5xl grid-rows-[auto,1fr,auto] sm:max-h-[80vh] sm:max-w-[60vw]"
        form
      >
        {/* Heading */}
        <DialogHeader className="grid items-center gap-4 sm:grid-cols-2">
          <DialogTitle>New Appointment</DialogTitle>

          {/* Options */}
          <div className="flex items-center justify-self-center rounded-full bg-primary p-1">
            <button
              type="button"
              className={cn(
                "rounded-full px-4 py-1 font-semibold",
                tab === Tab.Schedule && "bg-background",
              )}
              onClick={() => setTab(Tab.Schedule)}
            >
              <TbCalendar className="mr-2 inline" size={24} />
              Schedule
            </button>

            <button
              type="button"
              className={cn(
                "rounded-full px-4 py-1 font-semibold",
                tab === Tab.Reminder && "bg-background",
              )}
              onClick={() => setTab(Tab.Reminder)}
            >
              <TbBell className="mr-2 inline" size={24} />
              Reminder
            </button>
          </div>
        </DialogHeader>

        <div className="-mx-6 grid gap-px overflow-y-auto border-y border-solid bg-border sm:grid-cols-2">
          <div className="space-y-4 bg-background p-6">
            <FormError />

            <SlimInput name="title" label="Appointment Title" required />

            <div className="flex flex-wrap items-end gap-1">
              <SlimInput
                name="date"
                label="Time"
                rootClassName="grow"
                type="date"
                value={date ?? ""}
                required={false}
                onChange={(event) => setDate(event.currentTarget.value)}
              />
              <div className="flex grow items-center gap-1">
                <input
                  className={cn(slimInputClassName, "flex-auto")}
                  type="time"
                  name="start"
                  value={startTime}
                  max={endTime}
                  onChange={(event) => setStartTime(event.currentTarget.value)}
                />
                <FaArrowRight className="shrink-0" />
                <input
                  className={cn(slimInputClassName, "flex-auto")}
                  type="time"
                  name="end"
                  value={endTime}
                  min={startTime}
                  onChange={(event) => setEndTime(event.currentTarget.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                checked={allDay}
                onChange={() => setAllDay(!allDay)}
                id="all-day"
                type="checkbox"
                value="true"
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                name="all-day"
              />
              <label
                htmlFor="all-day"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                All day
              </label>
            </div>

            <button
              type="button"
              className="text-indigo-500"
              onClick={() => setAddSalesPersonOpen(true)}
            >
              + Assign sales person
            </button>

            {
              // Assigned users
              assignedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <Image
                    src={user.image}
                    alt="Employee Image"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <p>{user.name}</p>
                </div>
              ))
            }

            {addSalesPersonOpen && (
              <div className="w-[200px] space-y-4 rounded-lg border-2 border-slate-400">
                {/* Search */}
                <div className="relative mx-auto my-3 h-[35px] w-[90%] rounded-lg border-2 border-slate-400">
                  <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-slate-400" />
                  <input
                    name="search"
                    className="h-full w-[85%] rounded-lg pl-7 pr-2 focus:outline-none"
                    type="text"
                    placeholder="Search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <FaTimes
                    className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-slate-400"
                    onClick={() => setAddSalesPersonOpen(false)}
                  />
                </div>

                {employeesToDisplay
                  .filter((employee) => !assignedUsers.includes(employee))
                  .map((employee) => (
                    <button
                      key={employee.id}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
                      onClick={() => {
                        setAssignedUsers([...assignedUsers, employee]);
                        setAddSalesPersonOpen(false);
                      }}
                      type="button"
                    >
                      <Image
                        src={employee.image}
                        alt="Employee Image"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <p className="font-medium">{employee.name}</p>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="row-start-2 space-y-4 bg-background p-6">
            <SelectClient value={client} setValue={setClient} />

            <SelectVehicle value={vehicle} setValue={setVehicle} />

            <Selector
              label={order ? order.name : "Order"}
              newButton={<NewOrder setOrders={setOrderList} />}
            >
              <div className="">
                {orderList.map((order) => (
                  <button
                    type="button"
                    key={order.id}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
                    onClick={() => setOrder(order)}
                  >
                    <div>
                      <p className="text-sm font-bold">{order.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Selector>

            <textarea
              name="notes"
              placeholder="Notes"
              className={cn(slimInputClassName, "border-2 border-slate-400")}
              rows={3}
            />
          </div>

          <div className="relative row-span-2 min-h-36 divide-y bg-background">
            {tab === Tab.Schedule ? (
              <div className="absolute inset-0 divide-y overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center gap-4 bg-background px-8 py-2">
                  <button type="button" onClick={() => handleDate("-")}>
                    <FaChevronLeft />
                  </button>
                  <div className="mx-auto text-center text-primary-foreground">
                    {moment(date).format("dddd, MMMM YYYY")}
                  </div>
                  <button type="button" onClick={() => handleDate("+")}>
                    <FaChevronRight />
                  </button>
                </div>

                <div className="relative divide-y">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="ml-16 flex h-16 items-start border-l border-solid"
                    >
                      {!!i && (
                        <div className="-ml-2 w-full -translate-x-full -translate-y-1/2 text-end text-gray-600">
                          {i % 12 || 12} {i < 12 ? "A" : "P"}M
                        </div>
                      )}
                    </div>
                  ))}
                  {startTime && endTime && (
                    <div
                      className="absolute left-16 right-0 rounded border border-solid border-indigo-500 bg-indigo-500/30"
                      style={{
                        top: `${getHours(startTime) * 4}rem`,
                        bottom: `${(24 - getHours(endTime)) * 4}rem`,
                      }}
                    />
                  )}
                </div>
              </div>
            ) : tab === Tab.Reminder ? (
              <Reminder
                client={client}
                // @ts-ignore
                vehicle={vehicle}
                endTime={endTime!}
                date={date!}
                times={times}
                setTimes={setTimes}
                confirmationTemplate={confirmationTemplate}
                setConfirmationTemplate={setConfirmationTemplate}
                reminderTemplate={reminderTemplate}
                setReminderTemplate={setReminderTemplate}
                confirmationTemplateStatus={confirmationTemplateStatus}
                setConfirmationTemplateStatus={setConfirmationTemplateStatus}
                reminderTemplateStatus={reminderTemplateStatus}
                setReminderTemplateStatus={setReminderTemplateStatus}
              />
            ) : null}
          </div>
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <button type="button" className="rounded-md border px-4 py-1">
              Cancel
            </button>
          </DialogClose>
          <Submit
            className="rounded-md border bg-[#6571FF] px-4 py-1 text-white"
            formAction={handleSubmit}
          >
            Save
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getHours(time: string) {
  if (!time) return 0;
  const [h, m] = time.split(":").map((x) => +x);
  return h + m / 60;
}
