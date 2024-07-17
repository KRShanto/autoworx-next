import Image from "next/image";
import React from "react";
import { IoMdSettings } from "react-icons/io";

export default function ClientInformation() {
  return (
    <div className="mb-8 mt-5 flex w-full justify-between gap-5 px-4">
      <div className="relative flex w-full items-center rounded border border-gray-300 bg-white p-3">
        <div className="mr-3 flex flex-col items-center">
          <Image
            src="/icons/salesEmp.png"
            alt="Client"
            width={100}
            height={100}
            className="h-auto w-auto rounded-full"
          />
          {/* <div className="mt-2 text-gray-600">{role}</div> */}
        </div>

        <div className="w-full text-sm">
          <div className="mb-1 flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Name</label>
            <input
              type="text"
              value="John Doe"
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
          <div className="mb-1 flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Email</label>
            <input
              type="email"
              value="noman@website.com"
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
          <div className="mb-1 flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Phone</label>
            <input
              type="text"
              value="01244645587"
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Address</label>
            <input
              type="text"
              value="Bangladesh, Dhaka"
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* <Payout /> */}
    </div>
  );
}
