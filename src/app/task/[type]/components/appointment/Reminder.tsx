import Selector from "@/components/Selector";
import { Switch } from "@/components/Switch";
import { useListsStore } from "@/stores/lists";
import type { Client, EmailTemplate, Vehicle } from "@prisma/client";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { TbUserX } from "react-icons/tb";
import NewTemplate from "../../../../../components/Lists/NewTemplate";
import { deleteTemplate } from "../../../../../actions/appointment/deleteTemplate";
import UpdateTemplate from "./UpdateTemplateComponent";

export function Reminder({
  client,
  vehicle,
  startTime,
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
  openConfirmation,
  openReminder,
  setOpenReminder,
  setOpenConfirmation,
}: {
  client: Client | null;
  vehicle: Vehicle | null;
  startTime: string;
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
  openConfirmation: boolean;
  openReminder: boolean;
  setOpenReminder: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [time, setTime] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const templates = useListsStore((x) => x.templates);
  console.log(startTime, date);
  useEffect(() => {
    setOpenConfirmation(false);
  }, [openReminder]);
  useEffect(() => {
    setOpenReminder(false);
  }, [openConfirmation]);

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
          clickabled={false}
          label={(template: EmailTemplate | null) =>
            template ? template.subject : "Template"
          }
          newButton={
            <NewTemplate
              type="Confirmation"
              clientName={client.firstName + " " + client.lastName}
              vehicleModel={vehicle?.model!}
              setTemplate={setConfirmationTemplate}
              setOpenTemplate={setOpenConfirmation}
              date={date}
              startTime={startTime}
            />
          }
          items={templates.filter(
            (template: EmailTemplate) => template.type === "Confirmation",
          )}
          displayList={(template: EmailTemplate) => (
            <div className="flex">
              <button
                className="w-full text-left text-sm font-bold"
                onClick={() => {
                  setConfirmationTemplate(template);
                  setOpenConfirmation(false);
                }}
                type="button"
              >
                {template.subject}
              </button>
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
          openState={[openConfirmation, setOpenConfirmation]}
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
          clickabled={false}
          label={(template: EmailTemplate | null) =>
            template ? template.subject : "Template"
          }
          newButton={
            <NewTemplate
              type="Reminder"
              clientName={client.firstName + " " + client.lastName}
              vehicleModel={vehicle?.model!}
              setTemplate={setReminderTemplate}
              setOpenTemplate={setOpenReminder}
              date={date}
              startTime={startTime}
            />
          }
          items={templates.filter(
            (template: EmailTemplate) => template.type === "Reminder",
          )}
          displayList={(template: EmailTemplate) => (
            <div className="flex">
              <button
                className="w-full text-left text-sm font-bold"
                onClick={() => {
                  setReminderTemplate(template);
                  setOpenReminder(false);
                }}
                type="button"
              >
                {template.subject}
              </button>
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
          openState={[openReminder, setOpenReminder]}
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
            const appointmentTime = moment(
              `${date} ${startTime}`,
              "YYYY-MM-DD HH:mm",
            ).utc();

            const timeObjMoment = moment(
              `${timeObj.date} ${timeObj.time}`,
              "YYYY-MM-DD HH:mm",
            ).utc();

            const diff = moment.duration(appointmentTime.diff(timeObjMoment));

            const days = diff.days();
            const hours = diff.hours();
            const minutes = diff.minutes();

            return (
              <div key={index} className="flex justify-between px-5">
                <p>
                  <span className="text-[#6571FF]">
                    {days} days {hours}
                    hours {minutes} minutes
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
