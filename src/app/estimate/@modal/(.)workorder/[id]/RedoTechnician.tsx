import { Technician } from "@prisma/client";
import { useState } from "react";

type TProps = {
  technician: Technician & { user: { firstName: string } };
  onRedoTechnician: (
    event: React.ChangeEvent<HTMLInputElement>,
    technicianId: number,
    notes: string,
  ) => void;
  onChangeTechnicianNotes: (
    event: React.ChangeEvent<HTMLInputElement>,
    technicianId: number,
  ) => void;
};
export default function RedoTechnician({
  technician,
  onRedoTechnician,
  onChangeTechnicianNotes,
}: TProps) {
  const [notes, setNotes] = useState("");
  return (
    <div key={technician.id} className="flex items-center">
      <label
        htmlFor="john"
        className="flex min-w-[150px] items-center justify-start space-x-3"
      >
        <input
          className="size-4 shrink-0 accent-[#6571FF]"
          type="checkbox"
          name="john"
          id="john"
          onChange={(event) => onRedoTechnician(event, technician?.id, notes)}
        />
        <p id="john" className="cursor-pointer text-center">
          {technician.user.firstName}
        </p>
      </label>
      <input
        onChange={(e) => {
          onChangeTechnicianNotes(e, technician?.id);
          setNotes(e.target.value);
        }}
        className="w-full rounded-sm border border-gray-500 pl-1 focus:outline-none"
        value={notes}
        type="text"
        name=""
        id=""
      />
    </div>
  );
}
