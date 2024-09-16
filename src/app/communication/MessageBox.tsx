import { FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { Message as TMessage } from "./internal/UsersArea";
import { FiMessageCircle } from "react-icons/fi";
import { IoMdSend, IoMdSettings } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { sendType } from "@/types/Chat";
import { Attachment, Group, User } from "@prisma/client";
import { deleteUserFromGroup } from "@/actions/communication/internal/deleteUserFromGroup";
import { useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";
import Message from "./Message";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import InvoiceEstimateModal from "./collaboration/InvoiceEstimateModal";
import { getUserInGroup } from "@/actions/communication/internal/query";
// import Message from "./Message";

export default function MessageBox({
  user,
  setUsersList,
  messages,
  totalMessageBox,
  setMessages,
  fromGroup,
  group,
  setGroupsList,
  companyName,
}: {
  user?: User; // TODO: type this
  setUsersList?: React.Dispatch<React.SetStateAction<any[]>>;
  setGroupsList?: React.Dispatch<React.SetStateAction<any[]>>;
  messages: (TMessage & { attachment: Attachment | null })[];
  companyName?: string | null;
  totalMessageBox: number;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  fromGroup?: boolean;
  group?: Group & { users: User[] };
}) {
  const attachmentRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const { data: session } = useSession();
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [showAttachment, setShowAttachment] = useState(false);
  const pathname = usePathname();
  const isEstimateAttachmentShow = pathname.includes(
    "/communication/collaboration",
  );

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
      // messageBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      if (!message && !attachmentFile) return;

      let attachmentFileUrl = null;

      if (attachmentFile) {
        const formData = new FormData();
        formData.append("photos", attachmentFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          // setError("Failed to upload photos");
          console.error("Failed to upload photos");
          // setImageSrc(null);
        }

        const json = await uploadRes.json();
        attachmentFileUrl = json.data[0];
      }

      const res = await fetch("/api/pusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: fromGroup ? group?.id : user?.id,
          type: fromGroup ? sendType.Group : sendType.User,
          message,
          attachmentFile: attachmentFile
            ? {
                fileName: attachmentFile?.name,
                fileType: attachmentFile?.type,
                fileUrl: attachmentFileUrl,
                fileSize: attachmentFile?.size,
              }
            : null,
        }),
      });

      const json = await res.json();

      if (json.success) {
        const newMessage: TMessage = {
          // userId: parseInt(session?.user?.id!),
          message,
          sender: "USER",
          attachment: json.attachment,
        };
        setMessages((messages) => [...messages, newMessage]);
        setMessage("");
        setAttachmentFile(null);
      } else {
        toast.error(json.message);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  const handleGroupClose = () => {
    setGroupsList &&
      setGroupsList((groupList) => groupList.filter((g) => g.id !== group?.id));
  };

  const handleUserClose = () => {
    setUsersList &&
      setUsersList((usersList) => usersList.filter((u) => u.id !== user?.id));
  };

  const handleDeleteUserFromGroupList = async (userId: number) => {
    const isUserExistInGroup = await getUserInGroup(
      parseInt(session?.user?.id!),
      group?.id!,
    );
    if (!isUserExistInGroup) {
      toast.error("You can not remove this User from this group");
      return;
    }
    const response = await deleteUserFromGroup(userId, group?.id!);
    if (response.status === 200) {
      if (userId === parseInt(session?.user?.id!)) {
        handleGroupClose();
      } else {
        setGroupsList &&
          setGroupsList((groupList) =>
            groupList.map((g) => {
              if (g.id === group?.id) {
                return {
                  ...g,
                  users: g.users.filter((user: User) => user.id !== userId),
                };
              }
              return g;
            }),
          );
      }
    }
  };

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    setAttachmentFile(file!);
    setShowAttachment(false);
  };

  const handleDownload = async (fileUrl: string | null) => {
    const response = await fetch(`/api/download/${fileUrl}`);
    const responseBlob = await response.blob();
    const blobURL = URL.createObjectURL(responseBlob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.setAttribute("download", fileUrl?.split("/").pop()!);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <div
      className={cn(
        "app-shadow flex w-full flex-col overflow-hidden rounded-lg border bg-white max-[1400px]:w-[100%]",
        totalMessageBox > 2 && "h-[44vh]",
      )}
    >
      {/* name and delete */}
      <div className="flex items-center justify-between rounded-md bg-white px-2 py-1">
        <p className="text-sm">
          {fromGroup ? "Group Message" : "User Message"}
        </p>
        <FaTimes
          className="cursor-pointer text-sm"
          onClick={fromGroup ? handleGroupClose : handleUserClose}
        />
      </div>

      {/* Chat Header */}
      <div className="flex items-center justify-between gap-2 rounded-sm bg-[#006D77] p-3 text-white">
        <div className="flex items-center gap-1">
          {fromGroup ? (
            <div className="flex items-center">
              {group?.users
                .slice(0, 4)
                .map((groupUser: any, index: number) => (
                  <Avatar
                    key={groupUser.id}
                    photo={groupUser.image}
                    width={50}
                    height={50}
                    className={cn(
                      "rounded-full",
                      index === 0 ? "ml-0" : "-ml-8",
                    )}
                  />
                ))}
            </div>
          ) : (
            <Avatar photo={user?.image} width={50} height={50} />
          )}
          <div className="flex flex-col">
            <p className="flex flex-col text-[20px] font-bold">
              {fromGroup ? group?.name : `${user?.firstName} ${user?.lastName}`}
              {companyName && (
                <span className="text-sm font-light">{companyName}</span>
              )}
            </p>
          </div>
          {fromGroup && (
            <>
              {openSettings ? (
                <MdModeEdit className="ml-3 size-6 cursor-pointer" />
              ) : (
                <IoMdSettings
                  onClick={() => setOpenSettings(true)}
                  className="ml-3 size-6 cursor-pointer"
                />
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-x-4">
          <div className="rounded-full bg-[#579FA5] p-1">
            <FiMessageCircle className="size-6" />
          </div>
          <Image src="/icons/Email.png" alt="email" width={24} height={24} />
          <Image src="/icons/Phone.png" alt="phone" width={20} height={15} />
        </div>
      </div>

      {/* group user setting */}
      {fromGroup && openSettings && (
        <div className="flex w-full items-center justify-between rounded-sm bg-[#D9D9D9] p-3">
          <div className="flex flex-wrap items-center space-x-2">
            {group?.users.map((user: User) => (
              <div
                key={user.id}
                className="flex items-center justify-between space-x-1 rounded-full bg-[#006D77] px-2 py-1 text-white"
              >
                <p className="text-sm">{user.firstName}</p>
                <TiDeleteOutline
                  onClick={() => handleDeleteUserFromGroupList(user.id)}
                  className="size-5 cursor-pointer"
                />
              </div>
            ))}
          </div>
          <p>
            <TiDeleteOutline
              onClick={() => setOpenSettings(false)}
              className="size-10 cursor-pointer text-[#006D77]"
            />
          </p>
        </div>
      )}

      {/* Messages */}
      <div
        id="messageBox"
        className="h-[82%] overflow-y-scroll"
        ref={messageBoxRef}
      >
        {messages.map((message: TMessage, index: number) => {
          return (
            <Message
              key={index}
              message={message}
              onDownload={handleDownload}
            />
          );
        })}
      </div>

      {/* attachments */}
      {attachmentFile && (
        <div className="h-32 bg-[#D9D9D9]">
          <div className="p-4">
            <div className="relative w-fit">
              <TiDeleteOutline
                onClick={() => setAttachmentFile(null)}
                className="absolute -right-2 -top-2 cursor-pointer rounded-full bg-white"
                size={20}
              />
              {attachmentFile.type.includes("image") ? (
                <Image
                  src={URL.createObjectURL(attachmentFile)}
                  alt=""
                  className="rounded-sm"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="space-y-1 rounded-md bg-[#006D77] px-5 py-2 text-white">
                  <p>{attachmentFile.name}</p>
                  <p>
                    file size:{" "}
                    {(attachmentFile.size / 1024 / 1024).toPrecision(2)} MB
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm">{attachmentFile.name}</p>
          </div>
        </div>
      )}

      {/* Input */}
      <form
        className="relative flex h-[8%] items-center gap-2 bg-[#D9D9D9] p-2"
        onSubmit={(e) => startTransition(() => handleSubmit(e))}
      >
        {/* attachment or estimate dropdown */}
        {showAttachment && (
          <div
            className={cn(
              "absolute -top-[55px] space-y-1",
              isEstimateAttachmentShow ? "-top-[55px]" : "-top-[27px]",
            )}
          >
            <p
              onClick={() => attachmentRef.current?.click()}
              className="cursor-pointer text-nowrap rounded-md border border-[#006D77] bg-white px-2 text-sm text-[#006D77] hover:bg-[#006D77] hover:text-white"
            >
              Attach Document/Media
            </p>
            {isEstimateAttachmentShow && <InvoiceEstimateModal />}
          </div>
        )}
        <Image
          onClick={() => setShowAttachment(!showAttachment)}
          className="cursor-pointer"
          src="/icons/Attachment.svg"
          width={24}
          height={24}
          alt="attachment"
        />
        <input
          accept="*"
          ref={attachmentRef}
          onChange={handleAttachment}
          hidden
          type="file"
        />
        <input
          type="text"
          placeholder="Send Message..."
          className="h-5 w-full rounded-md border-none px-2 py-5 text-base focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button disabled={pending} className="" type="submit">
          {/* <Image src="/icons/Send.svg" width={20} height={20} alt="send" /> */}
          <IoMdSend className="size-6 text-[#006D77]" />
        </button>
      </form>
    </div>
  );
}
