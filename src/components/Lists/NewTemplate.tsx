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
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useEffect, useState } from "react";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";
import { addTemplate } from "../../actions/appointment/addTemplate";
import { EmailTemplate, EmailTemplateType } from "@prisma/client";
import { useListsStore } from "@/stores/lists";
import moment from "moment";

export default function NewTemplate({
  type,
  clientName,
  vehicleModel,
  setTemplate,
  setOpenTemplate,
  startTime,
  date,
}: {
  type: EmailTemplateType;
  clientName: string;
  vehicleModel: string;
  setTemplate: React.Dispatch<React.SetStateAction<EmailTemplate | null>>;
  setOpenTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  startTime: string;
  date: string;
}) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  const templates = useListsStore((x) => x.templates);
  const [subject, setSubject] = useState(
    "Appointment Confirmation at TC CUSTOMS ATLANTA",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const appointmentDate = moment(`${date}T${startTime}:00`).format(
      "dddd, MMMM DD, h:mm A",
    );
    // const dayName = moment(date).format("dddd");
    // const month = moment(date).format("MMMM DD");
    setMessage(
      `Hi ${clientName},
    
This is a friendly reminder that you have an upcoming appointment on ${appointmentDate} EDT.
  
Location
TC CUSTOMS ATLANTA
6350 MCDONOUGH DRIVE NORTHWEST
NORCROSS GA 30093
  
Vehicle
${vehicleModel}`,
    );
  }, [clientName, vehicleModel, date, startTime]);

  async function handleSubmit(data: FormData) {
    const res = await addTemplate({ subject, message, type });

    if (res.type === "error") {
      showError({
        field: res.field || "subject",
        message: res.message || "",
      });
    } else {
      useListsStore.setState({
        templates: [...templates, res.data],
      });
      setOpen(false);
      setTemplate(res.data);
      setOpenTemplate(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + Add New Template
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Custom Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <FormError />
          <input type="hidden" name="type" value={type} />
          <SlimInput
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <label className="block">
            <div className="mb-1 px-2 font-medium">Message</div>
            <textarea
              name="message"
              rows={10}
              className={slimInputClassName}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </div>

        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <Submit
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
            formAction={handleSubmit}
          >
            Save
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
