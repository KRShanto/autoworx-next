import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput } from "@/components/SlimInput";
import { useState } from "react";
import InvoiceEstimateAttachment from "./InvoiceEstimateAttachment";
import { requestEstimate } from "@/actions/communication/collaboration/requestEstimate";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

type TProps = { receiverUser: User };

export default function InvoiceEstimateModal({ receiverUser }: TProps) {
  const { data: authUser } = useSession();
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [estimateInfo, setEstimateInfo] = useState({
    model: "",
    year: "",
    make: "",
    serviceRequest: "",
    dueDate: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = e.target || {};
    setEstimateInfo({ ...estimateInfo, [name]: value });
  };

  const handleEstimateSubmit = async () => {
    let photoPaths: string[] = [];
    try {
      // upload photos
      if (photos.length > 0) {
        const formData = new FormData();

        photos.forEach((photo) => {
          formData.append("photos", photo);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error("Failed to upload photos");
          throw new Error("Failed to upload photos");
        }

        const json = await res.json();
        const data = json.data;

        photoPaths.push(...data);
      }
      console.log({ photoPaths });
      await requestEstimate({
        photoPaths,
        ...estimateInfo,
        year: parseInt(estimateInfo.year),
        receiverId: receiverUser.id,
        receiverCompanyId: receiverUser.companyId,
        senderId: parseInt(authUser?.user?.id!),
        senderCompanyId: (authUser as Session & { user: { companyId: number } })
          ?.user?.companyId,
      });
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
    console.log("Estimate submitted");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-nowrap rounded-md border border-[#006D77] bg-white px-2 text-sm text-[#006D77] hover:bg-[#006D77] hover:text-white">
          Request Estimate
        </p>
      </DialogTrigger>
      <DialogContent
        form
        onSubmit={handleEstimateSubmit}
        className="overflow-y-auto"
      >
        {/* {error && <p className="text-center text-sm text-red-400">{error}</p>} */}
        <h2 className="mb-5 text-2xl font-bold">Request an Invoice/Estimate</h2>
        <div className="flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SlimInput
              onChange={handleChange}
              label="Year"
              name="year"
              type="number"
            />
            <SlimInput
              onChange={handleChange}
              label="Make"
              name="make"
              type="text"
            />
            <SlimInput
              onChange={handleChange}
              label="Model"
              name="model"
              type="text"
            />
            <SlimInput
              label="Service Requested"
              name="serviceRequest"
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 gap-y-2">
            <SlimInput
              onChange={handleChange}
              className="w-2/4"
              label="Due Date"
              name="dueDate"
              type="date"
            />
            <label htmlFor="notes" className={"block"}>
              <div className="mb-1 px-2 font-medium">Notes</div>
              <textarea
                onChange={handleChange}
                name="notes"
                id="notes"
                className="h-[93px] w-full resize-none rounded-md border border-gray-500 px-2 focus:outline-none"
              ></textarea>
            </label>
          </div>
        </div>
        <InvoiceEstimateAttachment photos={photos} setPhotos={setPhotos} />
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            type="submit"
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
          >
            Add
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
