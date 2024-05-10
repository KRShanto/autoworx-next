import React, { useState } from "react";
import { updateCalendarSettings } from "../../actions/updateCalendarSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";
import { CalendarSettings } from "@prisma/client";
import { GoGear } from "react-icons/go";
import Submit from "@/components/Submit";

const week = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function Settings({
  settings,
}: {
  settings?: CalendarSettings;
}) {
  const [open, setOpen] = useState(false);

  async function handleSave(data: FormData) {
    const weekStart = data.get("week-start") as string;
    const dayStart = data.get("day-start") as string;
    const dayEnd = data.get("day-end") as string;
    const weekend1 = data.get("weekend-1") as string;
    const weekend2 = data.get("weekend-2") as string;

    await updateCalendarSettings({
      weekStart,
      dayStart,
      dayEnd,
      weekend1,
      weekend2,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="app-shadow rounded-md p-2 text-xl text-[#797979]">
          <GoGear />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl grid-rows-[auto,1fr,auto]">
        {/* Heading */}
        <DialogHeader>
          <DialogTitle>Calendar Settings</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <form className="flex flex-col gap-5">
          <div className="flex justify-between">
            <div>
              <label htmlFor="week-start" className="font-medium">
                Week Starts
              </label>
              <select
                id="week-start"
                name="week-start"
                className="w-32 rounded-md border-2 border-gray-400 bg-white p-1 px-2"
                defaultValue={settings && settings.weekStart}
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            </div>

            <div>
              <label htmlFor="day-start" className="font-medium">
                Day starts
              </label>
              <input
                type="time"
                id="day-start"
                name="day-start"
                defaultValue={settings ? settings.dayStart : "10:00"}
                className="rounded-md border-2 border-slate-400 p-1"
              />
            </div>

            <div>
              <label htmlFor="day-end" className="font-medium">
                Day ends
              </label>
              <input
                type="time"
                id="day-end"
                name="day-end"
                defaultValue={settings ? settings.dayEnd : "18:00"}
                className="rounded-md border-2 border-slate-400 p-1"
              />
            </div>
          </div>

          <div>
            <div>
              <p className="font-medium">Show Weekends</p>
              <div className="flex gap-5">
                <div className="w-full">
                  <select
                    id="weekend-1"
                    name="weekend-1"
                    className="w-full rounded-md border border-[#6571FF] bg-[#DDE0FF] p-1 text-center text-[#6571FF] focus:border-[#6571FF] focus:bg-white focus:text-black"
                    defaultValue={settings && settings.weekend1}
                  >
                    {week.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full ">
                  <select
                    id="weekend-2"
                    name="weekend-2"
                    className="w-full rounded-md border border-[#6571FF] bg-[#DDE0FF] p-1 text-center text-[#6571FF] focus:border-[#6571FF] focus:bg-white focus:text-black"
                    defaultValue={settings && settings.weekend2}
                  >
                    {/* start from 2nd element */}
                    {week.slice(1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="h-36 rounded-md bg-[#FAFAFA] p-3">
            <div className="flex justify-between">
              <p className="font-semibold">Google Calendar Api</p>
              <button
                className="rounded-md border-2 border-slate-400 p-1"
                type="button"
              >
                Connect
              </button>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-md border-2 border-slate-400 p-1"
              >
                Cancel
              </button>
            </DialogClose>
            <Submit
              className="rounded-md bg-[#6571FF] p-1 px-5 text-white"
              formAction={handleSave}
            >
              Save
            </Submit>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
