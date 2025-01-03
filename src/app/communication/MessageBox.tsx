import { FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { Message as TMessage } from "./internal/UsersArea";
import { FiMessageCircle } from "react-icons/fi";
import { IoIosArrowBack, IoMdSend, IoMdSettings } from "react-icons/io";
import { TiDeleteOutline, TiPlusOutline } from "react-icons/ti";
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
import AddUsersInGroupModal from "./internal/AddUsersInGroupModal";
// import Message from "./Message";

export default function MessageBox({
  user: receiverUser,
  setUsersList,
  messages,
  totalMessageBox,
  setMessages,
  fromGroup,
  group,
  setGroupsList,
}: {
  user?: User; // TODO: type this
  setUsersList?: React.Dispatch<React.SetStateAction<any[]>>;
  setGroupsList?: React.Dispatch<React.SetStateAction<any[]>>;
  messages: (TMessage & { attachment: Attachment | null })[];
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
  const [multiAttachmentFile, setMultiAttachmentFile] = useState<File[] | null>(
    null,
  );
  const [showAttachment, setShowAttachment] = useState(false);
  const pathname = usePathname();

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isEstimateAttachmentShow = pathname.includes(
    "/communication/collaboration",
  );

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
      // messageBoxRef.current.scrollIntoView({ behavior: "smooth" });
      setIsImageLoaded(false);
    }
  }, [messages, isImageLoaded]);

  async function handleSendMessage(e: any) {
    e.preventDefault();
    try {
      if (!message && !multiAttachmentFile) return;

      let attachmentFileUrl = null;

      if (multiAttachmentFile && multiAttachmentFile?.length > 0) {
        const formData = new FormData();
        multiAttachmentFile.forEach((photo) => {
          formData.append("photos", photo);
        });
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
        attachmentFileUrl = json.data;
      }

      const res = await fetch("/api/pusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: fromGroup ? group?.id : receiverUser?.id,
          type: fromGroup ? sendType.Group : sendType.User,
          message,
          attachmentFiles:
            attachmentFileUrl && attachmentFileUrl.length > 0
              ? (attachmentFileUrl as string[]).map((fileUrl, urlIndex) => {
                  const findFileIntoMultiFile = multiAttachmentFile?.find(
                    (_, fileIndex) => fileIndex === urlIndex,
                  );
                  return {
                    fileName: findFileIntoMultiFile?.name,
                    fileType: findFileIntoMultiFile?.type,
                    fileUrl: fileUrl,
                    fileSize: findFileIntoMultiFile?.size,
                  };
                })
              : null,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const newMessage: TMessage = {
          // userId: parseInt(session?.user?.id!),
          message,
          sender: "USER",
          attachment: json.attachments,
        };
        setMessages((messages) => [...messages, newMessage]);
        setMessage("");
        setMultiAttachmentFile(null);
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
      setUsersList((usersList) =>
        usersList.filter((u) => u.id !== receiverUser?.id),
      );
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
    const files = Array.from(event.target.files!).map((file) => file);
    setShowAttachment(false);
    setMultiAttachmentFile(files);
  };

  const handleDownload = async (fileUrl: string | null) => {
    const response = await fetch(fileUrl as string);
    const responseBlob = await response.blob();
    const blobURL = URL.createObjectURL(responseBlob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.setAttribute("download", fileUrl?.split("/").pop()!);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // this handler for mobile device
  const handleBack = () => {
    setUsersList && setUsersList([]);
    setGroupsList && setGroupsList([]);
  };

  const handleRemoveAttachment = (fileName: string) => {
    setMultiAttachmentFile(
      (multiFiles) =>
        multiFiles && multiFiles?.filter((file) => file?.name !== fileName),
    );
  };
  return (
    <div
      className={cn(
        "app-shadow flex h-[calc(100vh-50px)] w-full flex-col overflow-hidden border bg-white max-[1400px]:w-[100%] sm:h-full sm:rounded-lg",
        totalMessageBox > 2 && "sm:h-[44vh]",
      )}
    >
      {/* name and delete */}
      <div className="hidden items-center justify-between rounded-md bg-white px-2 py-1 sm:flex">
        <p className="text-sm">
          {fromGroup ? "Group Message" : "User Message"}
        </p>
        <FaTimes
          className="cursor-pointer text-sm"
          onClick={fromGroup ? handleGroupClose : handleUserClose}
        />
      </div>

      {/* Chat Header */}
      <div className="flex items-center justify-between gap-2 bg-[#006D77] p-3 text-white sm:rounded-sm">
        <div className="flex items-center gap-1">
          <button onClick={handleBack} className="flex-shrink-0 sm:hidden">
            <IoIosArrowBack size={20} className="font-bold" />
          </button>
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
                      index === 0 ? "ml-0" : "-ml-9 sm:-ml-8",
                    )}
                  />
                ))}
            </div>
          ) : (
            <Avatar photo={receiverUser?.image} width={50} height={50} />
          )}
          <div className="flex flex-col">
            <p className="flex flex-col text-[18px] font-bold sm:text-[20px]">
              {fromGroup
                ? group?.name
                : `${receiverUser?.firstName} ${receiverUser?.lastName}`}
              {receiverUser?.companyName && (
                <span className="text-sm font-light">
                  {receiverUser?.companyName}
                </span>
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
          <div className="flex flex-wrap items-center gap-2">
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
            <AddUsersInGroupModal
              users={group?.users || []}
              groupId={group?.id}
              setGroupsList={setGroupsList || null}
            />
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
              fromGroup={fromGroup}
              message={message}
              onDownload={handleDownload}
              setIsImageLoaded={setIsImageLoaded}
            />
          );
        })}
      </div>

      {/* attachments */}
      {multiAttachmentFile && multiAttachmentFile.length > 0 && (
        <div className="relative h-32 bg-[#D9D9D9]">
          <TiDeleteOutline
            onClick={() => setMultiAttachmentFile(null)}
            className="absolute right-2 top-2 cursor-pointer rounded-full text-red-500"
            size={40}
          />
          <div className="grid grid-cols-10 items-start space-x-3 overflow-x-auto p-4">
            {multiAttachmentFile?.map((attachmentFile) => {
              return (
                <div key={attachmentFile.name}>
                  <div key={attachmentFile.name} className="relative w-fit">
                    <TiDeleteOutline
                      onClick={() =>
                        handleRemoveAttachment(attachmentFile.name)
                      }
                      className="absolute -right-2 -top-2 cursor-pointer rounded-full bg-white"
                      size={20}
                    />
                    {attachmentFile.type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(attachmentFile)}
                        // placeholder="blur"
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
                          {(attachmentFile.size / 1024 / 1024).toPrecision(2)}{" "}
                          MB
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm">{attachmentFile.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        className="relative flex h-[8%] items-center gap-2 bg-[#D9D9D9] p-2"
        onSubmit={(e) => startTransition(() => handleSendMessage(e))}
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
            {isEstimateAttachmentShow && (
              <InvoiceEstimateModal
                setShowAttachment={setShowAttachment}
                setMessages={setMessages}
                receiverUser={receiverUser!}
              />
            )}
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
          multiple
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
