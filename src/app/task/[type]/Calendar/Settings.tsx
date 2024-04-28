import React from "react";
import { updateCalendarSettings } from "./updateCalendarSettings";
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

export default function Settings({
  settings,
}: {
  settings?: CalendarSettings;
}) {
  async function handleSave(data: FormData) {
    const weekStart = data.get("week-start") as string;
    const dayStart = data.get("day-start") as string;
    const dayEnd = data.get("day-end") as string;

    await updateCalendarSettings({
      weekStart,
      dayStart,
      dayEnd,
    });
  }

  return (
    <Dialog>
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
                <div className="w-full rounded-md border border-[#6571FF] bg-[#DDE0FF] p-1 text-center text-[#6571FF]">
                  Saturday
                </div>
                <div className="w-full rounded-md border border-[#6571FF] bg-[#DDE0FF] p-1 text-center text-[#6571FF]">
                  Sunday
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
