import { tempClients } from "@/lib/tempClients";
import { Vehicle } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaRegCheckCircle,
} from "react-icons/fa";
import { IoIosFlash } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
const sharedFiles = [
  {
    url: "/icons/image.png",
  },
  {
    url: "/icons/image.png",
  },
  {
    url: "/icons/media.png",
  },
  {
    url: "/icons/bar.png",
  },
];
function downloadAttachment(
  filename: string,
  mimeType: string,
  base64Data: string,
) {
  // Replace URL-safe base64 characters
  base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");

  // Handle padding (if needed)
  const padding = "=".repeat((4 - (base64Data.length % 4)) % 4);
  base64Data += padding;

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Details({
  id,
  conversations,
  vehicles,
}: {
  id: string;
  conversations: any[];
  vehicles: Vehicle[];
}) {
  const user = tempClients.find((user: any) => user.id == id);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  return (
    <div className="app-shadow h-[83vh] w-[40%] rounded-lg bg-white">
      {/* Client Heading */}
      <div className="2xl:[25%] flex h-[35%] items-center justify-between bg-[#006D77] text-xs 2xl:text-base">
        <div className="h-[180px] w-[70%] rounded-lg">
          {/* Header */}
          <h2 className="p-3 text-white">Client Data</h2>
          {/* Content */}
          <div className="flex flex-col items-center gap-5 px-5 2xl:flex-row">
            <Image
              src={user!.image}
              alt="user"
              width={50}
              height={50}
              className="m h-[50px] w-[50px] 2xl:h-[110px] 2xl:w-[110px]"
            />

            <div className="flex flex-col">
              <h2 className="text-white">{user!.name}</h2>
              <p className="text-white">Email : client@example.com</p>
              <p className="text-white">Phone : 0123456789</p>
            </div>
          </div>
        </div>
        <div className="mr-2 h-[90%] space-y-4 rounded bg-[#63a6ac] p-4 text-sm text-white">
          <div className="flex items-center justify-between gap-x-8">
            <div>
              <span className="mr-4 font-semibold">
                Vehicle {selectedVehicleIndex + 1}
              </span>
              <span className="">
                {vehicles[selectedVehicleIndex]?.year}{" "}
                {vehicles[selectedVehicleIndex]?.make}{" "}
                {vehicles[selectedVehicleIndex]?.model}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaArrowLeft
                onClick={() => {
                  if (selectedVehicleIndex > 0) {
                    setSelectedVehicleIndex(selectedVehicleIndex - 1);
                  } else {
                    setSelectedVehicleIndex(vehicles.length - 1);
                  }
                }}
              />
              <FaArrowRight
                onClick={() => {
                  if (selectedVehicleIndex < vehicles.length - 1) {
                    setSelectedVehicleIndex(selectedVehicleIndex + 1);
                  } else {
                    setSelectedVehicleIndex(0);
                  }
                }}
              />
            </div>
          </div>
          <div className="">
            <p className="font-semibold">Service Requested :</p>
            <p>Service 1, Service 2, Service 3, Service 4, Service 5</p>
          </div>
        </div>
      </div>

      {/* Client Description */}
      <div className="h-[65%] space-y-4 overflow-y-auto px-4 2xl:h-[65%]">
        {/* client notes */}
        <div>
          <h2 className="mt-2 py-3 text-[#797979]">Client Notes</h2>
          <p className="rounded-md border border-emerald-600 p-2 text-xs text-[#797979]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
            consequuntur similique at ipsa sapiente non aspernatur dolorum.
            Quia, laboriosam autem ut corrupti officia modi cum saepe ipsam!
            Dignissimos, repudiandae repellendus. Beatae quod quas esse. Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Sed consequuntur
            similique at ipsa sapiente non aspernatur dolorum. Quia, laboriosam
            autem ut corrupti officia modi cum saepe ipsam! Dignissimos,
            repudiandae repellendus. Beatae quod quas esse.
          </p>
        </div>
        {/* shared files */}
        <div>
          <p>Shared Files</p>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            {conversations.map((email: any) =>
              email.attachments.map((attachment: any, index: number) => (
                <div
                  className="rounded-md border border-emerald-600 p-5"
                  key={index}
                  onClick={() =>
                    downloadAttachment(
                      attachment.filename,
                      attachment.mimeType,
                      attachment.data,
                    )
                  }
                >
                  <Image
                    width={20}
                    height={20}
                    src="/icons/image.png"
                    alt="file"
                  />
                  <p>{attachment.filename}</p>
                </div>
              )),
            )}
          </div>
        </div>
        {/* estimate and invoices */}
        <div>
          <p>Estimate and Invoices</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            {new Array(5).fill(0).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-x-4 rounded-full border border-emerald-600 px-2 py-1"
              >
                <span>Estimate #123456</span>
                <span>
                  <AiOutlineCloseCircle />
                </span>
              </div>
            ))}
            <button className="rounded-full bg-gray-400 px-6 py-1 text-white">
              <FaPlus />
            </button>
          </div>
        </div>
        {/* task */}
        <div>
          <p>Task List</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            {new Array(5).fill(0).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-x-4 rounded-full bg-[#6571FF] px-2 py-1 text-white"
              >
                <span>This is task 1</span>
                <span className="flex items-center gap-x-2">
                  <MdOutlineEdit />
                  <FaRegCheckCircle />
                </span>
              </div>
            ))}
            <button className="rounded-full bg-gray-400 px-6 py-1 text-white">
              <FaPlus />
            </button>
          </div>
        </div>

        {/*  */}
        <div className="mt-auto">
          <p className="flex items-center gap-x-2">
            <span className="text-yellow-500">
              <IoIosFlash />
            </span>
            <span className="text-xs text-[#006D77]">
              Typically replies in a few seconds
            </span>
          </p>
          <p className="flex items-center gap-x-2">
            <span className="text-yellow-500">
              <IoIosFlash />
            </span>
            <span className="text-xs text-[#006D77]">
              Typically replies in a few hours
            </span>
          </p>
          <p className="flex items-center gap-x-2">
            <span className="text-yellow-500">
              <IoIosFlash />
            </span>
            <span className="text-xs text-[#006D77]">
              Typically replies in a few days
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
