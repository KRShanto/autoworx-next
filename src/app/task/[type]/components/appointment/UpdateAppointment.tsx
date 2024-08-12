"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import Selector from "@/components/Selector";
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { usePopupStore } from "@/stores/popup";
import { AppointmentFull } from "@/types/db";
import type {
  CalendarSettings,
  Client,
  EmailTemplate,
  User,
  Vehicle,
} from "@prisma/client";
import { TimePicker } from "antd";
// @ts-ignore
import dayjs from "dayjs";
import moment from "moment";
import { customAlphabet } from "nanoid";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { TbBell, TbCalendar } from "react-icons/tb";
import { deleteAppointment } from "../../../../../actions/appointment/deleteAppointment";
import { editAppointment } from "../../../../../actions/appointment/editAppointment";
import { Reminder } from "./Reminder";

enum Tab {
  Schedule = 0,
  Reminder = 1,
}

export function UpdateAppointment() {
  const { popup, data, close } = usePopupStore();
  const { appointment, settings, employees, templates } = data as {
    appointment: AppointmentFull;
    customers: Client[];
    vehicles: Vehicle[];
    settings: CalendarSettings;
    employees: User[];
    templates: EmailTemplate[];
  };
  const { estimates } = useListsStore();

  const [tab, setTab] = useState(Tab.Schedule);

  const [title, setTitle] = useState(appointment.title);
  const [notes, setNotes] = useState(appointment.notes || "");
  const [date, setDate] = useState<string | null>(
    moment(appointment.date).format("YYYY-MM-DD"),
  );
  const [startTime, setStartTime] = useState<string | null>(
    appointment.startTime,
  );

  const [endTime, setEndTime] = useState<string | null>(appointment.endTime);
  const [draft, setDraft] = useState<string | null>(appointment.draftEstimate);
  const [draftEstimates, setDraftEstimates] = useState<string[]>([]);
  const [allDay, setAllDay] = useState(false);

  const [client, setClient] = useState<Client | null>(appointment.client);
  const [vehicle, setVehicle] = useState<Vehicle | null>(appointment.vehicle);
  const [assignedUsers, setAssignedUsers] = useState<User[]>(
    appointment.assignedUsers,
  );

  const [addSalesPersonOpen, setAddSalesPersonOpen] = useState(false);
  const [employeesToDisplay, setEmployeesToDisplay] =
    useState<User[]>(employees);

  const [times, setTimes] = useState<{ time: string; date: string }[]>(
    appointment.times as any,
  );
  const [confirmationTemplate, setConfirmationTemplate] =
    useState<EmailTemplate | null>(appointment.confirmationEmailTemplate);
  const [reminderTemplate, setReminderTemplate] =
    useState<EmailTemplate | null>(appointment.reminderEmailTemplate);
  const [confirmationTemplateStatus, setConfirmationTemplateStatus] =
    useState<boolean>(appointment.confirmationEmailTemplateStatus);
  const [reminderTemplateStatus, setReminderTemplateStatus] = useState<boolean>(
    appointment.reminderEmailTemplateStatus,
  );

  const [draftOpen, setDraftOpen] = useState(false);

  //dropdown states
  const [clientOpenDropdown, setClientOpenDropdown] = useState(false);
  const [vehicleOpenDropdown, setVehicleOpenDropdown] = useState(false);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openReminder, setOpenReminder] = useState(false);

  const handleSearch = (search: string) => {
    setEmployeesToDisplay(
      employees.filter((employee) =>
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
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

  useEffect(() => {
    if (estimates) {
      // filter all estimates where clientId is client.id
      const filteredEstimates = estimates.filter(
        (estimate) => estimate.clientId === client?.id,
      );
      // map the filtered estimates to get the id
      const estimateIds = filteredEstimates.map((estimate) => estimate.id);
      // set the draft estimates
      setDraftEstimates(estimateIds);
    }
  }, [estimates, client]);

  function onTimeChange(e: any) {
    if (!e) return;

    const [start, end] = e;
    setStartTime(start?.format("HH:mm"));
    setEndTime(end?.format("HH:mm"));
  }

  const handleSubmit = async (data: FormData) => {
    const res = await editAppointment({
      id: appointment.id,
      appointment: {
        title,
        date: date as string,
        startTime: startTime as string,
        endTime: endTime as string,
        assignedUsers: assignedUsers.map((user) => user.id),
        clientId: client ? client.id : undefined,
        vehicleId: vehicle ? vehicle.id : undefined,
        draftEstimate: draft,
        notes,
        confirmationEmailTemplateId: confirmationTemplate?.id,
        reminderEmailTemplateId: reminderTemplate?.id,
        confirmationEmailTemplateStatus: confirmationTemplateStatus,
        reminderEmailTemplateStatus: reminderTemplateStatus,
        times,
      },
    });

    close();
  };
  useEffect(() => {
    if (
      clientOpenDropdown &&
      (vehicleOpenDropdown || draftOpen || openConfirmation || openReminder)
    ) {
      setVehicleOpenDropdown(false);
      setDraftOpen(false);
      setOpenConfirmation(false);
      setOpenReminder(false);
    } else if (
      vehicleOpenDropdown &&
      (clientOpenDropdown || draftOpen || openConfirmation || openReminder)
    ) {
      setClientOpenDropdown(false);
      setDraftOpen(false);
      setOpenConfirmation(false);
      setOpenReminder(false);
    } else if (
      draftOpen &&
      (clientOpenDropdown ||
        vehicleOpenDropdown ||
        openConfirmation ||
        openReminder)
    ) {
      setClientOpenDropdown(false);
      setVehicleOpenDropdown(false);
      setOpenConfirmation(false);
      setOpenReminder(false);
    } else if (
      openConfirmation &&
      (clientOpenDropdown || vehicleOpenDropdown || draftOpen || openReminder)
    ) {
      setClientOpenDropdown(false);
      setVehicleOpenDropdown(false);
      setDraftOpen(false);
      setOpenReminder(false);
    } else if (
      openReminder &&
      (clientOpenDropdown ||
        vehicleOpenDropdown ||
        draftOpen ||
        openConfirmation)
    ) {
      setClientOpenDropdown(false);
      setVehicleOpenDropdown(false);
      setDraftOpen(false);
      setOpenConfirmation(false);
    }
  }, [
    draftOpen,
    clientOpenDropdown,
    vehicleOpenDropdown,
    openConfirmation,
    openReminder,
  ]);
  return (
    <Dialog open={popup === "UPDATE_APPOINTMENT"} onOpenChange={close}>
      <DialogContent
        className="max-h-full max-w-5xl grid-rows-[auto,1fr,auto]"
        form
      >
        {/* Heading */}
        <DialogHeader className="grid items-center gap-4 sm:grid-cols-2">
          <DialogTitle>Edit Appointment</DialogTitle>

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

            <SlimInput
              name="title"
              label="Appointment Title"
              required
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />

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
              <div id="timer-parent">
                <TimePicker.RangePicker
                  id="time"
                  onChange={onTimeChange}
                  getPopupContainer={() =>
                    document.getElementById("timer-parent")!
                  }
                  use12Hours
                  format="h:mm a"
                  className="rounded-md border border-gray-500 p-1 placeholder-slate-800"
                  needConfirm={false}
                  value={[dayjs(startTime, "HH:mm"), dayjs(endTime, "HH:mm")]}
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
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
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
                      <p className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </p>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="row-start-2 space-y-4 bg-background p-6">
            <SelectClient
              value={client}
              setValue={setClient}
              openDropdown={clientOpenDropdown}
              setOpenDropdown={setClientOpenDropdown}
            />

            <SelectVehicle
              value={vehicle}
              setValue={setVehicle}
              openDropdown={vehicleOpenDropdown}
              setOpenDropdown={setVehicleOpenDropdown}
            />

            <Selector
              label={(draft: string | null) =>
                draft ? draft : "Draft Estimates"
              }
              openState={[draftOpen, setDraftOpen]}
              newButton={
                <button
                  className="text-[#6571FF] disabled:text-zinc-400"
                  onClick={() => {
                    setDraft(customAlphabet("1234567890", 10)());
                    setDraftOpen(false);
                  }}
                  disabled={!client || !vehicle}
                  type="button"
                >
                  + New Draft Estimate
                </button>
              }
              items={draftEstimates}
              selectedItem={draft}
              setSelectedItem={setDraft}
              displayList={(item) => <p className="text-[#6571FF]">{item}</p>}
              onSearch={(search) => {
                return draftEstimates.filter((draft) =>
                  draft.toLowerCase().includes(search.toLowerCase()),
                );
              }}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              className={cn(slimInputClassName, "border-2 border-slate-400")}
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.currentTarget.value)}
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
                openConfirmation={openConfirmation}
                openReminder={openReminder}
                setOpenReminder={setOpenReminder}
                setOpenConfirmation={setOpenConfirmation}
              />
            ) : null}
          </div>
        </div>

        <div className="flex">
          <button
            className="text-xl text-red-500 hover:text-red-700"
            type="button"
            onClick={async () => {
              await deleteAppointment(appointment.id);
              close();
            }}
          >
            <FaTrash />
          </button>

          <DialogFooter className="w-full">
            <DialogClose className="rounded-md border px-4 py-1">
              Cancel
            </DialogClose>
            <Submit
              className="rounded-md border bg-[#6571FF] px-4 py-1 text-white"
              formAction={handleSubmit}
            >
              Save
            </Submit>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getHours(time: string) {
  if (!time) return 0;
  const [h, m] = time.split(":").map((x) => +x);
  return h + m / 60;
}
