import Image from "next/image";
import React from "react";
import { IoMdSettings } from "react-icons/io";

export default function ClientInformation() {
  return (
    <div className="mb-8 w-full px-4 py-8 shadow-md">
      <h3 className="my-2 font-semibold">Client Details</h3>
      <div className="">
        <div className="relative flex w-full items-center rounded border border-gray-200 bg-white p-3">
          <div className="mr-3 flex flex-col items-center">
            <Image
              src="/icons/salesEmp.png"
              alt="Client"
              width={200}
              height={200}
              className="h-auto w-auto rounded-full"
            />
            {/* <div className="mt-2 text-gray-600">{role}</div> */}
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="mb-1 flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Name</label>
              <input
                type="text"
                value="John Doe"
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
            <div className="mb-1 flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Email</label>
              <input
                type="email"
                value="autoworx@website.com"
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
            <div className="mb-1 flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Phone</label>
              <input
                type="text"
                value="01244645587"
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Address</label>
              <input
                type="text"
                value="Bangladesh, Dhaka"
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
          </div>
        </div>
        <div className="tags mt-4 flex items-center gap-x-4">
          <span className="rounded-sm bg-gray-500 px-3 py-1 text-xs text-white">
            VIP
          </span>
          <span className="rounded-sm bg-gray-800 px-3 py-1 text-xs text-white">
            Very Rude
          </span>
        </div>
      </div>

      {/* <Payout /> */}
    </div>
  );
}
