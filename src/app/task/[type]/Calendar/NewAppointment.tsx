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
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import { cn } from "@/lib/cn";
import { usePopupStore } from "@/stores/popup";
import type {
  CalendarSettings,
  Customer,
  Order,
  Vehicle,
} from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TbBell, TbCalendar } from "react-icons/tb";
import NewCustomer from "./NewCustomer";
import Selector from "./Selector";
import Submit from "@/components/Submit";
import NewOrder from "./NewOrder";
import NewVehicle from "./NewVehicle";
import { addTask } from "@/app/task/add";
import { useFormErrorStore } from "@/stores/form-error";
import { addAppointment } from "./addAppointment";
import moment from "moment";

export function NewAppointment({
  customers,
  vehicles,
  orders,
  settings,
}: {
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
  settings: CalendarSettings;
}) {
  const { popup, open, close } = usePopupStore();
  const { showError } = useFormErrorStore();
  const setOpen = useCallback(
    (value: boolean) => {
      value ? open("ADD_TASK") : close();
    },
    [open, close],
  );

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [clientList, setClientList] = useState(customers);
  const [vehicleList, setVehicleList] = useState(vehicles);
  const [orderList, setOrderList] = useState(orders);
  const [allDay, setAllDay] = useState(false);

  const [client, setClient] = useState<Customer | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleDate = (operator: "+" | "-") => {
    const d = new Date(date);
    d.setDate(d.getDate() + (operator === "+" ? 1 : -1));
    setDate(d.toISOString().split("T")[0]);
  };

  // Change start and end time based on settings
  useEffect(() => {
    if (allDay) {
      setStartTime(settings.dayStart);
      setEndTime(settings.dayEnd);
    }
  }, [allDay]);

  const handleSubmit = async (data: FormData) => {
    const title = data.get("title") as string;
    const notes = data.get("notes") as string;

    const res = await addAppointment({
      title,
      date,
      startTime,
      endTime,
      type: "appointment",
      assignedUsers: [],
      clientId: client ? client.id : undefined,
      vehicleId: vehicle ? vehicle.id : undefined,
      orderId: order ? order.id : undefined,
      notes,
    });

    close();
  };

  return (
    <Dialog open={popup === "ADD_TASK"} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="app-shadow rounded-md bg-[#6571FF] p-2 text-white"
        >
          New Appointment
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-h-full max-w-4xl grid-rows-[auto,1fr,auto]"
        form
      >
        {/* Heading */}
        <DialogHeader>
          <div className="grid grid-cols-2 items-center">
            <DialogTitle>New Appointment</DialogTitle>

            {/* Options */}
            <div className="flex items-center justify-self-center rounded-full bg-primary p-1">
              <button
                type="button"
                className="rounded-full bg-background px-4 py-1 font-semibold"
              >
                <TbCalendar className="mr-2 inline" size={24} />
                Schedule
              </button>

              <button
                type="button"
                className="rounded-full px-4 py-1 font-semibold"
              >
                <TbBell className="mr-2 inline" size={24} />
                Reminder
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="-mx-6 grid grid-cols-2 gap-px overflow-y-auto border-y border-solid bg-border">
          <div className="space-y-4 bg-background p-6">
            <FormError />

            <SlimInput name="title" label="Appointment Title" required />

            <div className="flex items-end gap-1">
              <SlimInput
                name="date"
                label="Time"
                className="grow"
                type="date"
                value={date}
                onChange={(event) => setDate(event.currentTarget.value)}
              />
              <div className="flex grow items-center gap-1">
                <input
                  className={cn(slimInputClassName, "grow")}
                  type="time"
                  name="start"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.currentTarget.value)}
                />
                <FaArrowRight className="shrink-0" />
                <input
                  className={cn(slimInputClassName, "grow")}
                  type="time"
                  name="end"
                  required
                  value={endTime}
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

            <button type="button" className="text-indigo-500">
              + Assign sales person
            </button>
          </div>

          <div className="relative row-span-2 bg-background p-6">
            <div className="absolute inset-0 divide-y overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center gap-4  bg-background px-8 py-2">
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
                <div
                  className="absolute left-16 right-0 rounded border border-solid border-indigo-500 bg-indigo-500/30"
                  style={{
                    top: `${getHours(startTime) * 4}rem`,
                    bottom: `${(24 - getHours(endTime)) * 4}rem`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-background p-6">
            <Selector
              newButton={<NewCustomer setCustomers={setClientList} />}
              label={
                client ? `${client.firstName} ${client.lastName}` : "Client"
              }
            >
              <div>
                {clientList.map((client) => (
                  <button
                    type="button"
                    key={client.id}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
                    onClick={() => setClient(client)}
                  >
                    <Image
                      // biome-ignore lint/style/noNonNullAssertion: <explanation>
                      src={client.photo!}
                      alt="Client Image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />

                    <div>
                      <p className="text-start text-sm font-bold">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-xs">{client.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Selector>

            <Selector
              newButton={<NewVehicle setVehicles={setVehicleList} />}
              label={
                vehicle ? vehicle.model || `Vehicle ${vehicle.id}` : "Vehicle"
              }
            >
              <div className="">
                {vehicleList.map((vehicle) => (
                  <button
                    type="button"
                    key={vehicle.id}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
                    onClick={() => setVehicle(vehicle)}
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {`${vehicle.model} ${vehicle.id}`}
                      </p>
                      <p className="text-xs">Owner</p>{" "}
                      {/* TODO: Add owner name */}
                    </div>
                  </button>
                ))}
              </div>
            </Selector>

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
              className={slimInputClassName + " border-2 border-slate-400"}
              rows={3}
            />
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
