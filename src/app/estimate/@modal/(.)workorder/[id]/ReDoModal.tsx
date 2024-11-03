"use client";
import { getTechnicians } from "@/actions/estimate/technician/getTechnicians";
import { DialogContent, DialogFooter } from "@/components/Dialog";
import { Dialog } from "@/components/Dialog";
import { useServerGet } from "@/hooks/useServerGet";
import { Technician } from "@prisma/client";
import { useState } from "react";
import RedoTechnician from "./RedoTechnician";
import toast from "react-hot-toast";

export default function ReDoModal({
  invoiceId,
  serviceId,
}: {
  invoiceId: string;
  serviceId: number;
}) {
  const [open, setOpen] = useState(false);
  const [redoTechnicians, setRedoTechnicians] = useState<
    {
      invoiceId: string;
      serviceId: number;
      technicianId: number;
      notes: string;
    }[]
  >([]);

  const { data, error } = useServerGet<{
    technicians: (Technician & { name: string })[];
    isWorkCompleted: boolean;
  }>(async () => {
    const technicians = await getTechnicians({
      invoiceId,
      serviceId,
    });
    const completedWork = technicians.filter(
      (technician: Technician) => technician.status?.trim() === "Complete",
    );
    const isWorkCompleted = completedWork.length === 0 ? false : true;
    return {
      isWorkCompleted,
      technicians,
    };
  });

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

  const handleSaveRedo = async () => {
    try {
      console.log(redoTechnicians);
    } catch (err) {
      toast.error("Failed to save redo technicians");
    }
  };

  return (
    <>
      {data?.isWorkCompleted && (
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
            {error && (
              <p className="p-1 text-center text-red-400">{error.message}</p>
            )}
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
                  {data?.technicians &&
                    data.technicians?.length > 0 &&
                    data.technicians.map((technician) => (
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
              <button className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white">
                Save Changes
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
