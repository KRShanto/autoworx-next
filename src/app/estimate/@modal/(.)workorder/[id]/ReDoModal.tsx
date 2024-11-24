"use client";
import { getTechnicians } from "@/actions/estimate/technician/getTechnicians";
import { DialogContent, DialogFooter } from "@/components/Dialog";
import { Dialog } from "@/components/Dialog";
import { useServerGet } from "@/hooks/useServerGet";
import { Technician } from "@prisma/client";
import { useState, useTransition } from "react";
import RedoTechnician from "./RedoTechnician";
import toast from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { createInvoiceRedo } from "@/actions/estimate/labor/createInvoiceRedo";

type TProps = {
  invoiceId: string;
  serviceId: number;
  technicians: (Technician & { user: { firstName: string } })[];
};

type TRedoTechnicianInfo = {
  invoiceId: string;
  serviceId: number;
  technicianId: number;
  notes: string;
};

export default function ReDoModal({
  invoiceId,
  serviceId,
  technicians,
}: TProps) {
  const [open, setOpen] = useState(false);
  const [redoTechnicians, setRedoTechnicians] = useState<TRedoTechnicianInfo[]>(
    [],
  );
  const [pending, startTransition] = useTransition();

  const completedWork = technicians.filter(
    (technician: Technician) => technician.status?.trim() === "Complete",
  );
  const isWorkCompleted =
    completedWork.length === technicians.length ? true : false;

  const handleRedoTechnician = (
    event: React.ChangeEvent<HTMLInputElement>,
    technicianId: number,
    notes: string,
  ) => {
    const checked = event.target.checked;
    if (checked) {
      const redoTechnicianInfo = {
        invoiceId,
        serviceId,
        technicianId,
        notes,
      };
      setRedoTechnicians((prev) => [...prev, redoTechnicianInfo]);
    } else {
      setRedoTechnicians((prev) =>
        prev.filter((info) => info.technicianId !== technicianId),
      );
    }
  };

  const handleChangeTechnicianNotes = (
    event: React.ChangeEvent<HTMLInputElement>,
    technicianId: number,
  ) => {
    const { value } = event.target;
    setRedoTechnicians((prevTechnicians) =>
      prevTechnicians.map((info) => {
        return info.technicianId === technicianId
          ? { ...info, notes: value }
          : info;
      }),
    );
  };

  const handleSaveInvoiceRedo = async () => {
    try {
      const response = await createInvoiceRedo(redoTechnicians);
      if (response.status === 200) {
        setRedoTechnicians([]);
        setOpen(false);
        toast.success("save redo technicians successfully");
      }
    } catch (err) {
      toast.error("Failed to save redo technicians");
    }
  };

  return (
    <>
      {isWorkCompleted && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-full bg-[#6571FF] px-2 py-0.5 text-white"
        >
          Re-Do
        </button>
      )}
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <DialogContent>
          <div className="space-y-3 rounded-md bg-white">
            <div className="mx-10 my-5">
              <div>
                <h3 className="text-xl font-bold">Service 1</h3>
                <p className="text-semibold text-base">
                  Select employee for re-do
                </p>
              </div>
              <div className="mt-5 flex flex-col justify-center space-y-1">
                <div className="flex">
                  <p className="min-w-[150px] text-center">Name</p>
                  <p>Notes</p>
                </div>
                <div className="space-y-3">
                  {/* input - 1 */}
                  {technicians &&
                    technicians?.length > 0 &&
                    technicians.map((technician) => (
                      <RedoTechnician
                        key={technician.id}
                        technician={technician}
                        onRedoTechnician={handleRedoTechnician}
                        onChangeTechnicianNotes={handleChangeTechnicianNotes}
                      />
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter className="py-8">
              <button
                disabled={pending}
                onClick={() => startTransition(handleSaveInvoiceRedo)}
                className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white"
              >
                {pending ? (
                  <RotatingLines
                    strokeColor="#fff"
                    strokeWidth="5"
                    width="25"
                  />
                ) : (
                  " Save Changes"
                )}
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
