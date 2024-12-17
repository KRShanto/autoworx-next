import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput } from "@/components/SlimInput";
import { useState, useTransition } from "react";
import InvoiceEstimateAttachment from "./InvoiceEstimateAttachment";
import { requestEstimate } from "@/actions/communication/collaboration/requestEstimate";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { Message as TMessage } from "../internal/UsersArea";
import { sendType } from "@/types/Chat";
import { RotatingLines } from "react-loader-spinner";

type TProps = {
  receiverUser: User;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setShowAttachment: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InvoiceEstimateModal({
  receiverUser,
  setMessages,
  setShowAttachment,
}: TProps) {
  const [pending, startTransaction] = useTransition();
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
    try {
      setError("");
      // upload photos
      const formDataForPhoto = new FormData();
      if (photos.length > 0) {
        photos.forEach((photo) => {
          formDataForPhoto.append("photos", photo);
        });
      }

      const {
        status,
        data: { requestEstimateFromDB },
      } = await requestEstimate(formDataForPhoto, {
        ...estimateInfo,
        year: parseInt(estimateInfo.year),
        receiverId: receiverUser.id,
        receiverCompanyId: receiverUser.companyId,
        senderId: parseInt(authUser?.user?.id!),
        senderCompanyId: (authUser as Session & { user: { companyId: number } })
          ?.user?.companyId,
      });
      if (status === 200) {
        setOpen(false);
        setEstimateInfo({
          model: "",
          year: "",
          make: "",
          serviceRequest: "",
          dueDate: "",
          notes: "",
        });

        // send request estimate message realtime
        const pusherResponse = await fetch(`/api/pusher`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: receiverUser.id,
            type: sendType.User,
            message: "",
            attachmentFile: null,
            requestEstimate: requestEstimateFromDB,
          }),
        });
        const messageData = await pusherResponse.json();
        if (!pusherResponse.ok || !messageData.success) {
          throw new Error(`message wasn't sended`);
        }

        const newMessage: TMessage = {
          message: "",
          sender: "USER",
          attachment: null,
          requestEstimate: requestEstimateFromDB,
        };

        setMessages((messages) => [...messages, newMessage]);
        setPhotos([]);
        setError("");
        setShowAttachment(false);
        toast.success("Estimate requested successfully");
      } else {
        throw new Error("Failed to request estimate");
      }
    } catch (err: any) {
      toast.error("Failed to request estimate");
      setError(err.message);
      console.error(err);
    }
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
        onSubmit={(e) => startTransaction(handleEstimateSubmit)}
        className="max-h-[500px] w-[96%] overflow-y-auto md:max-h-max"
      >
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <h2 className="mb-5 text-2xl font-bold">Request an Invoice/Estimate</h2>
        <div className="flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              />
            </label>
          </div>
        </div>
        <InvoiceEstimateAttachment photos={photos} setPhotos={setPhotos} />
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            disabled={pending}
            type="submit"
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white disabled:bg-blue-500"
          >
            {pending ? (
              <RotatingLines strokeColor="#fff" strokeWidth="5" width="25" />
            ) : (
              "Add"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
