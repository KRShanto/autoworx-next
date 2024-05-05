import { Switch } from "@/components/Switch";
import type { Customer } from "@prisma/client";
import { useState, type Key } from "react";
import { TbUserX } from "react-icons/tb";
import NewTemplate from "./NewTemplate";
import Selector from "./Selector";

type Template = { id: Key; name: string };

export function Reminder({ client }: { client: Customer | null }) {
  const [confirmationTemplate, setConfirmationTemplate] =
    useState<Template | null>(null);
  const [reminderTemplate, setReminderTemplate] = useState<Template | null>(
    null,
  );

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
          <Switch name="confirmation" className="ml-auto scale-75" />
        </label>
        <Selector
          label="Template"
          newButton={<NewTemplate type="CONFIRMATION" />}
        >
          <div className="">
            {[].map((template: Template) => (
              <button
                type="button"
                key={template.id}
                className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
                onClick={() => setConfirmationTemplate(template)}
              >
                <div>
                  <p className="text-sm font-bold">{template.name}</p>
                </div>
              </button>
            ))}
          </div>
        </Selector>
      </div>
      <div className="space-y-4 p-2">
        <label className="flex items-center">
          <h2>Reminder</h2>
          <Switch name="reminder" className="ml-auto scale-75" />
        </label>
        <Selector label="Template" newButton={<NewTemplate type="REMINDER" />}>
          <div className="">
            {[].map((template: Template) => (
              <button
                type="button"
                key={template.id}
                className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
                onClick={() => setReminderTemplate(template)}
              >
                <div>
                  <p className="text-sm font-bold">{template.name}</p>
                </div>
              </button>
            ))}
          </div>
        </Selector>
      </div>
    </>
  );
}
