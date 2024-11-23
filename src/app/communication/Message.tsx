import Avatar from "@/components/Avatar";
import { Message as TMessage } from "./internal/UsersArea";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getUserById } from "@/actions/user/getUserById";
import { User } from "@prisma/client";
import Link from "next/link";

type TProps = {
  message: TMessage;
  fromGroup: boolean | undefined;
  onDownload: (attachment: string) => void;
};
export default function Message({ message, fromGroup, onDownload }: TProps) {
  console.log("message", message);
  const [senderInfo, setSenderInfo] = useState<User | null>(null);
  useEffect(() => {
    if (message.userId) {
      getUserById(message?.userId).then((res) => {
        if (res.type === "success") {
          setSenderInfo(res.data);
        }
      });
    }
  }, []);
  return (
    <div
      className={cn(
        "flex items-center",
        message.sender === "CLIENT" ? "justify-start" : "justify-end",
        message.message && "p-1",
      )}
    >
      <div className="flex items-start gap-2 p-1">
        {message.sender === "CLIENT" && fromGroup && (
          <div>
            <Avatar photo={senderInfo?.image} width={40} height={40} />
            <p className="text-center text-[10px]">{senderInfo?.firstName}</p>
          </div>
        )}
        <div
          className={cn(
            "flex flex-col space-y-3",
            message.sender === "CLIENT" ? "items-start" : "items-end",
          )}
        >
          {message.message && (
            <p
              className={cn(
                "max-w-[220px] rounded-xl p-2 text-base",
                message.sender === "CLIENT"
                  ? "bg-[#D9D9D9] text-slate-800"
                  : "bg-[#006D77] text-white",
              )}
            >
              {message.message}
            </p>
          )}

          {message.attachment &&
            message.attachment.length > 0 &&
            message.attachment.map((attachment) => {
              return (
                <div
                  key={attachment.fileName}
                  className={cn(
                    "flex items-center justify-center",
                    message.sender === "CLIENT"
                      ? "flex-row"
                      : "flex-row-reverse",
                  )}
                >
                  {attachment.fileType.includes("image") ? (
                    <Image
                      src={`/api/images/${attachment.fileUrl}`}
                      alt=""
                      className="aspect-auto rounded-sm border"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className="min-h-16 space-y-1 rounded-md bg-[#006D77] px-5 py-2 text-white">
                      <p>{attachment.fileName}</p>
                      <p>file size: {attachment.fileSize}</p>
                    </div>
                  )}
                  <button onClick={() => onDownload(attachment?.fileUrl!)}>
                    <IoCloudDownloadOutline
                      size={30}
                      className={cn(
                        "cursor-pointer",
                        message.sender === "CLIENT" ? "ml-6" : "mr-6",
                      )}
                    />
                  </button>
                </div>
              );
            })}

          {message.requestEstimate && (
            <Link
              href={
                message.sender === "USER"
                  ? `/estimate/view/${message.requestEstimate.invoiceId}`
                  : `/estimate/edit/${message.requestEstimate.invoiceId}`
              }
              className={cn(
                "w-96 rounded-md bg-[#006D77] p-1",
                message.sender === "CLIENT" && "bg-[#D9D9D9]",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center gap-x-2 rounded-md border border-white p-5",
                  message.sender === "CLIENT" && "border-[#006D77]",
                )}
              >
                <Image
                  src="/icons/navbar/Invoices.svg"
                  alt="estimate icon"
                  width={20}
                  height={20}
                />
                <p
                  className={cn(
                    "font-semibold text-white",
                    message.sender === "CLIENT" && "text-[#006D77]",
                  )}
                >
                  Requested an Estimate
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
