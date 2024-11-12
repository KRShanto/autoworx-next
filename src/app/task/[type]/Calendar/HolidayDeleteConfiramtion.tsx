import { deleteHoliday } from "@/actions/task/deleteHoliday";
import { Dialog, DialogContent, DialogFooter } from "@/components/Dialog";
import moment from "moment";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";

type TProps = {
  holidayId: number;
};
export default function HolidayDeleteConfirmation({ holidayId }: TProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const handleRemoveHoliday = async () => {
    try {
      const response = await deleteHoliday(holidayId);
      if (response?.status === 200) {
        const removedHoliday = moment(response.data.date).format("MMMM DD, YYYY");
        toast.success(`${removedHoliday} - Holiday removed successfully!`);
        setOpen(false);
      } else {
        throw new Error("Failed to remove holiday");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <button type="button" onClick={() => setOpen(true)}>
        <RiDeleteBin6Line size={20} className="cursor-pointer" />
      </button>
      <DialogContent>
        <h2 className="mt-5 text-center text-xl font-semibold">
          Are you sure you want to remove this holiday?
        </h2>
        <DialogFooter className="py-4">
          <button
            disabled={pending}
            onClick={() => startTransition(handleRemoveHoliday)}
            className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white"
          >
            Confirm Remove
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
