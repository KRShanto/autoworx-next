import { Switch } from "@/components/Switch";
import { useListsStore } from "@/stores/lists";
import type { Customer, EmailTemplate, Vehicle } from "@prisma/client";
import moment from "moment";
import { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { TbUserX } from "react-icons/tb";
import NewTemplate from "../../../../../components/Lists/NewTemplate";
import { deleteTemplate } from "../../actions/deleteTemplate";
import Selector from "@/components/Selector";
import UpdateTemplate from "./UpdateTemplateComponent";

export function Reminder({
  client,
  vehicle,
  endTime,
  date,
  times,
  setTimes,
  confirmationTemplate,
  setConfirmationTemplate,
  reminderTemplate,
  setReminderTemplate,
  confirmationTemplateStatus,
  setConfirmationTemplateStatus,
  reminderTemplateStatus,
  setReminderTemplateStatus,
}: {
  client: Customer | null;
  vehicle: Vehicle | null;
  endTime: string;
  date: string;
  times: { time: string; date: string }[];
  setTimes: (times: { time: string; date: string }[]) => void;
  confirmationTemplate: EmailTemplate | null;
  setConfirmationTemplate: React.Dispatch<
    React.SetStateAction<EmailTemplate | null>
  >;
  reminderTemplate: EmailTemplate | null;
  setReminderTemplate: React.Dispatch<
    React.SetStateAction<EmailTemplate | null>
  >;
  confirmationTemplateStatus: boolean;
  setConfirmationTemplateStatus: (status: boolean) => void;
  reminderTemplateStatus: boolean;
  setReminderTemplateStatus: (status: boolean) => void;
}) {
  const [time, setTime] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const templates = useListsStore((x) => x.templates);

  async function handleDelete({ id, type }: { id: number; type: string }) {
    await deleteTemplate(id);

    if (type === "Confirmation") {
      // remove this template from the array
      setConfirmationTemplate(null);
    } else {
      // remove this template from the array
      setReminderTemplate(null);
    }

    // remove this template from the array
    useListsStore.setState(({ templates }) => ({
      templates: templates.filter((template) => template.id !== id),
    }));
  }

  return client === null ? (
    <div className="grid h-full place-content-center place-items-center gap-2 border-[1.5rem] border-solid border-white bg-neutral-300 text-center text-slate-500">
      <TbUserX size={64} />
      <span>No Client Selected</span>
    </div>
  ) : (
    <>
      <div className="space-y-4 p-2">
        <label className="flex items-center">
          <h2>Confirmation</h2>
          <Switch
            name="confirmation"
            className="ml-auto scale-75"
            checked={confirmationTemplateStatus}
            setChecked={setConfirmationTemplateStatus}
          />
        </label>

        <Selector
          border
          label={(template: EmailTemplate | null) =>
            template ? template.subject : "Template"
          }
          newButton={
            <NewTemplate
              type="Confirmation"
              clientName={client.firstName + " " + client.lastName}
              vehicleModel={vehicle?.model!}
            />
          }
          items={templates.filter(
            (template: EmailTemplate) => template.type === "Confirmation",
          )}
          displayList={(template: EmailTemplate) => (
            <div className="flex justify-between">
              <p className="text-sm font-bold">{template.subject}</p>
              <div className="flex items-center gap-2">
                <UpdateTemplate
                  id={template.id}
                  subject={template.subject}
                  message={template.message || ""}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDelete({ id: template.id, type: "Confirmation" })
                  }
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          selectedItem={confirmationTemplate}
          setSelectedItem={setConfirmationTemplate}
          onSearch={(search: string) =>
            templates.filter((template) =>
              template.subject.toLowerCase().includes(search.toLowerCase()),
            )
          }
        />
      </div>
      <div className="space-y-4 p-2">
        <label className="flex items-center">
          <h2>Reminder</h2>
          <Switch
            name="reminder"
            className="ml-auto scale-75"
            checked={reminderTemplateStatus}
            setChecked={setReminderTemplateStatus}
          />
        </label>

        <Selector
          border
          label={(template: EmailTemplate | null) =>
            template ? template.subject : "Template"
          }
          newButton={
            <NewTemplate
              type="Reminder"
              clientName={client.firstName + " " + client.lastName}
              vehicleModel={vehicle?.model!}
            />
          }
          items={templates.filter(
            (template: EmailTemplate) => template.type === "Reminder",
          )}
          displayList={(template: EmailTemplate) => (
            <div className="flex justify-between">
              <p className="text-sm font-bold">{template.subject}</p>
              <div className="flex items-center gap-2">
                <UpdateTemplate
                  id={template.id}
                  subject={template.subject}
                  message={template.message || ""}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDelete({ id: template.id, type: "Reminder" })
                  }
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          selectedItem={reminderTemplate}
          setSelectedItem={setReminderTemplate}
          onSearch={(search: string) =>
            templates.filter((template) =>
              template.subject.toLowerCase().includes(search.toLowerCase()),
            )
          }
        />
      </div>

      <div className="mx-auto my-2 h-[300px] w-[95%] rounded-md border-2 border-slate-400">
        <div className="flex items-center justify-evenly border-b p-3">
          {/* input time */}
          <input
            type="time"
            className="rounded-lg border-2 border-slate-400 p-1 text-lg"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="date"
            className="rounded-lg border-2 border-slate-400 p-1"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button
            type="button"
            className="rounded-lg bg-[#6571FF] p-2 px-4 text-white"
            onClick={() => setTimes([...times, { time, date: dateInput }])}
          >
            Add
          </button>
        </div>

        <div className="h-[200px] overflow-scroll p-2">
          {/* Calculate current time and dateInput with endTime and date */}
          {/* Like:  6 days 7 hours before appointment */}
          {/* also format date and times to use with moment */}

          {times.map((timeObj, index) => {
            // Convert the date and time to a moment object
            const appointmentTime = moment(`${date} ${endTime}`);
            // Convert the timeObj date and time to a moment object
            const timeObjMoment = moment(`${timeObj.date} ${timeObj.time}`);
            // Calculate the difference in time
            const diff = moment.duration(appointmentTime.diff(timeObjMoment));

            // Format the difference
            const days = diff.days();
            const hours = diff.hours();

            return (
              <div key={index} className="flex justify-between px-5">
                <p>
                  <span className="text-[#6571FF]">
                    {days} days {hours}
                    hours
                  </span>{" "}
                  before appointment
                </p>
                <button
                  type="button"
                  onClick={() => setTimes(times.filter((_, i) => i !== index))}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
